'use client'

import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { set } from "mongoose";

/** @type {import('react').Context<AppContextType>} */
export const AppContext = createContext(/** @type {AppContextType} */ ({
  cart: [],
  setCart: (cart) => {},
  loading: false,
  setLoading: (loading) => {},
  user: null,
  setUser: (user) => {},
  currency: "",
  router: null,
  isSeller: false,
  setIsSeller: (isSeller) => {},
  cartItems: {},
  setCartItems: (items) => {},
  products: [],
  setProducts: (products) => {},
  getCartCount: () => 0,
  getCartAmount: () => 0,
  getToken: async () => "",
}));

/**
 * @typedef {Object} AppContextType
 * @property {any[]} cart - The cart items
 * @property {(cart: any) => void} setCart - Function to update cart
 * @property {boolean} loading - Loading state
 * @property {(loading: boolean) => void} setLoading - Function to update loading state
 * @property {any} user - Current user
 * @property {(user: any) => void} setUser - Function to update user
 * @property {string} currency - Currency code
 * @property {any} router - Next.js router
 * @property {boolean} isSeller - Whether user is a seller
 * @property {(isSeller: boolean) => void} setIsSeller - Function to update seller status
 * @property {Record<string, number>} cartItems - Cart items
 * @property {(items: Record<string, number>) => void} setCartItems - Function to update cart items
 * @property {any[]} products - Product list
 * @property {(products: any[]) => void} setProducts - Function to update products
 * @property {() => number} getCartCount - Function to get cart item count
 * @property {() => number} getCartAmount - Function to get cart total amount
 * @property {() => Promise<string>} getToken - Function to get auth token
 * @property {(itemId: string) => Promise<void>} addToCart - Function to add item to cart
 * @property {(itemId: string, quantity: number) => Promise<void>} updateCartQuantity - Function to update cart item quantity
 */

export const useAppContext = () => {
    return useContext(AppContext);
}

    /**
     * Provider component for the AppContext.
     *
     * The AppContextProvider fetches product data and user data on mount.
     * It also provides functions to add and update items in the cart.
     * The context value includes the current cart, a function to set the cart,
     * a boolean indicating whether the user is a seller, a function to set that boolean,
     * a function to get the total number of items in the cart, and a function to get the total amount of the cart.
     * @param {{ children: React.ReactNode }} props
     * @returns {React.ReactElement} The AppContextProvider component.
     */
export const AppContextProvider = ({ children }) => {

    const { getToken } = useAuth();
    const { user } = useUser();
    const router = useRouter();
    const currency = "NPR";
    const [loading, setLoading] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [userData, setUserData] = useState(null);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [isAdmin , setIsAdmin] = useState(false); 


const fetchProductData = async () => {
    try {
        setLoading(true);
        const { data } = await axios.get('/api/product/list');
        if (data.success) {
            setProducts(data.products);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        toast.error(error.response?.data?.message || error.message);
    } finally {
        setLoading(false);
    }
};

const fetchPopularProducts = async () => {
    try{ 
        const {data} = await axios.get('/api/product/popular')
        if(data.success) {
            // Filter and update products list with popular items
            const updatedProducts = products.map(product => {
                const popularProduct = data.products.find(p => p._id === product._id);
                return popularProduct || product;
            });
            setProducts(updatedProducts);
        }
    } catch(error){
        console.error('Error fetching popular products:', error);
        toast.error(error.response?.data?.message || error.message);
    }
}

    const fetchUserData = async () => {
        try {
            setLoading(true);
            let token;
            
            // First try to get Clerk token
            if (user) {
                try {
                    token = await getToken();
                    console.log('Got Clerk token:', !!token);
                } catch (tokenError) {
                    console.error('Error getting Clerk token:', tokenError);
                }
            }

            // Fallback to user ID if no token
            if (!token && user?.id) {
                token = user.id;
                console.log('Using user ID as token:', token);
            }

            if (!token) {
                console.error('No token or user ID available');
                return;
            }
            
            // Check if user exists and has metadata
            if (user?.publicMetadata.role === 'seller') {
                setIsSeller(true);
            }
            if(user?.publicMetadata.role === 'admin') {
                setIsSeller(true);
                setIsAdmin(true); 
            
            }

            console.log('Fetching user data with token...');
            const { data } = await axios.get('/api/user/data', { 
                headers: { Authorization: `Bearer ${token}` }
            });
          
            if (data.success) {
                setUserData(data.user);
                
                // Fetch cart items separately
                try {
                    const cartResponse = await axios.get('/api/cart/get', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    if (cartResponse.data.success) {
                        setCartItems(cartResponse.data.cartItems || {});
                    }
                } catch (cartError) {
                    console.error('Error fetching cart:', cartError);
                    // Fallback to user's cart items if cart API fails
                    setCartItems(data.user.cartItems || {});
                } finally {
                    setLoading(false);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success('Item added to cart')
        if(user){ 
            try {
                const token = await getToken()
                
                await axios.post('/api/cart/update',{cartData},{headers:{Authorization: `Bearer ${token}`}})

                toast.success('Item added to cart')

            } catch(error){
                toast.error(error.message)
            }
        }
    }

    const updateCartQuantity = async (itemId, quantity) => {
        try {
            // Get the product to check stock
            const product = products.find(p => p._id === itemId);
            if (!product) {
                toast.error('Product not found');
                return;
            }

            // Validate stock level
            if (quantity > product.stock) {
                toast.error(`Only ${product.stock} items available in stock`);
                quantity = product.stock;  // Set to maximum available stock
            }

            // Create a new cart object instead of mutating the existing one
            let cartData = {...cartItems};
            
            // Handle item removal
            if (quantity <= 0) {
                delete cartData[itemId];
                toast.success('Item removed from cart');
            } else {
                // Ensure quantity is a number
                cartData[itemId] = Number(quantity);
            }
            
            // Update local state first for immediate UI feedback
            setCartItems(cartData);
            
            // If user is logged in, update the server
            if(user){ 
                try {
                    const token = await getToken();
                    
                    const response = await axios.post('/api/cart/update', 
                        {cartData}, 
                        {headers: {Authorization: `Bearer ${token}`}}
                    );
                    
                    if (!response.data.success) {
                        console.error('Failed to update cart on server');
                        toast.error('Failed to sync cart with server');
                    }
                } catch(error) {
                    console.error('Cart update error:', error);
                    toast.error(error.message || 'Error updating cart');
                }
            }
        } catch (error) {
            console.error('Cart update error:', error);
            toast.error('Failed to update cart');
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                totalCount += cartItems[itemId];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            let itemInfo = products.find((product) => product._id === itemId);
            if (itemInfo && cartItems[itemId] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[itemId];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData();
        fetchPopularProducts();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    /** @type {AppContextType} */
    const value = {
        cart: Object.values(cartItems),
        setCart: setCartItems,
        loading,
        setLoading,
        user,
        setUser: () => {},
        currency,
        router,
        isSeller,
        setIsSeller,
        cartItems,
        setCartItems,
        products,
        setProducts,
        getCartCount,
        getCartAmount,
        getToken,
        addToCart,
        updateCartQuantity
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
