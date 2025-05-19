import mongoose from "mongoose"; 

const reviewSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Number, required: true }
});

const productSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "user", index: true },
    sellerName: { type: String, default: "", index: true },
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    brand: { type: String, default: "Generic" },
    color: { type: String, default: "Multi" },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    images: { type: Array, required: true },
    category: { type: String, required: true, index: true },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0, index: true },
    date: { type: Number, required: true, index: true },
    isPopular: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    warrantyDuration: { type: String },
    returnPeriod: { type: String },
    deliveryDate: { type: String },
    totalReviews: { 
        type: Number, 
        default: 0,
        get: function() {
            return this.reviews?.length || 0;
        }
    },
    sellerId: { type: String, required: true, index: true } // Add sellerId for seller management
}, {
    timestamps: true, // Add timestamps for created/updated tracking
    toJSON: { getters: true }, // Include getters when converting to JSON
    toObject: { getters: true }
});

// Virtual for calculating total reviews
productSchema.virtual('reviewsCount').get(function() {
    return this.reviews?.length || 0;
});

// Pre-save middleware to update averageRating
productSchema.pre('save', function(next) {
    if (this.reviews && this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
    }
    next();
});

// Add basic indexes for common operations
productSchema.index({ date: -1 }); // For default sorting
productSchema.index({ category: 1 }); // For category filtering
productSchema.index({ name: 'text', description: 'text' }); // For text search

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// Create indexes asynchronously to avoid blocking
async function createIndexes() {
    try {
        await Product.collection.createIndexes([
            { key: { date: -1 } },
            { key: { category: 1 } },
            { key: { name: "text", description: "text" } }
        ]);
        console.log('Product indexes created successfully');
    } catch (error) {
        console.error('Error creating product indexes:', error);
    }
}

createIndexes();

export default Product;
