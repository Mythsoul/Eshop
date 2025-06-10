import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import clerkClient from "@clerk/clerk-sdk-node";

export async function GET(request) {
    try {
        const { userId } = await getAuth(request);
        if (!userId) {
            return NextResponse.json({ 
                success: false,
                isAdmin: false,
                message: "Unauthorized" 
            }, { status: 401 });
        }

        const user = await clerkClient.users.getUser(userId);
        const isAdmin = user?.publicMetadata?.role?.includes('admin') || false;

        return NextResponse.json({ 
            success: true,
            isAdmin,
            message: isAdmin ? "User is admin" : "User is not admin"
        });

    } catch (error) {
        console.error('Admin check error:', error);
        return NextResponse.json({ 
            success: false,
            isAdmin: false,
            message: error.message || "Failed to check admin status"
        }, { status: 500 });
    }
}
