import User from "@/models/user";
import connectDB from "@/config/db";
import clerkClient from "@clerk/clerk-sdk-node";

const authSeller = async (userId) => {
    if (!userId) return false;
    
    try {
        const user = await clerkClient.users.getUser(userId);
        const roleString = user?.publicMetadata?.role;
        const userRoles = typeof roleString === 'string' ? roleString.split(',').map(r => r.trim()) : [];
        
        // Allow access if user is either seller or admin
        return userRoles.includes('seller') || userRoles.includes('admin');
        
    } catch (error) {
        console.error('Auth seller error:', error);
        return false;
    }
}

export default authSeller;