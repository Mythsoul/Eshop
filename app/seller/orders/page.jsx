"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/context/AppContext"
import Footer from "@/components/seller/Footer"
import axios from "axios"
import toast from "react-hot-toast"
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Package,
  User,
  Phone,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"

const Orders = () => {
  const { currency, getToken, user } = useAppContext()

  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [updatingStatus, setUpdatingStatus] = useState({})

  const ORDER_STATUS = {
    PENDING: "Order Placed",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    OUT_FOR_DELIVERY: "Out for delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  }

  const ORDER_STATUS_COLORS = {
    "Order Placed": "bg-blue-100 text-blue-800",
    Confirmed: "bg-green-100 text-green-800",
    Shipped: "bg-purple-100 text-purple-800",
    "Out for delivery": "bg-orange-100 text-orange-800",
    Delivered: "bg-emerald-100 text-emerald-800",
    Cancelled: "bg-red-100 text-red-800",
  }

  const fetchSellerOrders = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get("/api/order/seller-orders", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        setOrders(data.orders)
        setFilteredOrders(data.orders)
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
      fetchSellerOrders()
    }
  }, [user])

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }))
      const token = await getToken()
      const { data } = await axios.put(
        "/api/order/update-status",
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (data.success) {
        setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)))
        setFilteredOrders(
          filteredOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)),
        )
        toast.success(`Order status updated to ${newStatus}`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  const filterAndSortOrders = (orders) => {
    let result = [...orders]

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase()
      result = result.filter((order) => {
        const customerName = order.address.fullName.toLowerCase()
        if (customerName.includes(searchTerm)) return true

        const productNames = order.items.map((item) => item.product.name.toLowerCase())
        if (productNames.some((name) => name.includes(searchTerm))) return true

        const orderDate = new Date(order.date).toLocaleDateString().toLowerCase()
        if (orderDate.includes(searchTerm)) return true

        const amount = order.amount.toString()
        if (amount.includes(searchTerm)) return true

        return false
      })
    }

    result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB
      } else if (sortBy === "amount") {
        return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount
      }
      return 0
    })

    return result
  }

  useEffect(() => {
    if (orders.length) {
      const filtered = filterAndSortOrders(orders)
      setFilteredOrders(filtered)
    }
  }, [orders, searchQuery, statusFilter, sortBy, sortOrder])

  const getStatusIcon = (status) => {
    switch (status) {
      case "Order Placed":
        return <Clock className="w-4 h-4" />
      case "Confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "Shipped":
        return <Package className="w-4 h-4" />
      case "Out for delivery":
        return <TrendingUp className="w-4 h-4" />
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />
      case "Cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600">Track and manage your customer orders</p>
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
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="all">All Orders</option>
              {Object.values(ORDER_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <button
              onClick={() => {
                if (sortBy === "date") {
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                } else {
                  setSortBy("date")
                  setSortOrder("desc")
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                sortBy === "date" ? "bg-orange-100 text-orange-800" : "hover:bg-gray-100"
              }`}
            >
              Date {sortBy === "date" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
            <button
              onClick={() => {
                if (sortBy === "amount") {
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                } else {
                  setSortBy("amount")
                  setSortOrder("desc")
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                sortBy === "amount" ? "bg-orange-100 text-orange-800" : "hover:bg-gray-100"
              }`}
            >
              Amount {sortBy === "amount" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't received any orders yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Order Items */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {order.items.map((item) => `${item.product.name} x${item.quantity}`).join(", ")}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {currency}
                            {order.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="lg:w-64">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">{order.address.fullName}</p>
                      <p className="flex items-start gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {order.address.area}, {order.address.city}, {order.address.state}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        {order.address.PhoneNumber}
                      </p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="lg:w-48">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Payment: {order.paymentMethod}</p>
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                            ORDER_STATUS_COLORS[order.status]
                          }`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={updatingStatus[order._id]}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                        >
                          {Object.values(ORDER_STATUS).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        {updatingStatus[order._id] && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Updating...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Orders
