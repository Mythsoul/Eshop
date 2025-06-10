import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/user"
import connectDB from "@/config/db"


export async function POST(request) {
    try {
        const { userId } = getAuth(request)

        const { cartData } = await request.json()

        await connectDB()
        // @ts-ignore - Mongoose typing issue
        const user = await User.findById(userId).exec()
        
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
        }

        user.cartItems = cartData
        await user.save()

       return NextResponse.json({ success: true });
        
    } catch (error) {
       return NextResponse.json({ success: false, error: error.message });
    }
}