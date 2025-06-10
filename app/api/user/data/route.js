import connectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // First try to find the user
    let user = await User.findById(userId);
     const isSeller = user ? user.isSeller : false;
    // If user doesn't exist, create a new one
    if (!user) {
      // Create a basic user record with just the ID and a unique email
      try {
        user = await User.create({
          _id: userId,
          name: 'User',
          email: `user-${userId}@example.com`, // Make email unique using userId
          imageUrl: '',
          cartItems: {}, 
          isSeller: false,
          isAdmin: false 
        });
      } catch (createError) {
        // Log to proper error monitoring service in production
        return NextResponse.json({ success: false, message: "Error creating user" }, { status: 500 });
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const requestData = await request.json();
    
    await connectDB();
    const user = await User.findByIdAndUpdate(
      userId,
      requestData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
