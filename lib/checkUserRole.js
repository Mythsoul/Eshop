import { clerkClient } from "@clerk/clerk-sdk-node";

export const checkUserRole = async (userId) => {
    if (!userId) return null;
    
    try {
        const user = await clerkClient.users.getUser(userId);
        const roleString = user?.publicMetadata?.role;
        if (typeof roleString !== 'string') return ['user'];
        return roleString.split(',').map(role => role.trim());
    } catch (error) {
        console.error('Check user role error:', error);
        return null;
    }
};

export const isAdmin = async (userId) => {
    const roles = await checkUserRole(userId);
    return Array.isArray(roles) && roles.includes('admin');
};

export const isSeller = async (userId) => {
    const roles = await checkUserRole(userId);
    return Array.isArray(roles) && (roles.includes('seller') || roles.includes('admin'));
};

export const canManageProduct = async (userId, productSellerId) => {
    const roles = await checkUserRole(userId);
    if (!Array.isArray(roles)) return false;
    
    // Admin can manage all products
    if (roles.includes('admin')) return true;
    
    // Sellers can only manage their own products
    return roles.includes('seller') && userId === productSellerId;
};
