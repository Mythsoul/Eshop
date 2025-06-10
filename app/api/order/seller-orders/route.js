import Product from "@/models/product"
import { getAuth } from "@clerk/nextjs/server"
import connectDB from "@/config/db"
import Order from "@/models/Order"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        await connectDB()

        const { userId } = getAuth(request)
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        // First get all products owned by the seller
        const sellerProducts = await Product.find({ userId }).select('_id')
        const productIds = sellerProducts.map(product => product._id)

        // Find orders that contain any of the seller's products
        const orders = await Order.find({
            'items.product': { $in: productIds }
        })
        .populate({
            path: 'items.product',
            model: Product
        })
        .lean()
        .exec()

        return NextResponse.json({ success: true, orders })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
