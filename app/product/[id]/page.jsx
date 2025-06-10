"use client"
import { useEffect, useState, Suspense } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import QRCode from "qrcode";
import { Pencil, Trash2, Star } from 'lucide-react';
import ErrorBoundary from "@/components/ErrorBoundary";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useProducts } from "@/hooks/useProducts";

// Separate component for product images
const ProductImages = React.memo(({ images, mainImage, setMainImage }) => {
    return (
        <div className="space-y-4">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 h-[400px]">
                <Image
                    src={mainImage || (images && images.length > 0 ? images[0] : assets.product_image1)}
                    alt="Product image"
                    className="w-full h-full object-contain mix-blend-multiply"
                    width={800}
                    height={800}
                    priority={true}
                    loading="eager"
                />
            </div>

            <div className="grid grid-cols-5 gap-2">
                {images && images.length > 0 && images.map((image, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 border-2 ${mainImage === image ? 'border-orange-500' : 'border-transparent'}`}
                        onClick={() => setMainImage(image)}
                    >
                        <Image
                            src={image}
                            alt={`Product view ${index + 1}`}
                            className="w-full h-auto object-cover mix-blend-multiply"
                            width={100} 
                            height={100}
                            loading="lazy" 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
});

ProductImages.displayName = 'ProductImages';

// Separate component for product details
const ProductDetails = React.memo(({ product, onAddToCart, onBuyNow }) => {
    const discount = React.useMemo(() => 
        Math.round(((product.price - product.offerPrice) / product.price) * 100),
        [product.price, product.offerPrice]
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-medium mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.description}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Image
                            key={star}
                            className="h-4 w-4"
                            src={star <= (product.averageRating || 0) ? assets.star_icon : assets.star_dull_icon}
                            alt="star"
                            width={16}
                            height={16}
                        />
                    ))}
                </div>
                <p className="text-sm text-gray-500">{product.totalReviews || 0} reviews</p>
            </div>

            <div className="flex items-baseline gap-4 pb-4 border-b">
                <div>
                    <span className="text-2xl font-medium">Rs. {product.offerPrice.toLocaleString()}</span>
                </div>
                {product.price > product.offerPrice && (
                    <>
                        <span className="text-lg text-gray-500 line-through">Rs. {product.price.toLocaleString()}</span>
                        <span className="text-sm text-green-600">{discount}% off</span>
                    </>
                )}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <p className="text-gray-600">Delivery: <span className="font-medium text-blue-600">{product.deliveryDate || 'N/A'}</span></p>
                    <p className="text-gray-600">Brand: <span className="font-medium text-gray-800">{product.brand || 'N/A'}</span></p>
                    <p className="text-gray-600">Color: <span className="font-medium text-gray-800">{product.color || 'N/A'}</span></p>
                </div>
                <div className="space-y-2">
                    <p className="text-gray-600">Stock: <span className={`font-medium ${product.stock > 0 
                        ? product.stock <= 5 
                            ? 'text-orange-600' 
                            : 'text-green-600' 
                        : 'text-red-600'}`}>
                        {product.stock > 0 
                            ? product.stock <= 5 
                                ? `Only ${product.stock} items left in stock` 
                                : `${product.stock} items available` 
                            : 'Out of stock'}
                    </span></p>
                    <p className="text-gray-600">Warranty: <span className="font-medium text-gray-800">{product.warrantyDuration || 'N/A'}</span></p>
                    <p className="text-gray-600">Return Period: <span className="font-medium text-gray-800">{product.returnPeriod || 'N/A'}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                    onClick={onAddToCart}
                    disabled={!product.stock || product.stock <= 0}
                    className="w-full px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
                             transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                >
                    {product.stock > 0 ? (
                        <>Add to Cart</>
                    ) : (
                        <>Out of Stock</>
                    )}
                </button>
                <button
                    onClick={onBuyNow}
                    disabled={!product.stock || product.stock <= 0}
                    className="w-full px-8 py-3 border border-gray-300 rounded-lg text-gray-700 
                             hover:bg-slate-50 transition text-sm font-medium disabled:opacity-50 
                             disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {product.stock > 0 ? (
                        <>Buy Now</>
                    ) : (
                        <>Temporarily Unavailable</>
                    )}
                </button>
            </div>

            {/* Product highlights */}
            {(product.warrantyDuration || product.returnPeriod) && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Product Highlights</h3>
                    <div className="space-y-2">
                        {product.warrantyDuration && (
                            <div className="flex items-start gap-2">
                                <div className="mt-1">
                                    <Image src={assets.checkmark} alt="checkmark" width={12} height={12} />
                                </div>
                                <p className="text-sm text-gray-600">
                                    {product.warrantyDuration} warranty included
                                </p>
                            </div>
                        )}
                        {product.returnPeriod && (
                            <div className="flex items-start gap-2">
                                <div className="mt-1">
                                    <Image src={assets.checkmark} alt="checkmark" width={12} height={12} />
                                </div>
                                <p className="text-sm text-gray-600">
                                    {product.returnPeriod} easy returns
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

ProductDetails.displayName = 'ProductDetails';

const Product = () => {
    const { id } = useParams();
    const { router, user, getToken, cartItems, setCartItems } = useAppContext();

    const [mainImage, setMainImage] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [qrUrl, setQrUrl] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isTogglingPopular, setIsTogglingPopular] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [productData, setProductData] = useState(null);
    const [error, setError] = useState(null);

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/product/${id}`); 
            console.log(data); // Using a more RESTful endpoint
            if (data.success) {
                setProductData(data.product);
                setMainImage(data.product.images?.[0] || null);
            } else {
                setError(data.message || 'Failed to load product');
                toast.error('Failed to load product');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setError(error.message || 'Failed to load product details');
            toast.error('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePopular = async () => {
        try {
            setIsTogglingPopular(true);
            const token = await getToken();
            const { data } = await axios.post(
                '/api/product/popular/manage',
                { 
                    productId: id,
                    action: productData.isPopular ? 'remove' : 'add'
                },
                { headers: { Authorization: `Bearer ${token}` }}
            );

            if (data.success) {
                toast.success(data.message);
                fetchProductData(); // Refresh the product data
            }
        } catch (error) {
            toast.error('Failed to update popular status');
            console.error('Toggle popular error:', error);
        } finally {
            setIsTogglingPopular(false);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            setIsDeleting(true);
            const token = await getToken();
            const { data } = await axios.delete(`/api/product/delete?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success('Product deleted successfully');
                router.push('/all-products');
            }
        } catch (error) {
            toast.error('Failed to delete product');
            console.error('Delete error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditProduct = () => {
        // Ensure userRole is an array and check for admin role
        const roles = Array.isArray(userRole) ? userRole : [];
        const isAdmin = roles.includes('admin');
    
        const route = isAdmin ? '/admin' : '/seller';
        console.log('Edit route:', route); // Debug log
        router.push(`${route}/manage-products?edit=${id}`);
    };

    // Check user role
    const checkUserRole = async () => {
        if (!user) {
            setUserRole([]);
            return [];
        }

        try {
            const token = await getToken();
            const { data } = await axios.get('/api/user/check-admin', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Get roles from the user's metadata
            const roles = user?.publicMetadata?.role ? 
                user.publicMetadata.role.split(',').map(role => role.trim()) :
                [];
            

            setUserRole(roles);

            return roles;
        } catch (error) {
            console.error('Error checking user role:', error);
            setUserRole([]);
            return [];
        }
    };

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success('Item added to cart');
        if(user){ 
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } });
            } catch(error) {
                toast.error(error.message);
            }
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                await fetchProductData();
                if (user) {
                    const roles = await checkUserRole();
                    setUserRole(roles);
                }
            } catch (error) {
                console.error('Initialization error:', error);
                toast.error('Failed to initialize page');
            }
        };
        init();
    }, [id, user?.id, user?.publicMetadata?.role]); // Also watch for role changes in metadata

    useEffect(() => {
        if (productData?._id) {
            QRCode.toDataURL(productData._id)
                .then(url => setQrUrl(url))
                .catch(err => console.error('QR Code generation error:', err));
        }
    }, [productData?._id]);
    
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error("Please log in to submit a review");
            return;
        }
        
        if (!reviewComment.trim()) {
            toast.error("Please enter a review comment");
            return;
        }
        
        try {
            setSubmittingReview(true);
            const token = await getToken();
            
            const response = await axios.post('/api/product/review', {
                productId: id,
                rating: reviewRating,
                comment: reviewComment,
                userName: user.firstName + ' ' + user.lastName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                toast.success("Review submitted successfully");
                setReviewComment('');
                setReviewRating(5);
                
                // Update the product data with the new review
                const updatedProduct = {...productData};
                updatedProduct.reviews = [...(updatedProduct.reviews || []), response.data.review];
                updatedProduct.averageRating = updatedProduct.reviews.reduce((sum, review) => sum + review.rating, 0) / updatedProduct.reviews.length;
                setProductData(updatedProduct);
            } else {
                toast.error(response.data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(error.response?.data?.message || error.message || "An error occurred");
        } finally {
            setSubmittingReview(false);
        }
    }

    const canManageProduct = (() => {
        if (!Array.isArray(userRole) || !productData) return false;
        
        // Admin can manage all products
        if (userRole.includes('admin')) return true;
        
        // Seller can only manage their own products
        return userRole.includes('seller') && productData.sellerId === user?.id;
    })();

    const addToCartAndBuy = React.useCallback((productId) => {
        addToCart(productId);
        router.push('/cart');
    }, [addToCart, router]);

    if (loading) return <Loading />;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
    if (!productData) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    return (
        <ErrorBoundary>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
                <Suspense fallback={<Loading />}>
                    {/* Admin/Seller Controls */}
                    {(canManageProduct || (Array.isArray(userRole) && userRole.includes('admin'))) && (
                        <div className="flex justify-end gap-2">
                            {Array.isArray(userRole) && userRole.includes('admin') && (
                                <button
                                    onClick={handleTogglePopular}
                                    disabled={isTogglingPopular}
                                    className={`flex items-center gap-2 px-4 py-2 rounded ${
                                        productData.isPopular 
                                            ? 'bg-yellow-100 text-yellow-700' 
                                            : 'bg-gray-100 text-gray-700'
                                    } ${isTogglingPopular ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Star className={`w-4 h-4 ${isTogglingPopular ? 'animate-spin' : ''}`} />
                                    {isTogglingPopular ? 'Updating...' : (productData.isPopular ? 'Remove Popular' : 'Set Popular')}
                                </button>
                            )}
                            {canManageProduct && (
                                <>
                                    <button
                                        onClick={handleEditProduct}
                                        disabled={isDeleting}
                                        className={`flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        disabled={isDeleting}
                                        className={`flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-spin' : ''}`} />
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Main product section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ProductImages 
                            images={productData?.images} 
                            mainImage={mainImage} 
                            setMainImage={setMainImage}
                        />
                        
                        <ProductDetails 
                            product={productData} 
                            onAddToCart={() => addToCart(productData._id)}
                            onBuyNow={() => addToCartAndBuy(productData._id)}
                        />
                    </div>

                    {/* Reviews section */}
                    <div className="w-full">
                        <div className="flex flex-col items-center mb-4 mt-16">
                            <p className="text-3xl font-medium">Customer <span className="font-medium text-orange-600">Reviews</span></p>
                            <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                        </div>
                        <div className="mt-6 w-full">
                            {/* Review Form */}
                            <div className="mb-8 border p-6 rounded-lg">
                                <h3 className="text-xl font-medium mb-4">Write a Review</h3>
                                <form onSubmit={handleSubmitReview}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-2">Rating</label>
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    className="focus:outline-none"
                                                >
                                                    <Image 
                                                        className="h-6 w-6" 
                                                        src={star <= Number(reviewRating) ? assets.star_icon : assets.star_dull_icon} 
                                                        alt={`${star} star`} 
                                                    />
                                                </button>
                                            ))}
                                            <span className="ml-2 text-gray-600">{reviewRating} out of 5</span>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="review-comment" className="block text-gray-700 mb-2">Your Review</label>
                                        <textarea
                                            id="review-comment"
                                            rows={4}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="Share your experience with this product..."
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                                        disabled={submittingReview || !user}
                                    >
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    {!user && (
                                        <p className="mt-2 text-sm text-gray-500">Please log in to submit a review</p>
                                    )}
                                </form>
                            </div>
                            
                            {/* Reviews List */}
                            <h3 className="text-xl font-medium mb-4">Customer Reviews</h3>
                            {productData.reviews && productData.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {productData.reviews.map((review, index) => (
                                        <div key={index} className="border p-4 rounded-lg">
                                            <p className="mt-2 text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No reviews yet. Be the first to review this product!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Suspense>
            </div>
            <Footer />

            <ConfirmationDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteProduct}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmLabel="Delete Product"
                cancelLabel="Cancel"
                variant="danger"
            />
        </ErrorBoundary>
    );
};

export default Product;