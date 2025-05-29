'use client'
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const Cart = () => {
  const { products, router, cartItems, updateCartQuantity, getCartCount } = useAppContext();

  // Handler for quantity updates with stock validation
  const handleQuantityChange = React.useCallback((productId, newQuantity) => {
    const product = products.find(p => p._id === productId);
    
    if (!product) {
      toast.error("Product not found");
      return;
    }

    // Check if we have enough stock
    if (newQuantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      // Update to maximum available stock instead
      updateCartQuantity(productId, product.stock);
      return;
    }

    // Update quantity
    updateCartQuantity(productId, newQuantity);
  }, [products, updateCartQuantity]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} Items</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Product Details
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Price</th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Quantity</th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cartItems).map((itemId) => {
                  const product = products.find(product => product._id === itemId);
                  
                  if (!product || cartItems[itemId] <= 0) return null;

                  return (
                    <tr key={itemId}>
                      <td className="py-4 md:px-4 px-1">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                          <div className="flex flex-col items-center">
                            <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                              <Image
                                src={product.images?.[0] || assets.product_image1}
                                alt={product.name}
                                className="w-16 h-auto object-cover mix-blend-multiply"
                                width={1280}
                                height={720}
                              />
                            </div>
                            <button
                              className="md:hidden text-xs text-orange-600 mt-1"
                              onClick={() => handleQuantityChange(product._id, 0)}
                            >
                              Remove
                            </button>
                          </div>
                          <div className="text-sm hidden md:block">
                            <p className="text-gray-800">{product.name}</p>
                            <button
                              className="text-xs text-orange-600 mt-1"
                              onClick={() => handleQuantityChange(product._id, 0)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        Rs. {product.offerPrice.toLocaleString()}
                      </td>
                      <td className="py-4 md:px-4 px-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(product._id, Math.max(0, cartItems[itemId] - 1))}
                            className="text-orange-600 hover:bg-orange-50 p-1 rounded"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{cartItems[itemId]}</span>
                          <button
                            onClick={() => handleQuantityChange(product._id, cartItems[itemId] + 1)}
                            disabled={cartItems[itemId] >= product.stock}
                            className="text-orange-600 hover:bg-orange-50 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                        {product.stock < 5 && (
                          <p className="text-xs text-orange-600 mt-1">
                            Only {product.stock} left in stock
                          </p>
                        )}
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        Rs. {(product.offerPrice * cartItems[itemId]).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button 
            onClick={() => router.push('/all-products')} 
            className="group flex items-center mt-6 gap-2 text-orange-600"
          >
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
              width={20}
              height={20}
            />
            Continue Shopping
          </button>
        </div>
        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
