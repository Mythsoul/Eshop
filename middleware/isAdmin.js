import { auth, clerkClient } from "@clerk/nextjs/server";
import User from "@/models/user";
import connectDB from "@/config/db";

export default async function isAdmin() {
    try {
        const { userId } = await auth();
        if (!userId) return false;

        await connectDB();
        
        // Find user in MongoDB
        const user = await User.findById(userId);
        if (!user) return false;

        // Check Clerk user role using the newer API
        const clerkUser = await clerkClient.users.getUser(userId);
        const userRoles = clerkUser.publicMetadata?.role?.split(',').map(r => r.trim()) || [];
        const isAdminRole = userRoles.includes('admin');

        // Update user admin status in MongoDB if needed
        if (user.isAdmin !== isAdminRole) {
            user.isAdmin = isAdminRole;
            await user.save();
        }

        return isAdminRole;
    } catch (error) {
        console.error("Admin check error:", error);
        return false;
    }
}