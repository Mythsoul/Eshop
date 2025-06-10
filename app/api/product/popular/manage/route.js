import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Only admins can manage popular products
        const isAdmin = await authSeller(userId);
        if (!isAdmin) {
            return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
        }

        const { productId, action } = await request.json();
        if (!productId || !['add', 'remove'].includes(action)) {
            return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
        }
        
        await connectDB();
        
        const product = await Product.findByIdAndUpdate(
            productId,
            { $set: { isPopular: action === 'add' } },
            { new: true }
        );
        
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            message: `Product ${action === 'add' ? 'marked as popular' : 'removed from popular'}`,
            product 
        });

    } catch (error) {
        console.error("Popular product management error:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Failed to update popular status" 
        }, { status: 500 });
    }
}

// Auto-popular feature based on criteria
export async function PUT(request) {
    try {
        await connectDB();
        const { threshold = 10 } = await request.json();

        // Find products that meet popularity criteria
        // - Has more than X reviews
        // - Has average rating above 4.0
        // - Has been purchased more than Y times
        const popularProducts = await Product.updateMany(
            {
                $and: [
                    { 'reviews.2': { $exists: true } },
                    { $expr: { $gte: [{ $size: '$reviews' }, threshold] } },
                    { averageRating: { $gte: 4.0 } }
                ]
            },
            { $set: { isPopular: true } }
        );

        return NextResponse.json({
            success: true,
            message: "Popular products updated automatically",
            updated: popularProducts.modifiedCount
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
