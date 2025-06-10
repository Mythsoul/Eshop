import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "@/config/db";

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        
        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const user = await /** @type {any} */ (User).findById(userId)
        
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({ 
            success: true, 
            cartItems: user.cartItems || {}
        })

    } catch (error) {
        console.error("Error fetching cart:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}