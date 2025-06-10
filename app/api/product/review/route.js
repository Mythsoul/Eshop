import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";

export async function POST(request) {
    try {
        // Get user ID from Clerk
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Parse request data
        const { productId, rating, comment, userName } = await request.json();
        
        if (!productId || !rating || !comment || !userName) {
            return NextResponse.json({ 
                success: false, 
                message: "Missing required fields" 
            }, { status: 400 });
        }

        // Connect to database
        await connectDB();
        
        // Find the product (with .exec())
        const product = await /** @type {any} */ (Product).findById(productId).exec();
        if (!product) {
            return NextResponse.json({ 
                success: false, 
                message: "Product not found" 
            }, { status: 404 });
        }

        // Create new review
        const newReview = {
            userId,
            userName,
            rating: Number(rating),
            comment,
            date: Date.now()
        };

        // Add review to product
        product.reviews.push(newReview);
        
        // Calculate new average rating
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        product.averageRating = totalRating / product.reviews.length;
        
        // Save product
        await product.save();

        return NextResponse.json({ 
            success: true, 
            message: "Review added successfully",
            review: newReview
        });
        
    } catch (error) {
        console.error("Error adding review:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}
