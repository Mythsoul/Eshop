import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { checkUserRole } from "@/lib/checkUserRole";

export function requireRole(requiredRole) {
    return async (request) => {
        try {
            const { userId } = getAuth(request);
            if (!userId) {
                return NextResponse.json({ 
                    success: false, 
                    message: "Unauthorized" 
                }, { status: 401 });
            }

            const userRoles = await checkUserRole(userId);
            if (!Array.isArray(userRoles)) {
                return NextResponse.json({ 
                    success: false, 
                    message: "Failed to verify user role" 
                }, { status: 500 });
            }

            if (!userRoles.includes(requiredRole) && !userRoles.includes('admin')) {
                return NextResponse.json({ 
                    success: false, 
                    message: `This action requires ${requiredRole} role` 
                }, { status: 403 });
            }

            return NextResponse.next();
        } catch (error) {
            // Log to proper error monitoring service in production
            return NextResponse.json({ 
                success: false, 
                message: "Error checking user role" 
            }, { status: 500 });
        }
    };
}
