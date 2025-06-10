"use client"

import { useState } from "react"
import { Pencil, Trash2, Star, MoreVertical, AlertTriangle } from 'lucide-react'
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const ProductControls = ({
  productId,
  isAdmin,
  isSeller,
  sellerId,
  isPopular,
  userId,
  getToken,
  onProductUpdate,
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const canManage = isAdmin || (isSeller && sellerId === userId)

  const handleTogglePopular = async () => {
    try {
      setIsLoading(true)
      const token = await getToken()
      const { data } = await axios.post(
        "/api/product/popular/manage",
        {
          productId,
          action: isPopular ? "remove" : "add",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (data.success) {
        toast.success(data.message)
        if (onProductUpdate) onProductUpdate()
      }
    } catch (error) {
      toast.error("Failed to update popular status")
      console.error("Toggle popular error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      const token = await getToken()
      const { data } = await axios.delete(`/api/product/delete?id=${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        toast.success("Product deleted successfully")
        router.push("/all-products")
      }
    } catch (error) {
      toast.error("Failed to delete product")
      console.error("Delete error:", error)
    } finally {
      setIsLoading(false)
      setShowDeleteModal(false)
    }
  }

  const handleEdit = () => {
    const route = isAdmin ? "/admin" : "/seller"
    router.push(`${route}/manage-products?edit=${productId}`)
  }

  if (!canManage && !isAdmin) return null

  return (
    <>
      <div className="flex justify-end gap-3 mb-6">
        {/* Desktop View */}
        <div className="hidden md:flex gap-3">
          {isAdmin && (
            <button
              onClick={handleTogglePopular}
              disabled={isLoading}
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                isPopular
                  ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 hover:from-yellow-200 hover:to-amber-200 shadow-lg"
                  : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-md"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Star className={`w-4 h-4 transition-transform group-hover:scale-110 ${isPopular ? "fill-current" : ""}`} />
              <span>{isLoading ? "Updating..." : isPopular ? "Remove Popular" : "Set Popular"}</span>
            </button>
          )}

          {canManage && (
            <>
              <button
                onClick={handleEdit}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl font-medium hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <Pencil className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Edit Product</span>
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 rounded-xl font-medium hover:from-red-200 hover:to-rose-200 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile View - Dropdown */}
        <div className="relative md:hidden">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-10 min-w-48">
              {isAdmin && (
                <button
                  onClick={() => {
                    handleTogglePopular()
                    setShowDropdown(false)
                  }}
                  disabled={isLoading}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Star className={`w-4 h-4 ${isPopular ? "fill-current text-yellow-500" : "text-gray-500"}`} />
                  <span>{isLoading ? "Updating..." : isPopular ? "Remove Popular" : "Set Popular"}</span>
                </button>
              )}

              {canManage && (
                <>
                  <button
                    onClick={() => {
                      handleEdit()
                      setShowDropdown(false)
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                    <span>Edit Product</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDeleteModal(true)
                      setShowDropdown(false)
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                  <p className="text-gray-600 text-sm">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this product? This will permanently remove the product and all
                associated data.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductControls

