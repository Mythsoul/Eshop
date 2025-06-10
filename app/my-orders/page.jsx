"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/context/AppContext"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import axios from "axios"
import toast from "react-hot-toast"
import {
  Package,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  CreditCard,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Search,
  Filter,
  Loader2,
  ShoppingBag,
} from "lucide-react"

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext()

  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const ORDER_STATUS_COLORS = {
    "Order Placed": "bg-blue-100 text-blue-800 border-blue-200",
    Confirmed: "bg-green-100 text-green-800 border-green-200",
    Shipped: "bg-purple-100 text-purple-800 border-purple-200",
    "Out for delivery": "bg-orange-100 text-orange-800 border-orange-200",
    Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Order Placed":
        return <Clock className="w-4 h-4" />
      case "Confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "Shipped":
        return <Package className="w-4 h-4" />
      case "Out for delivery":
        return <Truck className="w-4 h-4" />
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />
      case "Cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const fetchOrders = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        setOrders(data.orders.reverse())
        setFilteredOrders(data.orders.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  useEffect(() => {
    let filtered = orders

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase()
      filtered = filtered.filter((order) => {
        const productNames = order.items
          .map((item) => (item.product?.name || "Product Unavailable").toLowerCase())
          .join(" ")
        const orderDate = new Date(order.date).toLocaleDateString().toLowerCase()
        const amount = order.amount.toString()

        return productNames.includes(searchTerm) || orderDate.includes(searchTerm) || amount.includes(searchTerm)
      })
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                  <p className="text-gray-600">Track and manage your order history</p>
                </div>
              </div>

              {/* Search */}
              <div className="w-full lg:w-96">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="all">All Orders</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {filteredOrders.length} of {orders.length} orders
              </div>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {orders.length === 0 ? "No orders yet" : "No orders found"}
              </h3>
              <p className="text-gray-600">
                {orders.length === 0
                  ? "Start shopping to see your orders here"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Package className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {currency}
                              {order.amount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                          ORDER_STATUS_COLORS[order.status] || ORDER_STATUS_COLORS["Order Placed"]
                        }`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status || "Order Placed"}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Order Items */}
                      <div className="lg:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Order Items ({order.items.length})
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {item.product?.name || "Product Unavailable"}
                                </p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery & Payment Info */}
                      <div className="space-y-6">
                        {/* Delivery Address */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Delivery Address
                          </h4>
                          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <p className="font-medium text-gray-900">{order.address.fullName}</p>
                            <p className="text-sm text-gray-600">{order.address.area}</p>
                            <p className="text-sm text-gray-600">
                              {order.address.city}, {order.address.state}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {order.address.PhoneNumber}
                            </p>
                          </div>
                        </div>

                        {/* Payment Info */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Payment Details
                          </h4>
                          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Method:</span>
                              <span className="font-medium">{order.paymentMethod || "COD"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Status:</span>
                              <span className="font-medium text-orange-600">{order.payment ? "Paid" : "Pending"}</span>
                            </div>
                            <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                              <span className="text-gray-600">Total Amount:</span>
                              <span className="font-bold text-gray-900">
                                {currency}
                                {order.amount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default MyOrders
