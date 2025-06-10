import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import clerkClient from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        // Connect to database
        await connectDB();

        // Get the requesting user's ID and verify authentication
        const { userId } = await getAuth(request);
        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: "Unauthorized" 
            }, { status: 401 });
        }
    const removerole = await clerkClient.users.updateUser(userId, {
        publicMetadata: {
            role: "user",
        },
    });
    const updatedUser = await clerkClient.users.getUser(userId);

        return NextResponse.json({ 
            success: true, 
            message: "All roles removed successfully",
            user: updatedUser 
        });

    } catch (error) {
        console.error('Error removing roles:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Failed to remove roles" 
        }, { status: 500 });
    }
}
