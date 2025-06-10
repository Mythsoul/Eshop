"use client"

import { useState } from "react"
import { useAppContext } from "@/context/AppContext"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Image from "next/image"
import { assets } from "@/assets/assets"
import axios from "axios"
import toast from "react-hot-toast"
import { useClerk } from "@clerk/clerk-react"
import {
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Building,
  Save,
  ArrowLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react"

const AddAddress = () => {
  const { getToken, router } = useAppContext()
  const { openSignIn } = useClerk()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [address, setAddress] = useState({
    fullName: "",
    PhoneNumber: "",
    zipcode: "",
    area: "",
    city: "",
    province: "",
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!address.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!address.PhoneNumber.trim()) {
      newErrors.PhoneNumber = "Phone number is required"
    } else if (!/^\+?[\d\s-()]+$/.test(address.PhoneNumber)) {
      newErrors.PhoneNumber = "Please enter a valid phone number"
    }

    if (!address.zipcode.trim()) {
      newErrors.zipcode = "Zip code is required"
    }

    if (!address.area.trim()) {
      newErrors.area = "Address area is required"
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!address.province.trim()) {
      newErrors.province = "Province is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly")
      return
    }

    setIsSubmitting(true)

    try {
      const token = await getToken()
      if (!token) {
        toast.error("Please sign up or log in to add your delivery address")
        openSignIn()
        return
      }

      const { data } = await axios.post(
        "/api/user/add-address",
        { addressData: address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (data.success) {
        toast.success(data.message)
        // Reset form after successful submission
        setAddress({
          fullName: "",
          PhoneNumber: "",
          zipcode: "",
          area: "",
          city: "",
          province: "",
        })
        setErrors({})
        router.push("/cart")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error adding address:", error)
      if (error.response?.status === 401) {
        toast.error("Please sign up or log in to add your delivery address")
        openSignIn()
      } else {
        toast.error(error.response?.data?.message || "Failed to add address. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setAddress({ ...address, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const provinces = [
    "Province 1",
    "Madhesh Province",
    "Bagmati Province",
    "Gandaki Province",
    "Lumbini Province",
    "Karnali Province",
    "Sudurpashchim Province",
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Add Shipping Address</h1>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please provide your delivery address details to ensure your orders reach you safely and on time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Delivery Information</h2>
                  <p className="text-gray-600">Fill in your complete address details</p>
                </div>
              </div>

              <form onSubmit={onSubmitHandler} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={address.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.fullName
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={address.PhoneNumber}
                    onChange={(e) => handleInputChange("PhoneNumber", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.PhoneNumber
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                    }`}
                  />
                  {errors.PhoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.PhoneNumber}
                    </p>
                  )}
                </div>

                {/* Zip Code */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter zip code"
                    value={address.zipcode}
                    onChange={(e) => handleInputChange("zipcode", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.zipcode
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                    }`}
                  />
                  {errors.zipcode && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.zipcode}
                    </p>
                  )}
                </div>

                {/* Address Area */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4" />
                    Address (Area and Street) *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter your complete address including area, street, and landmarks"
                    value={address.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.area
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                    }`}
                  />
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.area}
                    </p>
                  )}
                </div>

                {/* City and Province */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Building className="w-4 h-4" />
                      City/District/Town *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city name"
                      value={address.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.city
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4" />
                      Province *
                    </label>
                    <select
                      value={address.province}
                      onChange={(e) => handleInputChange("province", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.province
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                      }`}
                    >
                      <option value="">Select Province</option>
                      {provinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                    {errors.province && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.province}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving Address...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Address
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Illustration Section */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
                <Image
                  className="mx-auto mb-6 max-w-full h-auto"
                  src={assets.my_location_image || "/placeholder.svg"}
                  alt="Location illustration"
                  width={300}
                  height={300}
                />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Delivery</h3>
                <p className="text-gray-600">
                  Your address information is encrypted and secure. We use this only for delivery purposes and never
                  share it with third parties.
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-6">Why Add Your Address?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Faster checkout process</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Accurate delivery estimates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Real-time order tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Secure and reliable delivery</span>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <strong>Tip:</strong> Include nearby landmarks in your address for easier delivery.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> Make sure your phone number is active for delivery coordination.
                  </p>
                  <div className="pt-3 border-t border-gray-200">
                    <a
                      href="/contact"
                      className="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                    >
                      Contact Support →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AddAddress
