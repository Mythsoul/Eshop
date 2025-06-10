"use client"

import { useState } from "react"
import { useAppContext } from "@/context/AppContext"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"
import axios from "axios"
import { Upload, Package, DollarSign, Truck, Calendar, Shield, RotateCcw, Loader2, CheckCircle } from "lucide-react"

const AddProduct = () => {
  const { getToken } = useAppContext()

  const [files, setFiles] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Electronic Devices")
  const [price, setPrice] = useState("")
  const [offerPrice, setOfferPrice] = useState("")
  const [shippingFee, setShippingFee] = useState("0")
  const [deliveryCharge, setDeliveryCharge] = useState("0")
  const [sellerName, setSellerName] = useState("")
  const [brand, setBrand] = useState("")
  const [color, setColor] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [stock, setStock] = useState("")
  const [warrantyDuration, setWarrantyDuration] = useState("")
  const [returnPeriod, setReturnPeriod] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("price", price)
      formData.append("offerPrice", offerPrice)
      formData.append("shippingFee", shippingFee)
      formData.append("deliveryCharge", deliveryCharge)
      formData.append("sellerName", sellerName)
      formData.append("brand", brand || "")
      formData.append("color", color || "")
      formData.append("isPopular", false)
      formData.append("deliveryDate", deliveryDate || "")
      formData.append("stock", stock || "0")
      formData.append("warrantyDuration", warrantyDuration || "")
      formData.append("returnPeriod", returnPeriod || "")

      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i])
      }

      const token = await getToken()
      const { data } = await axios.post("/api/product/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        toast.success(data.message)
        // Reset form
        setFiles([])
        setName("")
        setDescription("")
        setCategory("Electronic Devices")
        setPrice("")
        setOfferPrice("")
        setShippingFee("0")
        setDeliveryCharge("0")
        setSellerName("")
        setBrand("")
        setColor("")
        setDeliveryDate("")
        setStock("")
        setWarrantyDuration("")
        setReturnPeriod("")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600">Create and publish a new product to your store</p>
          </div>
          <Link
            href="/seller/product-list"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
          >
            <Package className="w-4 h-4" />
            Manage Products
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Images */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
                <p className="text-sm text-gray-500">Upload up to 4 high-quality images</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <label key={index} htmlFor={`image${index}`} className="group cursor-pointer">
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files]
                      updatedFiles[index] = e.target.files[0]
                      setFiles(updatedFiles)
                    }}
                    type="file"
                    id={`image${index}`}
                    hidden
                    accept="image/*"
                  />
                  <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 transition-colors flex items-center justify-center bg-gray-50 group-hover:bg-orange-50">
                    {files[index] ? (
                      <Image
                        src={URL.createObjectURL(files[index]) || "/placeholder.svg"}
                        alt=""
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-orange-500" />
                        <p className="text-sm text-gray-500 group-hover:text-orange-600">
                          {index === 0 ? "Main Image" : `Image ${index + 1}`}
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-500">Essential product details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Description *</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="Describe your product in detail"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seller Name *</label>
                <input
                  type="text"
                  placeholder="Your store or business name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  onChange={(e) => setSellerName(e.target.value)}
                  value={sellerName}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  placeholder="Product brand"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  onChange={(e) => setBrand(e.target.value)}
                  value={brand}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="text"
                  placeholder="Product color"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  onChange={(e) => setColor(e.target.value)}
                  value={color}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h2>
                <p className="text-sm text-gray-500">Set your pricing and stock levels</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Regular Price *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    onChange={(e) => setOfferPrice(e.target.value)}
                    value={offerPrice}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Available quantity"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  onChange={(e) => setStock(e.target.value)}
                  value={stock}
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping & Delivery */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Shipping & Delivery</h2>
                <p className="text-sm text-gray-500">Configure shipping options</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Fee</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    onChange={(e) => setShippingFee(e.target.value)}
                    value={shippingFee}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Charge</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    onChange={(e) => setDeliveryCharge(e.target.value)}
                    value={deliveryCharge}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g., 3-5 days"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    value={deliveryDate}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Warranty & Returns */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Warranty & Returns</h2>
                <p className="text-sm text-gray-500">Customer protection policies</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Duration</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g., 1 year, 6 months"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    onChange={(e) => setWarrantyDuration(e.target.value)}
                    value={warrantyDuration}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return Period</label>
                <div className="relative">
                  <RotateCcw className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g., 30 days, 7 days"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    onChange={(e) => setReturnPeriod(e.target.value)}
                    value={returnPeriod}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Publish Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct
