import User from "@/models/user";
import connectDB from "@/config/db";

export async function authSeller(userId) {
    if (!userId) return false;
    
    try {
        await connectDB();
        // @ts-ignore - Mongoose typing issue
        const user = await User.findOne({ clerkId: userId }).lean().exec();
        return user?.isSeller || false;
    } catch (error) {
        console.error("Error in authSeller:", error);
        return false;
    }
}
