"use client";
import React, { useState } from "react";
import { assets, CartIcon } from "@/assets/assets";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useEffect } from "react";
import { HomeIcon, ShoppingBag, Menu, BoxIcon, Phone } from "lucide-react";



const Navbar = () => {
  const { isSeller, user } = useAppContext();
  const router = useRouter();
  const { openSignIn } = useClerk();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleMobileNavigation = (path) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-0 justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 sticky top-0 bg-white z-50">
      <div className="flex flex-col md:block w-full md:w-auto gap-3">
        <div className="flex items-center justify-between md:justify-start">
          <Image
            className="cursor-pointer w-28 md:w-32 hover:opacity-80 transition-opacity"
            onClick={() => router.push("/")}
            src={assets.logo}
            alt="logo"
          />
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              {/* @ts-ignore */}
              <Menu className="w-6 h-6" />
            </button>
            {user ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="Cart"
                    labelIcon={<CartIcon />}
                    onClick={() => router.push("/cart")}
                  />
                  <UserButton.Action
                    label="My Orders"
                    labelIcon={<ShoppingBag />}
                    onClick={() => router.push("/my-orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <button
                onClick={(e) => { e.preventDefault(); openSignIn(); }}
                className="flex items-center gap-2 hover:text-orange-500 hover:scale-105 transition-all duration-200"
              >
                <Image src={assets.user_icon} alt="user icon" className="w-5 h-5" />
                Account
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 py-4 px-6 shadow-lg z-50">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleMobileNavigation("/")}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
              >
                <HomeIcon className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={() => handleMobileNavigation("/all-products")}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
              >
                <BoxIcon className="w-5 h-5" />
                All Products
              </button>
              {/* category select dropdown here */}
              {user && (
                <>
                  <button
                    onClick={() => handleMobileNavigation("/cart")}
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
                  >
                    <div className="w-5 h-5">
                      <CartIcon />
                    </div>
                    Cart
                  </button>
                  <button
                    onClick={() => handleMobileNavigation("/my-orders")}
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    My Orders
                  </button>
                </>
              )}
              {isSeller && (
                <button
                  onClick={() => handleMobileNavigation("/seller")}
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
                >
                  <BoxIcon className="w-5 h-5" />
                  Seller Dashboard
                </button>
              )}
              {/* Add Contact Us button here */}
              <button
                onClick={() => handleMobileNavigation("/contact")}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
              >
                <Phone className="w-5 h-5" />
                Contact
              </button>
            </div>
          </div>
        )}



        {/* Mobile Menu Ender */}
        <form onSubmit={handleSearch} className="relative md:hidden w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-orange-500 transition-colors pr-10"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-orange-500 transition-colors">
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
        </form>
      </div>

      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-orange-500 hover:scale-105 transition-all duration-200 relative group">
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-200"></span>
        </Link>
        <Link href="/all-products" className="hover:text-orange-500 hover:scale-105 transition-all duration-200 relative group">
          Shop
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-200"></span>
        </Link>
        <Link
          href="/about-us"
          className="hover:text-orange-500 hover:scale-105 transition-all duration-200 relative group"
        >
          About Us
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-200"></span>
        </Link>

        <Link href="/contact" className="hover:text-orange-500 hover:scale-105 transition-all duration-200 relative group">
          Contact
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-200"></span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-48 px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-orange-500 hover:border-gray-400 transition-all text-sm"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-orange-500 transition-colors">
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
        </form>
        <select
          onChange={(e) => {
            if (e.target.value) {
              router.push(`/all-products?category=${encodeURIComponent(e.target.value)}`);
            }
          }}
          className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-gray-400 transition-all cursor-pointer"
          defaultValue=""
        >
          <option value="">Select Category</option>
          <option value="Men's Fashion">Men's Fashion</option>
          <option value="Women's Fashion">Women's Fashion</option>
          <option value="Electronic Devices">Electronic Devices</option>
          <option value="Gifts & Decorations">Gifts & Decorations</option>
          <option value="Home & Lifestyle">Home & Lifestyle</option>
          <option value="Sports & Outdoor">Sports & Outdoor</option>
          <option value="Health & Beauty">Health & Beauty</option>
          <option value="Babies & Toys">Babies & Toys</option>
          <option value="Motors, Tools & DIY">Motors, Tools & DIY</option>
          <option value="Groceries & Pets">Groceries & Pets</option>
        </select>
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Home"
                labelIcon={<HomeIcon />}
                onClick={() => router.push("/")}
              />
              <UserButton.Action
                label="Products"
                labelIcon={<BoxIcon />}
                onClick={() => router.push("/all-products")}
              />

              <UserButton.Action
                label="Cart"
                labelIcon={<CartIcon />}
                onClick={() => router.push("/cart")}
              />
              <UserButton.Action
                label="My Orders"
                labelIcon={<ShoppingBag />}
                onClick={() => router.push("/my-orders")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={(e) => { e.preventDefault(); openSignIn(); }}
            className="flex items-center gap-2 hover:text-orange-500 hover:scale-105 transition-all duration-200"
          >
            <Image src={assets.user_icon} alt="user icon" className="w-5 h-5" />
            Account
          </button>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
