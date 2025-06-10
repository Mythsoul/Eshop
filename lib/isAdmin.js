import { clerkClient } from "@clerk/nextjs";

const isAdmin = async (userId) => {
    if (!userId) return false;
    
    try {
        const user = await clerkClient.users.getUser(userId);
        return user?.publicMetadata?.role?.includes('admin') || false;
    } catch (error) {
        console.error('Admin check error:', error);
        return false;
    }
}

export default isAdmin;
