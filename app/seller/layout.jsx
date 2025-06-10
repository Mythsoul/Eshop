'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'
import { Toaster } from 'react-hot-toast'
const Layout = ({ children }) => {
  return (
    <div>
      <Toaster 
      position='top-right' 
      toastOptions={
        { 
          style : { 
            background : "red" , 
            color : "white"
            
          }
        }
      }/> 

      <Navbar />

      <div className='flex w-full'>
        <Sidebar />
        {children}
      </div>
    </div>
  )
}

export default Layout