import { authMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { parseRoles, hasRequiredRole } from "@/lib/roleUtils.ts";
 
export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/all-products",
    "/product/(.*)",
    "/api/product/list",
    "/api/product/popular",
    "/api/product/(.*)",
    "/cart",
    "/_next/(.*)",
  ],

  async afterAuth(auth, req) {
    const { userId } = auth;
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isSellerRoute = req.nextUrl.pathname.startsWith('/seller');
    const isProtectedApi = req.nextUrl.pathname.startsWith('/api/admin') || 
                          req.nextUrl.pathname.startsWith('/api/seller') ||
                          req.nextUrl.pathname.includes('/popular/manage');

    // Allow public routes
    if (!isAdminRoute && !isSellerRoute && !isProtectedApi) {
      return NextResponse.next();
    }

    // If not signed in and trying to access protected route
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    try {
      // Get user metadata from Clerk and parse roles
      const user = await clerkClient.users.getUser(userId);
      const userRoles = parseRoles(user?.publicMetadata?.role);

      // Check permissions - admin has access to everything
      if (userRoles.includes('admin')) {
        return NextResponse.next();
      }

      // For non-admin users, check specific permissions
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      if (isSellerRoute && !hasRequiredRole(userRoles, 'seller')) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      if (isProtectedApi) {
        if (req.nextUrl.pathname.startsWith('/api/seller') && !hasRequiredRole(userRoles, 'seller')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        if (req.nextUrl.pathname.includes('/popular/manage')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
      }

      return NextResponse.next();
    } catch (error) {
      // Log to proper error monitoring in production
      return NextResponse.redirect(new URL('/', req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
