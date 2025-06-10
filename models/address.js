import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    fullName: {type: String, required: true},
    PhoneNumber: { type: String, required: true },
    zipcode: {type: String, required: true},
    area: {type: String, required: true},
    city: {type: String, required: true},
    province: {type: mongoose.Schema.Types.Mixed, required: true}, // Can be either text or number
    
})

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema)

export default Address
