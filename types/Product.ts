export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    offerPrice: number;
    images?: string[];
    category: string;
    sellerName?: string;
    brand?: string;
    color?: string;
    deliveryDate?: string;
    warrantyDuration?: string;
    returnPeriod?: string;
    stock?: number;
    averageRating?: number;
    reviews?: Array<{
        rating: number;
        comment: string;
        userName: string;
        createdAt: string;
    }>;
    isPopular?: boolean;
}
