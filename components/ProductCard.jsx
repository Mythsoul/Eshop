import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} offerPrice
 * @property {string[]} [images]
 * @property {string} category
 * @property {string} [sellerName]
 * @property {string} [brand]
 * @property {string} [color]
 * @property {string} [deliveryDate]
 * @property {string} [warrantyDuration]
 * @property {string} [returnPeriod]
 * @property {number} [stock]
 */

/**
 * Product Card Component
 * @param {Object} props
 * @param {Product} props.product
 */
const ProductCard = React.memo(function ProductCard({ product }) {
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
            {/* Fixed aspect ratio container */}
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

            <div className="space-y-2 flex-1">
                <div className="h-12">
                    <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
                </div>

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
                
                {product.stock !== undefined && (
                    <p className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                )}
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
