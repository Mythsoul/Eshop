import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

interface Product {
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
}

interface ProductCardProps {
    product: Product;
}

const ProductCard = React.memo<ProductCardProps>(function ProductCard({ product }) {
    const { router } = useAppContext();

    const handleClick = React.useCallback(() => {
        router.push('/product/' + product._id);
        scrollTo(0, 0);
    }, [product._id, router]);

    const discount = React.useMemo(() => 
        Math.round(((product.price - product.offerPrice) / product.price) * 100),
        [product.price, product.offerPrice]
    );

    if (!product) return null;

    return (
        <div 
            className="flex flex-col w-full cursor-pointer border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            onClick={handleClick}
        >
            {/* Product image */}
            <div className="relative w-full pb-[100%] bg-gray-50 rounded-lg mb-3 overflow-hidden">
                <Image
                    src={product.images?.[0] || assets.product_image1}
                    alt={product.name}
                    className="object-contain hover:scale-105 transition duration-300"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    loading="lazy"
                />
            </div>

            {/* Product details */}
            <div className="space-y-2 flex-1">
                <div className="h-12">
                    <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
                </div>

                {/* Price and discount */}
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-medium">Rs. {product.offerPrice.toLocaleString()}</span>
                    {product.price > product.offerPrice && (
                        <>
                            <span className="text-sm text-gray-500 line-through">Rs. {product.price.toLocaleString()}</span>
                            <span className="text-xs text-green-600">
                                {discount}% off
                            </span>
                        </>
                    )}
                </div>
                
                {/* Stock status */}
                <div className="space-y-1">
                    {product.stock !== undefined && (
                        <p className={`text-xs ${product.stock > 0 
                            ? product.stock <= 5 
                                ? 'text-orange-600' 
                                : 'text-green-600' 
                            : 'text-red-600'}`}>
                            {product.stock > 0 
                                ? product.stock <= 5 
                                    ? `Only ${product.stock} left in stock` 
                                    : `${product.stock} in stock` 
                                : 'Out of stock'}
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
