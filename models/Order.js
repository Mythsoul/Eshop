import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref:"user", index: true},
    items: [{
        product: {type: String, required: true, ref:"product"},
        sellerId: {type: String, required: true},
        quantity: {type: Number, required: true, min: 1},
    }],
    totalAmount: {type: Number, required: true, min: 0},
    tax: {type: Number, required: true, min: 0},
    address: {
        userId: {type: String, required: true},
        fullName: {type: String, required: true},
        PhoneNumber: {type: String, required: true},
        zipcode: {type: String, required: true},
        area: {type: String, required: true},
        city: {type: String, required: true},
        province: {type: mongoose.Schema.Types.Mixed, required: true}
    },
    status: {type: String, required: true, default: "Order Placed"},
    date: {type: Date, required: true, default: Date.now},
    paymentMethod: {type: String, required: true, enum: ['esewa', 'khalti']}
}, {
    timestamps: true // Add automatic createdAt and updatedAt
})

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order