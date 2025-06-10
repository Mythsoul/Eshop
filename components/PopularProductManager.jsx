"use client"

import { useAppContext } from "@/context/AppContext"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { Star, TrendingUp, Loader2 } from 'lucide-react'

export default function PopularProductManager({ product }) {
  const { getToken } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)

  const handlePopularStatus = async (action) => {
    try {
      setIsLoading(true)
      const token = await getToken()
      const response = await axios.post(
        "/api/product/popular/manage",
        { productId: product._id, action: action },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.data.success) {
        toast.success(response.data.message)
        window.location.reload()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update popular status")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {product.isPopular ? (
        <button
          onClick={() => handlePopularStatus("remove")}
          disabled={isLoading}
          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 rounded-xl font-medium hover:from-red-200 hover:to-rose-200 transition-all duration-200 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Star className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
          )}
          <span>{isLoading ? "Updating..." : "Remove from Popular"}</span>
        </button>
      ) : (
        <button
          onClick={() => handlePopularStatus("add")}
          disabled={isLoading}
          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl font-medium hover:from-green-200 hover:to-emerald-200 transition-all duration-200 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <TrendingUp className="w-4 h-4 transition-transform group-hover:scale-110" />
          )}
          <span>{isLoading ? "Updating..." : "Add to Popular"}</span>
        </button>
      )}

      {/* Status Indicator */}
      <div
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
          product.isPopular
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            product.isPopular ? "bg-yellow-500" : "bg-gray-400"
          }`}
        ></div>
        <span>{product.isPopular ? "Popular" : "Regular"}</span>
      </div>
    </div>
  )
}

