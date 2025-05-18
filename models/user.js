import isAdmin from "@/middleware/isAdmin";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ 
     _id:{ type: String, required: true },
     name: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     imageUrl: { type: String },
     cartItems: { type: Object, default: {} },
     isAdmin: { type: Boolean, default: false },
     isSeller: { type: Boolean, default: false }
     
}, {minimize: false})

const User = mongoose.models.User || mongoose.model('User', userSchema)


export default User;




