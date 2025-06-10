import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import isAdmin from "@/middleware/isAdmin";
import connectDB from "@/config/db";
import Product from "@/models/product";

export async function GET(request) {
    try {
      
        await connectDB();
        const products = await Product.find({}).sort({ date: -1 });
         
        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}
