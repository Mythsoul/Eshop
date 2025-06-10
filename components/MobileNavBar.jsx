"use client"
import { Home, ShoppingCart, ClipboardList, Grid } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const MobileNavBar = () => {
  const pathname = usePathname()

  const isActive = (path) => pathname === path

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/cart", icon: ShoppingCart, label: "Cart" },
    { href: "/my-orders", icon: ClipboardList, label: "Orders" },
    { href: "/all-products", icon: Grid, label: "Products" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                active
                  ? "text-orange-600 bg-orange-50 scale-105"
                  : "text-gray-600 hover:text-orange-500 hover:bg-gray-50"
              }`}
            >
              <div className={`p-1 rounded-lg transition-all duration-200 ${active ? "bg-orange-100" : ""}`}>
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span
                className={`text-xs mt-1 font-medium transition-all duration-200 ${
                  active ? "text-orange-600" : "text-gray-600"
                }`}
              >
                {label}
              </span>
              {active && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-600 rounded-full"></div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default MobileNavBar

