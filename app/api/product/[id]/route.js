import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";
import mcache from "memory-cache"
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        
        // Check cache first
        const cacheKey = `product_${id}`;
        const cached = mcache.get(cacheKey);
        if (cached) {
            return NextResponse.json(cached);
        }

        await connectDB();
        
        const product = await Product.findById(id)
            .select('name price images description category brand offerPrice color reviews sellerId isPopular sellerName averageRating deliveryDate stock warrantyDuration returnPeriod')
            .lean();

        if (!product) {
            return NextResponse.json({ 
                success: false, 
                message: "Product not found" 
            }, { status: 404 });
        }

        const result = {
            success: true,
            product
        };

        // Cache the result
        mcache.put(cacheKey, result, CACHE_DURATION);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Failed to fetch product"
        }, { status: 500 });
    }
}


