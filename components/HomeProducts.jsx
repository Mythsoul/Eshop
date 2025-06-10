"use client"

import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import { useAppContext } from "@/context/AppContext"
import axios from "axios"
import { TrendingUp, ArrowRight, Star } from 'lucide-react'

const HomeProducts = () => {
  const { router } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [popularProducts, setPopularProducts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true)

        const { data } = await axios.get("/api/product/list", {
          params: {
            limit: 100,
          },
        })

        if (data.success) {
          const popular = data.products.filter((product) => product.isPopular === true).slice(0, 10)
          setPopularProducts(popular)
        } else {
          setError(data.message || "Failed to fetch products")
        }
      } catch (error) {
        console.error("Error fetching popular products:", error)
        setError(error.message || "Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchPopularProducts()
  }, [])

  if (loading) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    console.error("Error in HomeProducts:", error)
    return null
  }

  if (!popularProducts?.length) {
    return null
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Popular
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover what everyone's talking about - our most loved and trending products
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {popularProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* See More Button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/all-products")}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-300 rounded-2xl font-semibold text-gray-700 hover:text-orange-600 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default HomeProducts

