import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";

/** @type {import('mongoose').Model<any>} */
const ProductModel = Product;

export async function GET(request) {
    try {
        await connectDB();
        
        // Get URL parameters
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 20;
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('search');
        
        // Build optimized query using indexes
        const query = {};
        
        if (category) {
            query.category = category;
        }

        if (search) {
            // Use text index instead of regex for better performance
            query.$text = { $search: search };
        }

        // Execute query with index-based sorting and filtering
        const sort = {};
        if (search) {
            sort.score = { $meta: "textScore" }; // Sort by text match relevance
        } else {
            sort.date = -1; // Default sort by date
        }

        const projection = {
            name: 1,
            price: 1,
            images: 1,
            description: 1,
            category: 1,
            brand: 1,
            offerPrice: 1,
            isPopular: 1,
            deliveryDate: 1,
            userId: 1,
            sellerName: 1,
            averageRating: 1,
            reviews: 1,
            stock: 1,
            warrantyDuration: 1,
            returnPeriod: 1
        };

        if (search) {
            projection.score = { $meta: "textScore" }; // Include search relevance score
        }

        const [products, total] = await Promise.all([
            ProductModel.find(query, projection)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean()
                .exec(),
            ProductModel.countDocuments(query).exec()
        ]);

        // Format response
        const result = {
            success: true,
            products: products.map(product => ({
                ...product,
                _id: product._id.toString(),
                images: product.images.slice(0, 1), // Only return first image for list view
                reviewCount: product.reviews?.length || 0,
                reviews: undefined // Don't send full reviews array
            })),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                hasMore: page * limit < total,
                limit,
                itemsOnPage: products.length
            }
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || 'Failed to fetch products'
        }, { status: 500 });
    }
}
