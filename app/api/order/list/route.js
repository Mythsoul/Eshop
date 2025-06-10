import Address from "@/models/address"
import Product from "@/models/product"
import { getAuth } from "@clerk/nextjs/server"
import connectDB from "@/config/db"
import Order from "@/models/Order"
import { NextResponse } from "next/server"


export async function GET(request){
    try {
        await connectDB()

        const {userId} = getAuth(request)
        if (!userId) {
            return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401})
        }

        // @ts-ignore - Mongoose typing issue
        const orders = await Order.find({userId})
            .populate({
                path: 'items.product',
                model: Product
            })
            .lean()
            .exec()

        return NextResponse.json({success: true, orders})
    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}
