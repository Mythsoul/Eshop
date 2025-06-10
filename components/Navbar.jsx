"use client"
import { useState } from "react"
import { assets, CartIcon } from "@/assets/assets"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/AppContext"
import Image from "next/image"
import { useClerk, UserButton } from "@clerk/clerk-react"
import { HomeIcon, ShoppingBag, Menu, BoxIcon, Search, X, ShoppingCart } from "lucide-react"

const Navbar = () => {
  const { isSeller, user } = useAppContext()
  const router = useRouter()
  const { openSignIn } = useClerk()
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsSearchOpen(false)
    }
  }

  const handleMobileNavigation = (path) => {
    router.push(path)
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/all-products", label: "Shop" },
    { href: "/about-us", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              className="cursor-pointer w-28 lg:w-36 hover:opacity-80 transition-opacity"
              onClick={() => router.push("/")}
              src={assets.logo || "/placeholder.svg"}
              alt="Hamro eShop Logo"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200 group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Search & Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            {/* Category Dropdown */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  router.push(`/all-products?category=${encodeURIComponent(e.target.value)}`)
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer bg-white"
              defaultValue=""
            >
              <option value="">Categories</option>
              <option value="Men's Fashion">Men's Fashion</option>
              <option value="Women's Fashion">Women's Fashion</option>
              <option value="Electronic Devices">Electronics</option>
              <option value="Home & Lifestyle">Home & Lifestyle</option>
              <option value="Sports & Outdoor">Sports & Outdoor</option>
            </select>

            {/* Seller Dashboard */}
            {isSeller && (
              <button
                onClick={() => router.push("/seller")}
                className="px-4 py-2 text-sm font-medium text-orange-600 border border-orange-600 rounded-full hover:bg-orange-50 transition-colors"
              >
                Seller Dashboard
              </button>
            )}

            {/* User Account */}
            {user ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push("/")} />
                  <UserButton.Action
                    label="Products"
                    labelIcon={<BoxIcon />}
                    onClick={() => router.push("/all-products")}
                  />
                  <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} />
                  <UserButton.Action
                    label="My Orders"
                    labelIcon={<ShoppingBag />}
                    onClick={() => router.push("/my-orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  openSignIn()
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors font-medium"
              >
                <Image src={assets.user_icon || "/placeholder.svg"} alt="user icon" className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-orange-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-orange-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {user ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} />
                  <UserButton.Action
                    label="My Orders"
                    labelIcon={<ShoppingBag />}
                    onClick={() => router.push("/my-orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  openSignIn()
                }}
                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Image src={assets.user_icon || "/placeholder.svg"} alt="user icon" className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            {navLinks.map(({ href, label }) => (
              <button
                key={href}
                onClick={() => handleMobileNavigation(href)}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                {label}
              </button>
            ))}

            {user && (
              <>
                <button
                  onClick={() => handleMobileNavigation("/cart")}
                  className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Cart
                </button>
                <button
                  onClick={() => handleMobileNavigation("/my-orders")}
                  className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  My Orders
                </button>
              </>
            )}

            {isSeller && (
              <button
                onClick={() => handleMobileNavigation("/seller")}
                className="flex items-center gap-3 w-full px-4 py-3 text-orange-600 bg-orange-50 rounded-lg font-medium"
              >
                <BoxIcon className="w-5 h-5" />
                Seller Dashboard
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

