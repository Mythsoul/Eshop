import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";
import connectDB from "@/config/db";
import Product from "@/models/product";

export async function DELETE(request) {
    try {
        // Get user ID from Clerk
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Check if user is a seller
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized as seller" }, { status: 403 });
        }

        // Connect to database
        await connectDB();

        // Get product ID from URL
        const url = new URL(request.url);
        const productId = url.searchParams.get('id');
        
        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
        }

        // Find the product and check if it belongs to the seller
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        // Delete the product without checking userId
        await Product.findByIdAndDelete(productId);

        return NextResponse.json({ 
            success: true, 
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "An error occurred while deleting the product" 
        }, { status: 500 });
    }
}
