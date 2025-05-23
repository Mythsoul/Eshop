'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { ORDER_STATUS, ORDER_STATUS_COLORS } from "@/lib/constants/orderStatus";

const Orders = () => {

    const { currency, getToken, user } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    const fetchSellerOrders = async () => {
        try{

            const token = await getToken()
            const {data} = await axios.get('/api/order/seller-orders', {headers:{Authorization: `Bearer ${token}`}})

            if(data.success){
                setOrders(data.orders)
                setFilteredOrders(data.orders)
                setLoading(false)
            } else {
                toast.error(data.message)
            }

        } catch(error){
            toast.error(error.message)
        }
            
        setLoading(false);
    }

    useEffect(() => {
        if(user){
            fetchSellerOrders();
        }

    }, [user]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const token = await getToken();
            const { data } = await axios.put('/api/order/update-status', 
                { orderId, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                setOrders(orders.map(order => 
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
                setFilteredOrders(filteredOrders.map(order => 
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
                toast.success(`Order status updated to ${newStatus}`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const filterAndSortOrders = (orders) => {
        let result = [...orders];

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(order => order.status === statusFilter);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const searchTerm = searchQuery.toLowerCase();
            result = result.filter(order => {
                const customerName = order.address.fullName.toLowerCase();
                if (customerName.includes(searchTerm)) return true;

                const productNames = order.items.map(item => item.product.name.toLowerCase());
                if (productNames.some(name => name.includes(searchTerm))) return true;

                const orderDate = new Date(order.date).toLocaleDateString().toLowerCase();
                if (orderDate.includes(searchTerm)) return true;

                const amount = order.amount.toString();
                if (amount.includes(searchTerm)) return true;

                return false;
            });
        }

        // Apply sorting
        result.sort((a, b) => {
            if (sortBy === 'date') {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            } else if (sortBy === 'amount') {
                return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
            }
            return 0;
        });

        return result;
    };

    useEffect(() => {
        if (orders.length) {
            const filtered = filterAndSortOrders(orders);
            setFilteredOrders(filtered);
        }
    }, [orders, searchQuery, statusFilter, sortBy, sortOrder]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-lg font-medium">Orders</h2>
                        <div className="w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search by customer name, product, date, or amount..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-orange-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Filter by status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-orange-500"
                            >
                                <option value="all">All Orders</option>
                                {Object.values(ORDER_STATUS).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Sort by:</span>
                            <button
                                onClick={() => handleSort('date')}
                                className={`px-3 py-1.5 rounded-lg ${sortBy === 'date' ? 'bg-orange-100 text-orange-800' : 'hover:bg-gray-100'}`}
                            >
                                Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
                            </button>
                            <button
                                onClick={() => handleSort('amount')}
                                className={`px-3 py-1.5 rounded-lg ${sortBy === 'amount' ? 'bg-orange-100 text-orange-800' : 'hover:bg-gray-100'}`}
                            >
                                Amount {sortBy === 'amount' && (sortOrder === 'desc' ? '↓' : '↑')}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-w-4xl rounded-md">
                    {filteredOrders.map((order, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                            <div className="flex-1 flex gap-5 max-w-80">
                                <Image
                                    className="max-w-16 max-h-16 object-cover"
                                    src={assets.box_icon}
                                    alt="box_icon"
                                />
                                <p className="flex flex-col gap-3">
                                    <span className="font-medium">
                                        {order.items.map((item) => item.product.name + ` x ${item.quantity}`).join(", ")}
                                    </span>
                                    <span>Items : {order.items.length}</span>
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-medium">{order.address.fullName}</span>
                                    <br />
                                    <span >{order.address.area}</span>
                                    <br />
                                    <span>{`${order.address.city}, ${order.address.state}`}</span>
                                    <br />
                                    <span>{order.address.phoneNumber}</span>
                                </p>
                            </div>
                            <p className="font-medium my-auto">{currency}{order.amount}</p>
                            <div className="space-y-3">
                                <p className="flex flex-col">
                                    <span>Method : {order.paymentMethod}</span>
                                    <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                </p>
                                <div className="flex flex-col gap-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                                        {order.status}
                                    </span>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        className="px-2 py-1 text-sm border border-gray-300 rounded-md outline-none focus:border-orange-500"
                                    >
                                        {Object.values(ORDER_STATUS).map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;