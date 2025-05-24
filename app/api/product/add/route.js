import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";
import connectDB from "@/config/db";
import Product from "@/models/product";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
    try {
        // Get user ID from Clerk
        const { userId } = getAuth(request);
        console.log('User ID from Clerk:', userId);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Check if user is a seller
        const isSeller = await authSeller(userId);
        console.log('Is user a seller?', isSeller);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized as seller" }, { status: 403 });
        }

        // Parse form data
        const formData = await request.formData();
        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        const shippingFee = formData.get('shippingFee');
        const deliveryCharge = formData.get('deliveryCharge');
        const sellerName = formData.get('sellerName');
        const brand = formData.get('brand');
        const color = formData.get('color');
        const isPopular = formData.get('isPopular') === 'true';
        const deliveryDate = formData.get('deliveryDate');
        const stock = formData.get('stock');
        const warrantyDuration = formData.get('warrantyDuration');
        const returnPeriod = formData.get('returnPeriod');

        // Get image files
        const files = formData.getAll('images');
        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, message: "No files uploaded" }, { status: 400 });
        }
        
        // Upload files to Cloudinary
        const uploadPromises = files.map((file, index) => {
            return new Promise(async (resolve, reject) => {
                try {
                    // Check if file is valid
                    if (!file || typeof file.arrayBuffer !== 'function') {
                        console.error(`Invalid file at index ${index}:`, file);
                        reject(new Error(`Invalid file format for image ${index + 1}`));
                        return;
                    }
                    
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    
                    // Add timeout to prevent hanging uploads
                    const uploadTimeout = setTimeout(() => {
                        reject(new Error(`Upload timeout for image ${index + 1}`));
                    }, 30000); // 30 second timeout
                    
                    cloudinary.uploader.upload_stream(
                        { 
                            resource_type: "auto",
                            folder: "test", 
                            quality: "auto:good",
                            fetch_format: "auto",
                            flags: "progressive"
                        },
                        (error, result) => {
                            clearTimeout(uploadTimeout);
                            if (error) {
                                console.error(`Cloudinary upload error for image ${index + 1}:`, error);
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    ).end(buffer);
                } catch (err) {
                    console.error(`Error processing image ${index + 1}:`, err);
                    reject(err);
                }
            });
        });
        
        const uploadResults = await Promise.all(uploadPromises);
        const images = uploadResults.map(result => result.secure_url);
        
        // Connect to database and create product
        await connectDB();
        const newProduct = await Product.create({
            userId,
            sellerName: sellerName || "",
            name,
            description,
            brand: brand || "Generic",
            color: color || "Multi",
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            shippingFee: Number(shippingFee || 0),
            deliveryCharge: Number(deliveryCharge || 0),
            images,
            isPopular: isPopular,
            deliveryDate: deliveryDate || '',
            stock: Number(stock || 0),
            warrantyDuration: warrantyDuration || '',
            returnPeriod: returnPeriod || '',
            sellerId: userId, // Add sellerId for proper seller management
            reviews: [],
            averageRating: 0,
            date: Date.now()
        });
        console.log('Saved product:', newProduct);

        return NextResponse.json({ 
            success: true, 
            message: "Product added successfully", 
            product: newProduct 
        });

    } catch (error) {
        console.error("Product add error:", error);
        
        // Check for specific error types
        if (error.name === 'ValidationError') {
            // Mongoose validation error
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json({ 
                success: false, 
                message: "Validation error",
                errors: validationErrors
            }, { status: 400 });
        } else if (error.code === 11000) {
            // Duplicate key error
            return NextResponse.json({ 
                success: false, 
                message: "Duplicate product information"
            }, { status: 409 });
        }
        
        return NextResponse.json({ 
            success: false, 
            message: error.message || "An error occurred while adding the product" 
        }, { status: 500 });
    }
}
