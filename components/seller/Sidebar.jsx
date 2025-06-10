"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, ShoppingBag, Plus, BarChart3, Settings, ChevronLeft, ChevronRight, Store } from "lucide-react"
import React from "react"
const Sidebar = () => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      name: "Add Product",
      path: "/seller",
      icon: Plus,
      description: "Create new products",
    },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: Package,
      description: "Manage your inventory",
    },
    {
      name: "Orders",
      path: "/seller/orders",
      icon: ShoppingBag,
      description: "Track customer orders",
    },

  ]

  return (
    <div
      className={`${isCollapsed ? "w-20" : "w-72"} transition-all duration-300 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Seller Hub</h2>
                <p className="text-xs text-gray-500">Manage your store</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          const IconComponent = item.icon

          return (
            <Link href={item.path} key={item.name}>
              <div
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}

                <IconComponent
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? "text-white" : "text-gray-500 group-hover:text-orange-600"
                  }`}
                />

                {!isCollapsed && (
                  <div className="flex-1">
                    <p className={`font-medium ${isActive ? "text-white" : "text-gray-900"}`}>{item.name}</p>
                    <p className={`text-xs ${isActive ? "text-orange-100" : "text-gray-500"}`}>{item.description}</p>
                  </div>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
            
         
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
