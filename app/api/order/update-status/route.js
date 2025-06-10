import { getAuth } from "@clerk/nextjs/server"
import connectDB from "@/config/db"
import Order from "@/models/Order"
import { NextResponse } from "next/server"
import Product from "@/models/product"

export async function PUT(request) {
    try {
        await connectDB()

        const { userId } = getAuth(request)
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const { orderId, status } = await request.json()

        // Get seller's products
        const sellerProducts = await Product.find({ userId }).select('_id')
        const productIds = sellerProducts.map(product => product._id.toString())

        // Find the order and verify seller owns at least one product in it
        const order = await Order.findById(orderId).populate('items.product')
        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
        }

        // Check if seller owns any products in this order
        const hasSellerProducts = order.items.some(item => 
            productIds.includes(item.product._id.toString())
        )

        if (!hasSellerProducts) {
            return NextResponse.json({ success: false, message: "Unauthorized to update this order" }, { status: 403 })
        }

        // Update status
        order.status = status
        await order.save()

        return NextResponse.json({ success: true, order })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
