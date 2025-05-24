import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";
import connectDB from "@/config/db";
import Product from "@/models/product";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function PUT(request) {
    try {
        // Get user ID from Clerk
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Check if user is a seller
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized as seller" }, { status: 403 });
        }

        // Connect to database
        await connectDB();

        // Parse form data
        const formData = await request.formData();
        const productId = formData.get('productId');
        
        // Find the product and check if it belongs to the seller
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        const isPopular = formData.get('isPopular') === 'true';
        
        // Update product fields
        const updateData = {
            name: formData.get('name') || product.name,
            description: formData.get('description') || product.description,
            category: formData.get('category') || product.category,
            price: formData.get('price') || product.price,
            offerPrice: formData.get('offerPrice') || product.offerPrice,
            shippingFee: formData.get('shippingFee') || product.shippingFee,
            deliveryCharge: formData.get('deliveryCharge') || product.deliveryCharge,
            sellerName: formData.get('sellerName') || product.sellerName,
            brand: formData.get('brand') || product.brand,
            color: formData.get('color') || product.color,
            isPopular: isPopular,
            deliveryDate: formData.get('deliveryDate') || product.deliveryDate,
            stock: formData.get('stock') || product.stock,
            warrantyDuration: formData.get('warrantyDuration') || product.warrantyDuration,
            returnPeriod: formData.get('returnPeriod') || product.returnPeriod,
        };

        // Handle image uploads if provided
        const images = formData.getAll('images');
        if (images && images.length > 0 && images[0] instanceof File) {
            const uploadPromises = images.map(async (image) => {
                if (image.size === 0) return null;
                
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);
                
                // Convert buffer to base64
                const base64String = buffer.toString('base64');
                const dataURI = `data:${image.type};base64,${base64String}`;
                
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: 'quickcart'
                });
                
                return result.secure_url;
            });
            
            const uploadedImages = await Promise.all(uploadPromises);
            const validImages = uploadedImages.filter(img => img !== null);
            
            if (validImages.length > 0) {
                updateData.images = validImages;
            }
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        );

        return NextResponse.json({ 
            success: true, 
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "An error occurred while updating the product" 
        }, { status: 500 });
    }
}
