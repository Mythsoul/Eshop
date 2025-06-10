'use client';
import React from 'react';
import { Home, ShoppingCart, ClipboardList, Grid } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileNavBar = () => {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-around items-center py-2 z-50 md:hidden">
      <Link href="/" className={`flex flex-col items-center ${isActive('/') ? 'text-blue-500' : 'text-gray-600'}`}>
        <Home size={24} />
        <span className="text-xs">Home</span>
      </Link>

      <Link href="/cart" className={`flex flex-col items-center ${isActive('/cart') ? 'text-blue-500' : 'text-gray-600'}`}>
        <ShoppingCart size={24} />
        <span className="text-xs">Cart</span>
      </Link>

      <Link href="/my-orders" className={`flex flex-col items-center ${isActive('/orders') ? 'text-blue-500' : 'text-gray-600'}`}>
        <ClipboardList size={24} />
        <span className="text-xs">My Orders</span>
      </Link>

      <Link href="/all-products" className={`flex flex-col items-center ${isActive('/products') ? 'text-blue-500' : 'text-gray-600'}`}>
        <Grid size={24} />
        <span className="text-xs">All Products</span>
      </Link>
    </div>
  );
};

export default MobileNavBar;
