import { NextResponse  , NextRequest} from "next/server";
import connectDB from "@/config/db";
import clerkClient from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        // Connect to database
        await connectDB();

        // Get the requesting user's ID and verify admin status
        const { userId } = await getAuth(request);
        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: "Unauthorized" 
            }, { status: 401 });
        }

        // Get the requesting user's current role
        const requestingUser = await clerkClient.users.getUser(userId);
        if (!requestingUser.publicMetadata?.role?.includes('admin')) {
            return NextResponse.json({ 
                success: false, 
                message: "Only admins can add other admins" 
            }, { status: 403 });
        }

        // Get target user ID from request body
        // const { targetUserId } = await request.json();
        // if (!targetUserId) {
        //     return NextResponse.json({ 
        //         success: false, 
        //         message: "Target user ID is required" 
        //     }, { status: 400 });
        // }

        // Get target user and check current role
        // const targetUser = await clerkClient.users.getUser(targetUserId);
        // const currentRole = targetUser.publicMetadata?.role || '';

        // Prevent duplicate admin role
        // if (currentRole.includes('admin')) {
        //     return NextResponse.json({ 
        //         success: false, 
        //         message: "User is already an admin" 
        //     }, { status: 400 });
        // }

        // Update user role
        const previousRoles = requestingUser.publicMetadata?.role || '';
        if (previousRoles.includes('admin')) {
            return NextResponse.json({ 
                success: false, 
                message: "User is already an admin" 
            }, { status: 400 });
        }

        // Add both admin and seller roles
        const newRoles = ['admin', 'seller'];
        if (previousRoles) {
            newRoles.push(...previousRoles.split(',').filter(role => 
                !['admin', 'seller'].includes(role.trim())
            ));
        }

        const updatedUser = await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: { 
                role: newRoles.join(',')
            },
        });

        return NextResponse.json({ 
            success: true, 
            message: "Admin role added successfully",
            user: updatedUser 
        });

    } catch (error) {
        console.error('Error adding admin:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Failed to add admin role" 
        }, { status: 500 });
    }
}

