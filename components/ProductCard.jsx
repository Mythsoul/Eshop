"use client"

import { useState, useCallback, useMemo } from "react"
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useAppContext } from "@/context/AppContext"
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'

const ProductCard = ({ product }) => {
  const { router } = useAppContext()
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = useCallback(() => {
    router.push("/product/" + product._id)
    scrollTo(0, 0)
  }, [product._id, router])

  const discount = useMemo(
    () => Math.round(((product.price - product.offerPrice) / product.price) * 100),
    [product.price, product.offerPrice],
  )

  const handleQuickView = (e) => {
    e.stopPropagation()
    // Quick view functionality
  }

  const handleAddToWishlist = (e) => {
    e.stopPropagation()
    // Wishlist functionality
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    // Add to cart functionality
  }

  if (!product) return null

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-gray-100"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-2xl">
        {/* Discount Badge */}
        {product.price > product.offerPrice && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              -{discount}%
            </div>
          </div>
        )}

        {/* Stock Status */}
        {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Only {product.stock} left
            </div>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">Out of Stock</span>
          </div>
        )}

        {/* Product Image */}
        <div className="relative w-full h-full">
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-2xl flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={product.images?.[0] || assets.product_image1 || "/placeholder.svg"}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            } ${isImageLoading ? "opacity-0" : "opacity-100"}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setIsImageLoading(false)}
          />
        </div>

        {/* Hover Actions */}
        <div
          className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleQuickView}
            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
          >
            <Eye className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={handleAddToWishlist}
            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
          >
            <Heart className="w-4 h-4 text-gray-700" />
          </button>
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating (if available) */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">Rs. {product.offerPrice.toLocaleString()}</span>
          {product.price > product.offerPrice && (
            <span className="text-sm text-gray-500 line-through">Rs. {product.price.toLocaleString()}</span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                product.stock > 10
                  ? "bg-green-100 text-green-700"
                  : product.stock > 0
                    ? "bg-orange-100 text-orange-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>
        )}

        {/* Brand/Category */}
        {(product.brand || product.category) && (
          <div className="text-xs text-gray-500">
            {product.brand && <span className="font-medium">{product.brand}</span>}
            {product.brand && product.category && <span className="mx-1">•</span>}
            {product.category && <span>{product.category}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard

