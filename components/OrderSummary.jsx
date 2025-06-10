import { addressDummyData, assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const OrderSummary = () => {

  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems, products } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [userAddresses, setUserAddresses] = useState([]);
  const [totalShippingFee, setTotalShippingFee] = useState(0);
  const [totalDeliveryCharge, setTotalDeliveryCharge] = useState(0);

  const paymentMethods = [
    { id: 'esewa', name: 'eSewa', image: assets.esewa.src },
    { id: 'khalti', name: 'Khalti', image: assets.khalti.src },
  ];

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken()
      const {data} = await axios.get('/api/user/get-address', {headers:{Authorization: `Bearer ${token}`}})
      if(data.success){
        setUserAddresses(data.addresses)
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address")
      }

      if (!selectedPayment) {
        return toast.error("Please select a payment method")
      }

      // Convert cart items object to array of items with quantity > 0
      let cartItemsArray = [];
      
      // Safely process cart items and validate stock
      if (cartItems && typeof cartItems === 'object') {
        // Check stock availability before placing order
        const insufficientStock = products.find(product => {
          const quantity = cartItems[product._id] || 0;
          return quantity > product.stock;
        });

        if (insufficientStock) {
          return toast.error(
            `Only ${insufficientStock.stock} items available for ${insufficientStock.name}`
          );
        }

        cartItemsArray = Object.entries(cartItems).map(([id, quantity]) => ({
          product: id,
          quantity: Number(quantity)
        })).filter(item => item.quantity > 0);
      }
      
      if(cartItemsArray.length === 0){
        return toast.error("Your cart is empty")
      }

      const token = await getToken()

      const response = await axios.post('/api/order/create', {
        address: selectedAddress,  // Send the full address object
        items: cartItemsArray,
        paymentMethod: selectedPayment.id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if(response.data.success){
        toast.success(response.data.message)
        
        // The cart is already cleared in the order creation API
        // Just update the local state to reflect this
        setCartItems({});
        
        // Navigate to order placed page
        router.push('/order-placed')
      } else {
        toast.error(response.data.message)
      }

    } catch(error){
      console.error('Error creating order:', error)
      toast.error(error.response?.data?.message || "Failed to create order")
    }

  }

  // Calculate shipping fee and delivery charge from products in cart
  const calculateFees = () => {
    if (!products || !cartItems) return { shippingFee: 0, deliveryCharge: 0 };
    
    let shippingFee = 0;
    let deliveryCharge = 0;
    
    Object.entries(cartItems).forEach(([productId, quantity]) => {
      const product = products.find(p => p._id === productId);
      if (product) {
        // Add shipping fee if available
        if (product.shippingFee) {
          shippingFee += product.shippingFee * quantity;
        }
        
        // Add delivery charge if available
        if (product.deliveryCharge) {
          deliveryCharge += product.deliveryCharge * quantity;
        }
      }
    });
    
    return { shippingFee, deliveryCharge };
  };

  useEffect(() => {
    fetchUserAddresses();
    const { shippingFee, deliveryCharge } = calculateFees();
    setTotalShippingFee(shippingFee);
    setTotalDeliveryCharge(deliveryCharge);
  }, [products, cartItems])

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={(e) => {
                e.preventDefault();
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.province}`
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={(e) => {
                  e.preventDefault();
                  handleAddressSelect(address);
                }}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.province}
                  </li>
                ))}
                <li
                  onClick={(e) => {
                  e.preventDefault();
                  router.push("/add-address");
                }}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="mb-6">
          <label className="text-base font-medium uppercase text-gray-600 block mb-3">
            Select Payment Method
          </label>
          <div className="grid grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedPayment(method);
                }}
                className={`border rounded-lg flex items-center justify-center hover:border-orange-500 transition-colors h-24 ${selectedPayment?.id === method.id ? 'border-orange-500' : 'border-gray-200'}`}
              >
                <img src={method.image} alt={method.name} className="w-[90%] h-[90%] object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">Rs. {getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Rs. {totalShippingFee}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Delivery Charge</p>
            <p className="font-medium text-gray-800">Rs. {totalDeliveryCharge}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>Rs. {getCartAmount() + totalShippingFee + totalDeliveryCharge}</p>
          </div>
        </div>
      </div>

      <button onClick={(e) => {
        e.preventDefault();
        createOrder();
      }} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;