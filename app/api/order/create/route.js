import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/config/db"
import Product from "@/models/product"
import User from "@/models/user"
import Order from "@/models/Order"
import { inngest } from "@/config/inngest"
import mongoose from "mongoose"
export async function POST(request){
    try {
        await connectDB()

        const {userId} = getAuth(request)
        if (!userId) {
            return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401})
        }
         
        const { address, items, paymentMethod } = await request.json()
        
     console.log(address, items, paymentMethod , request) ; 

    if (!paymentMethod || !['esewa', 'khalti'].includes(paymentMethod)) {
      return NextResponse.json({ success: false, message: "Invalid payment method" }, { status: 400 })
    };
        if(!items || items.length === 0){
            return NextResponse.json({success: false, message: "No items in cart"}, {status: 400})
        }  
        
  
        // Validate address
        if(!address || !address.fullName || !address.area || !address.city || !address.province) {
            return NextResponse.json({success: false, message: "Complete address details are required"}, {status: 400})
        }
        // Find user first
        const user = await User.findById(userId).exec()
        if (!user) {
            return NextResponse.json({success: false, message: "User not found"}, {status: 404})
        }

        // Get all available products
        // @ts-ignore - Mongoose typing issue
        const allProducts = await Product.find({}).sort({ date: -1 }).exec();
        
        // Map to store available products by ID for quick lookup
        const availableProducts = new Map();
        allProducts.forEach(product => {
            availableProducts.set(product._id.toString(), product);
        });

        // Validate items, stock availability, and map to available products
        const products = [];
        const missingProducts = [];
        const insufficientStockProducts = [];

        for (const item of items) {
            const product = availableProducts.get(item.product);
            if (product) {
                // Check if enough stock is available
                if (product.stock < item.quantity) {
                    insufficientStockProducts.push({
                        name: product.name,
                        available: product.stock,
                        requested: item.quantity
                    });
                } else {
                    products.push(product);
                }
            } else {
                missingProducts.push(item.product);
            }
        }

        // Handle missing products
        if (missingProducts.length > 0) {
            user.cartItems = {};
            await user.save();

            return NextResponse.json({
                success: false, 
                message: `Your cart contains products that are no longer available. We've cleared your cart - please add available products and try again.`,
                missingProducts
            }, {status: 404});
        }

        // Handle insufficient stock
        if (insufficientStockProducts.length > 0) {
            return NextResponse.json({
                success: false,
                message: "Some products don't have enough stock available",
                insufficientStockProducts
            }, { status: 400 });
        }

        // Calculate amount using reduce
        const amount = items.reduce((acc, item) => {
            const product = products.find(p => p._id.toString() === item.product);
            return acc + (product.offerPrice || product.price) * item.quantity;
        }, 0);

        // Calculate tax and total amount
        const tax = Math.floor(amount * 0.02); // 2% tax
        const totalAmount = amount + tax;

        // Use a transaction for atomicity
        const session = await mongoose.startSession();
        let order;
        
        try {
            session.startTransaction();

            order = new Order({
                userId: userId,
                items: items.map(item => {
                    const product = availableProducts.get(item.product);
                    // Ensure we have a valid sellerId for the order
                    const sellerId = product.sellerId || product.userId;
                    if (!sellerId) {
                        throw new Error(`No seller found for product: ${product.name}`);
                    }
                    return {
                        product: item.product,
                        sellerId: sellerId,
                        quantity: item.quantity
                    };
                }),
                totalAmount,
                tax,
                address: {
                    userId: userId,
                    fullName: address.fullName,
                    PhoneNumber: address.PhoneNumber,
                    zipcode: address.zipcode,
                    area: address.area,
                    city: address.city,
                    province: address.province
                },
                status: 'Pending Payment',
                date: new Date(),
                paymentMethod
            });

            // Save the order
            await order.save({ session });

            // Update product stock levels
            for (const item of items) {
                await Product.updateOne(
                    { _id: item.product },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }

            // Clear user's cart
            user.cartItems = {};
            await user.save({ session });

            // Process payment here
            try {
                // TODO: Integrate actual payment gateway
                const paymentSuccess = true; // Simulate payment success
                
                if (paymentSuccess) {
                    order.status = 'Order Placed';
                    await order.save({ session });
                    await session.commitTransaction();
                    
                    // Send order created event
                    await inngest.send({
                        name: "order/created",
                        data: {
                            orderId: order._id.toString(),
                            userId,
                            items: items.map(item => ({
                                product: item.product,
                                quantity: item.quantity
                            })),
                            amount: totalAmount,
                            tax,
                            address,
                            status: 'Order Placed'
                        }
                    });
                } else {
                    throw new Error('Payment failed');
                }
            } catch (paymentError) {
                // Rollback transaction if payment fails
                await session.abortTransaction();
                throw new Error(paymentError.message || 'Payment processing failed');
            }
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }



        return NextResponse.json({
            success: true, 
            message: "Order placed successfully",
            orderId: order._id,
            orderDetails: order
        });

    } catch(error) {
        console.error("Error creating order:", error);
        return NextResponse.json({
            success: false, 
            message: error.message || "Failed to create order"
        }, {status: 500});
    }
}
