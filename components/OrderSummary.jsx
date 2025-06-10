"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "@/context/AppContext"
import toast from "react-hot-toast"
import axios from "axios"
import { MapPin, CreditCard, Tag, ShoppingBag, Plus, ChevronDown, Loader2 } from 'lucide-react'

const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems, products } =
    useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [userAddresses, setUserAddresses] = useState([])
  const [totalShippingFee, setTotalShippingFee] = useState(0)
  const [totalDeliveryCharge, setTotalDeliveryCharge] = useState(0)
  const [promoCode, setPromoCode] = useState("")
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const paymentMethods = [
    { id: "esewa", name: "eSewa", image: "/placeholder.svg?height=40&width=80", color: "from-green-500 to-green-600" },
    { id: "khalti", name: "Khalti", image: "/placeholder.svg?height=40&width=80", color: "from-purple-500 to-purple-600" },
  ]

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get("/api/user/get-address", { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setUserAddresses(data.addresses)
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0])
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address)
    setIsDropdownOpen(false)
  }

  const createOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address")
      }

      if (!selectedPayment) {
        return toast.error("Please select a payment method")
      }

      setIsPlacingOrder(true)

      let cartItemsArray = []

      if (cartItems && typeof cartItems === "object") {
        const insufficientStock = products.find((product) => {
          const quantity = cartItems[product._id] || 0
          return quantity > product.stock
        })

        if (insufficientStock) {
          return toast.error(`Only ${insufficientStock.stock} items available for ${insufficientStock.name}`)
        }

        cartItemsArray = Object.entries(cartItems)
          .map(([id, quantity]) => ({
            product: id,
            quantity: Number(quantity),
          }))
          .filter((item) => item.quantity > 0)
      }

      if (cartItemsArray.length === 0) {
        return toast.error("Your cart is empty")
      }

      const token = await getToken()

      const response = await axios.post(
        "/api/order/create",
        {
          address: selectedAddress,
          items: cartItemsArray,
          paymentMethod: selectedPayment.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (response.data.success) {
        toast.success(response.data.message)
        setCartItems({})
        router.push("/order-placed")
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error(error.response?.data?.message || "Failed to create order")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const calculateFees = () => {
    if (!products || !cartItems) return { shippingFee: 0, deliveryCharge: 0 }

    let shippingFee = 0
    let deliveryCharge = 0

    Object.entries(cartItems).forEach(([productId, quantity]) => {
      const product = products.find((p) => p._id === productId)
      if (product) {
        if (product.shippingFee) {
          shippingFee += product.shippingFee * quantity
        }
        if (product.deliveryCharge) {
          deliveryCharge += product.deliveryCharge * quantity
        }
      }
    })

    return { shippingFee, deliveryCharge }
  }

  useEffect(() => {
    fetchUserAddresses()
    const { shippingFee, deliveryCharge } = calculateFees()
    setTotalShippingFee(shippingFee)
    setTotalDeliveryCharge(deliveryCharge)
  }, [products, cartItems])

  return (
    <div className="w-full md:w-96 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
      </div>

      <div className="space-y-6">
        {/* Address Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <MapPin className="w-4 h-4" />
            Delivery Address
          </label>
          <div className="relative">
            <button
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-left transition-colors flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-sm text-gray-700">
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}`
                  : "Select Address"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-2 z-10 py-2 max-h-48 overflow-y-auto">
                {userAddresses.map((address, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm"
                    onClick={() => handleAddressSelect(address)}
                  >
                    <div className="font-medium text-gray-900">{address.fullName}</div>
                    <div className="text-gray-600">
                      {address.area}, {address.city}, {address.province}
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => router.push("/add-address")}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm text-orange-600 font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Address
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Tag className="w-4 h-4" />
            Promo Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
            <button className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors text-sm">
              Apply
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <CreditCard className="w-4 h-4" />
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method)}
                className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                  selectedPayment?.id === method.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img src={method.image || "/placeholder.svg"} alt={method.name} className="w-full h-8 object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Items ({getCartCount()})</span>
            <span className="font-medium">Rs. {getCartAmount()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping Fee</span>
            <span className="font-medium">Rs. {totalShippingFee}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Charge</span>
            <span className="font-medium">Rs. {totalDeliveryCharge}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-orange-600">Rs. {getCartAmount() + totalShippingFee + totalDeliveryCharge}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={createOrder}
          disabled={isPlacingOrder}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isPlacingOrder ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Placing Order...
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              Place Order
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default OrderSummary

