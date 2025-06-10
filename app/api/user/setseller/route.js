import { NextResponse  , NextRequest } from "next/server";
import {getAuth} from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/user";
import clerkClient from "@clerk/clerk-sdk-node";
export async function POST(request){ 
    const { userId } = getAuth(request)
    await connectDB()
    const user = await User.findById(userId)
    if (!user) {
        return NextResponse.json({success: false, message: "User not found"}, {status: 404})
    }

   const setSeller =clerkClient.users.updateUserMetadata(userId, {
    publicMetadata : { 
        role : "seller",
    }})


    user.isSeller = true
    user.save()
    return NextResponse.json({success: true, message: "User updated successfully"}, {status: 200})
   }
   
