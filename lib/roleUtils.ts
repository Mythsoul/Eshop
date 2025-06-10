import { clerkClient } from "@clerk/nextjs/server";

/**
 * Valid user roles in the system
 */
export const VALID_ROLES = ['user', 'seller', 'admin'] as const;
export type UserRole = typeof VALID_ROLES[number];

/**
 * Parse and validate role metadata from Clerk
 */
export function parseRoles(roleMetadata: unknown): UserRole[] {
    if (!roleMetadata) return ['user'];
    
    const roles = Array.isArray(roleMetadata) 
        ? roleMetadata
        : typeof roleMetadata === 'string'
            ? roleMetadata.split(',').map(r => r.trim())
            : [];

    return roles.filter((r): r is UserRole => VALID_ROLES.includes(r as any)) || ['user'];
}

/**
 * Check if user has required role, with admin always having access
 */
export function hasRequiredRole(userRoles: UserRole[], requiredRole: UserRole): boolean {
    return userRoles.includes('admin') || userRoles.includes(requiredRole);
}

/**
 * Update user roles safely
 */
export async function updateUserRoles(userId: string, roles: UserRole[]): Promise<boolean> {
    try {
        // Ensure only valid roles are included
        const validRoles = roles.filter(r => VALID_ROLES.includes(r));
        
        // Update Clerk metadata
        await clerkClient.users.updateUser(userId, {
            publicMetadata: {
                role: validRoles.join(',')
            }
        });
        return true;
    } catch (error) {
        console.error('Error updating user roles:', error);
        return false;
    }
}
