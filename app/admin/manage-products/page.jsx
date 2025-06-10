"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAppContext } from "@/context/AppContext"
import toast from "react-hot-toast"
import Image from "next/image"
import Link from "next/link"
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Package,
  AlertTriangle,
  Loader2,
  TrendingUp,
} from "lucide-react"
import React from "react"
const ManageProducts = () => {
  const { getToken } = useAppContext()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    popularProducts: 0,
    outOfStock: 0,
    lowStock: 0,
  })

  // Form state for editing
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [offerPrice, setOfferPrice] = useState("")
  const [shippingFee, setShippingFee] = useState("")
  const [deliveryCharge, setDeliveryCharge] = useState("")
  const [sellerName, setSellerName] = useState("")
  const [brand, setBrand] = useState("")
  const [color, setColor] = useState("")
  const [files, setFiles] = useState([])
  const [isPopular, setIsPopular] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState("")
  const [stock, setStock] = useState("")
  const [warrantyDuration, setWarrantyDuration] = useState("")
  const [returnPeriod, setReturnPeriod] = useState("")

  const categories = [
    "Electronic Devices",
    "Men's Fashion",
    "Women's Fashion",
    "Home & Lifestyle",
    "Sports & Outdoor",
    "Electronic Accessories",
    "Health & Beauty",
    "Babies & Toys",
    "Groceries & Pets",
    "Motors, Tools & DIY",
    "Watches & Accessories",
    "Other",
  ]

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = await getToken()

      const response = await axios.get("/api/product/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      })

      if (response.data.success) {
        setProducts(response.data.products)
        calculateStats(response.data.products)
      } else {
        toast.error(response.data.message || "Failed to fetch products")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching products")
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (productList) => {
    const totalProducts = productList.length
    const popularProducts = productList.filter((p) => p.isPopular).length
    const outOfStock = productList.filter((p) => p.stock === 0).length
    const lowStock = productList.filter((p) => p.stock > 0 && p.stock <= 5).length

    setStats({
      totalProducts,
      popularProducts,
      outOfStock,
      lowStock,
    })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async () => {
    if (!productToDelete) return

    try {
      setIsDeleting(true)
      const token = await getToken()
      const { data } = await axios.delete(`/api/product/delete?id=${productToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        toast.success(data.message)
        fetchProducts()
        setShowDeleteModal(false)
        setProductToDelete(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete product")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setName(product.name)
    setDescription(product.description)
    setCategory(product.category)
    setPrice(product.price)
    setOfferPrice(product.offerPrice)
    setShippingFee(product.shippingFee)
    setDeliveryCharge(product.deliveryCharge)
    setSellerName(product.sellerName)
    setBrand(product.brand)
    setColor(product.color)
    setFiles([])
    setIsPopular(product.isPopular || false)
    setDeliveryDate(product.deliveryDate || "")
    setStock(product.stock?.toString() || "")
    setWarrantyDuration(product.warrantyDuration || "")
    setReturnPeriod(product.returnPeriod || "")
    setIsEditing(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("productId", selectedProduct._id)
    formData.append("name", name)
    formData.append("description", description)
    formData.append("category", category)
    formData.append("price", price)
    formData.append("offerPrice", offerPrice)
    formData.append("shippingFee", shippingFee)
    formData.append("deliveryCharge", deliveryCharge)
    formData.append("sellerName", sellerName)
    formData.append("brand", brand)
    formData.append("color", color)
    formData.append("isPopular", isPopular.toString())
    formData.append("deliveryDate", deliveryDate)
    formData.append("stock", stock)
    formData.append("warrantyDuration", warrantyDuration)
    formData.append("returnPeriod", returnPeriod)

    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        formData.append("images", files[i])
      }
    }

    try {
      const token = await getToken()
      const { data } = await axios.put("/api/product/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (data.success) {
        toast.success(data.message)
        setIsEditing(false)
        fetchProducts()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error)
      toast.error(error.response?.data?.message || error.message || "Failed to update product")
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setSelectedProduct(null)
  }

  const togglePopular = async (productId, currentStatus) => {
    try {
      const token = await getToken()
      const response = await axios.put(
        "/api/product/set-popular",
        {
          productId,
          isPopular: !currentStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.data.success) {
        toast.success(response.data.message)
        fetchProducts()
      }
    } catch (error) {
      console.error("Toggle popular error:", error)
      toast.error("Failed to update popular status")
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sellerName?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600">Manage all products across the platform</p>
            </div>
          </div>
          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.totalProducts}</p>
                <p className="text-sm text-blue-600">Total Products</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-900">{stats.popularProducts}</p>
                <p className="text-sm text-yellow-600">Popular Products</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-900">{stats.outOfStock}</p>
                <p className="text-sm text-red-600">Out of Stock</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-900">{stats.lowStock}</p>
                <p className="text-sm text-orange-600">Low Stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, brands, sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-white text-orange-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-white text-orange-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm text-gray-500">
              {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isEditing ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Pencil className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit Product</h2>
                <p className="text-gray-600">Update product information and settings</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Product Images</label>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {/* Current Images */}
                  {selectedProduct.images &&
                    selectedProduct.images.map((img, idx) => (
                      <div key={`current-${idx}`} className="relative group">
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`Product image ${idx + 1}`}
                          width={120}
                          height={120}
                          className="w-full aspect-square object-cover rounded-xl border border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <span className="text-white text-xs">Current</span>
                        </div>
                      </div>
                    ))}

                  {/* New Image Upload */}
                  {[...Array(4)].map((_, index) => (
                    <label key={index} htmlFor={`edit-image-${index}`} className="cursor-pointer group">
                      <input
                        onChange={(e) => {
                          const updatedFiles = [...files]
                          updatedFiles[index] = e.target.files[0]
                          setFiles(updatedFiles)
                        }}
                        type="file"
                        id={`edit-image-${index}`}
                        hidden
                        accept="image/*"
                      />
                      <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 transition-colors flex items-center justify-center bg-gray-50 group-hover:bg-orange-50">
                        {files[index] ? (
                          <Image
                            src={URL.createObjectURL(files[index]) || "/placeholder.svg"}
                            alt=""
                            width={120}
                            height={120}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="text-center">
                            <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1 group-hover:text-orange-500" />
                            <span className="text-xs text-gray-500 group-hover:text-orange-600">Add New</span>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Regular Price *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price *</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seller Name</label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    <input
                      id="edit-is-popular"
                      type="checkbox"
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                    />
                    <label htmlFor="edit-is-popular" className="text-sm font-medium text-gray-700">
                      Mark as Popular Product
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {products.length === 0 ? "No products yet" : "No products found"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {products.length === 0
                    ? "Products will appear here once sellers start adding them"
                    : "Try adjusting your search or filter criteria"}
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 ${
                      viewMode === "list" ? "flex items-center p-4 gap-4" : ""
                    }`}
                  >
                    {viewMode === "grid" ? (
                      <>
                        <div className="relative h-48">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          {product.isPopular && (
                            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Popular
                            </div>
                          )}
                          {product.stock <= 5 && product.stock > 0 && (
                            <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Low Stock
                            </div>
                          )}
                          {product.stock === 0 && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Out of Stock
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <span>{product.category}</span>
                            {product.brand && (
                              <>
                                <span>•</span>
                                <span>{product.brand}</span>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">by {product.sellerName}</p>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-lg font-bold text-gray-900">${product.offerPrice}</span>
                              {product.offerPrice < product.price && (
                                <span className="text-sm text-gray-500 line-through ml-2">${product.price}</span>
                              )}
                            </div>
                            <span
                              className={`text-sm px-2 py-1 rounded-full ${
                                product.stock > 10
                                  ? "bg-green-100 text-green-800"
                                  : product.stock > 0
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setProductToDelete(product)
                                  setShowDeleteModal(true)
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => togglePopular(product._id, product.isPopular)}
                                className={`p-2 rounded-lg transition-colors ${
                                  product.isPopular
                                    ? "text-yellow-600 hover:bg-yellow-50"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                                title={product.isPopular ? "Remove from Popular" : "Mark as Popular"}
                              >
                                <Star className={`w-4 h-4 ${product.isPopular ? "fill-current" : ""}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 relative flex-shrink-0">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover rounded-xl"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {product.category} • by {product.sellerName}
                              </p>
                              <div className="flex items-center gap-4">
                                <span className="font-bold text-gray-900">${product.offerPrice}</span>
                                <span
                                  className={`text-sm px-2 py-1 rounded-full ${
                                    product.stock > 10
                                      ? "bg-green-100 text-green-800"
                                      : product.stock > 0
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                </span>
                                {product.isPopular && (
                                  <div className="flex items-center gap-1 text-yellow-600">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-xs">Popular</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setProductToDelete(product)
                                  setShowDeleteModal(true)
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => togglePopular(product._id, product.isPopular)}
                                className={`p-2 rounded-lg transition-colors ${
                                  product.isPopular
                                    ? "text-yellow-600 hover:bg-yellow-50"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                                title={product.isPopular ? "Remove from Popular" : "Mark as Popular"}
                              >
                                <Star className={`w-4 h-4 ${product.isPopular ? "fill-current" : ""}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
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
                Are you sure you want to delete "{productToDelete?.name}"? This will permanently remove the product and
                all associated data.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setProductToDelete(null)
                  }}
                  className="flex-1 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
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
    </div>
  )
}

export default ManageProducts
