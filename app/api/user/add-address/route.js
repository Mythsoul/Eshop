import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/config/db"
import Address from "@/models/address"


export async function POST(request){
    try {
        await connectDB()

        const { userId } = getAuth(request)
        if (!userId) {
            return NextResponse.json({success: false, message: "Please sign up or log in to add your delivery address"}, {status: 401})
        }

        const {addressData} = await request.json()
        if (!addressData) {
            return NextResponse.json({success: false, message: "Address data is required"}, {status: 400})
        }

        const newAddress = new Address({
            userId,
            fullName: addressData.fullName,
            PhoneNumber: addressData.PhoneNumber,
            zipcode: addressData.zipcode,
            area: addressData.area,
            city: addressData.city,
            province: addressData.province
        })

        await newAddress.save()
        return NextResponse.json({success: true, message: "Address added successfully", newAddress})
        
    } catch (error) {
        console.error('Error adding address:', error)
        return NextResponse.json({
            success: false, 
            message: error.message || "Error adding address"
        }, {status: 500});
    }
}