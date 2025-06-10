import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";

export async function GET() {
    try {
        const headers = {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            'Content-Type': 'application/json',
        };

        await connectDB();
        
        const products = await Product.find({ isPopular: true })
            .select('name price images description category brand offerPrice stock warrantyDuration returnPeriod deliveryDate') // Only select needed fields
            .sort({ date: -1 }) 
            .limit(5)
            .lean(); // Use lean for better performance
            
        return NextResponse.json({ success: true, products }, { headers });
    } catch (error) {
        console.error("Error fetching popular products:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Failed to fetch popular products" 
        }, { 
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}