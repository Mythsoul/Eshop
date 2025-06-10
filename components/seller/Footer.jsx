"use client"

import { assets } from "@/assets/assets"
import Image from "next/image"
import { Heart, ExternalLink } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: "Facebook", icon: assets.facebook_icon, href: "#" },
    { name: "Twitter", icon: assets.twitter_icon, href: "#" },
    { name: "Instagram", icon: assets.instagram_icon, href: "#" },
  ]

  const quickLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Seller Guidelines", href: "/guidelines" },
  
    { name: "Contact Support", href: "/support" },
  ]

  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Brand Section */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <Image
              className="w-28 hover:opacity-80 transition-opacity cursor-pointer"
              src={assets.logo || "/placeholder.svg"}
              alt="logo"
            />
            <div className="hidden lg:block w-px h-12 bg-gray-300"></div>
            <div>
              <p className="text-gray-700 font-medium mb-1">Seller Dashboard</p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> for sellers
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-6">
            {quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-1 group"
              >
                {link.name}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 mr-2">Follow us:</span>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="p-2 bg-white hover:bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                aria-label={social.name}
              >
                <Image src={social.icon || "/placeholder.svg"} alt={`${social.name} icon`} width={16} height={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Copyright {currentYear} © QuickCart Seller Hub. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="/privacy" className="hover:text-orange-600 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-orange-600 transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="hover:text-orange-600 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
