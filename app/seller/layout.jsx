"use client"

import Navbar from "@/components/seller/Navbar"
import Sidebar from "@/components/seller/Sidebar"
import { Toaster } from "react-hot-toast"

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#374151",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
          },
          success: {
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            },
            iconTheme: {
              primary: "#16a34a",
              secondary: "#f0fdf4",
            },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
            },
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fef2f2",
            },
          },
        }}
      />

      <Navbar />

      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-80px)] bg-white">{children}</main>
      </div>
    </div>
  )
}

export default Layout
