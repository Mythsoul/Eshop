import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Product ID is required"
            }, { status: 400 });
        }

        await connectDB();
        const product = await Product.findById(id).lean();

        if (!product) {
            return NextResponse.json({
                success: false,
                message: "Product not found"
            }, { status: 404 });
        }

        const transformedProduct = {
            ...product,
            totalReviews: product.reviews?.length || 0,
            averageRating: product.averageRating || 0,
            stock: product.stock || 0,
            warrantyDuration: product.warrantyDuration || null,
            returnPeriod: product.returnPeriod || null,
            deliveryDate: product.deliveryDate || null
        };

        return NextResponse.json({
            success: true,
            product: transformedProduct
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch product"
        }, { status: 500 });
    }
}
