'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { ListFilter } from "lucide-react";

const AddProduct = () => {
  
  const { getToken } = useAppContext()

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronic Devices');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [shippingFee, setShippingFee] = useState('0');
  const [deliveryCharge, setDeliveryCharge] = useState('0');
  const [sellerName, setSellerName] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [stock, setStock] = useState('');
  const [warrantyDuration, setWarrantyDuration] = useState('');
  const [returnPeriod, setReturnPeriod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData()

      formData.append('name',name)
      formData.append('description',description)
      formData.append('category',category)
      formData.append('price',price)
      formData.append('offerPrice',offerPrice)
      formData.append('shippingFee',shippingFee)
      formData.append('deliveryCharge',deliveryCharge)
      formData.append('sellerName',sellerName)
      formData.append('brand', brand || '')
      formData.append('color', color || '')
      formData.append('isPopular' , false)
      formData.append('deliveryDate', deliveryDate || '')
      formData.append('stock', stock || '0')
      formData.append('warrantyDuration', warrantyDuration || '')
      formData.append('returnPeriod', returnPeriod || '')

      for (let i = 0; i < files.length; i++) {
        formData.append('images',files[i])
      }

      const token = await getToken()
      const { data } = await axios.post('/api/product/add',formData,{
        headers:{Authorization: `Bearer ${token}`}
      })

      if(data.success){
        toast.success(data.message)
        // Reset form
        setFiles([]);
        setName('');
        setDescription('');
        setCategory('Electronic Devices');
        setPrice('');
        setOfferPrice('');
        setShippingFee('0');
        setDeliveryCharge('0');
        setSellerName('');
        setBrand('');
        setColor('');
        setIsPopular(false);
        setDeliveryDate('');
        setStock('');
        setWarrantyDuration('');
        setReturnPeriod('');
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="p-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-semibold">Seller Dashboard</h1>
        <Link href="/seller/product-list" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          {/* @ts-ignore */}
          <ListFilter size={18} className="mr-2" />
          Manage Products
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}

          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
            >
              <option value="Motors, Tools & DIY">Motors, Tools & DIY</option>
              <option value="Home & Lifestyle">Home & Lifestyle</option>
              <option value="Sports & Outdoor">Sports & Outdoor</option>
              <option value="Electronic Accessories">Electronic Accessories</option>
              <option value="Groceries & Pets">Groceries & Pets</option>
              <option value="Electronic Devices">Electronic Devices</option>
              <option value="Men's Fashion">Men's Fashion</option>
              <option value="Watches & Accessories">Watches & Accessories</option>
              <option value="Women's Fashion">Women's Fashion</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Babies & Toys">Babies & Toys</option>
              <option value="Clothing & Accessories">Clothing & Accessories</option>
              <option value="Sports & Outdoor Play">Sports & Outdoor Play</option>
              <option value="Gifts & Decorations">Gifts & Decorations</option>
              <option value="Nursery">Nursery</option>
              <option value="Disposable Diapers">Disposable Diapers</option>
              <option value="Diapering & Potty">Diapering & Potty</option>
              <option value="Pacifiers & Accessories">Pacifiers & Accessories</option>
              <option value="Feeding">Feeding</option>
              <option value="Remote Control & Vehicles">Remote Control & Vehicles</option>
              <option value="Baby Gear">Baby Gear</option>
              <option value="Baby & Toddler Toys">Baby & Toddler Toys</option>
              <option value="Toys & Games">Toys & Games</option>
              <option value="Baby Personal Care">Baby Personal Care</option>
              <option value="Soaps, Cleansers & Bodywash">Soaps, Cleansers & Bodywash</option>
              <option value="Baby Bath">Baby Bath</option>
              <option value="Bathing Tubs & Seats">Bathing Tubs & Seats</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="shipping-fee">
              Shipping Fee
            </label>
            <input
              id="shipping-fee"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setShippingFee(e.target.value)}
              value={shippingFee}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="delivery-charge">
              Delivery Charge
            </label>
            <input
              id="delivery-charge"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setDeliveryCharge(e.target.value)}
              value={deliveryCharge}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full mb-4">
          <label className="text-base font-medium" htmlFor="seller-name">
            Seller Name
          </label>
          <input
            id="seller-name"
            type="text"
            placeholder="Enter your store or business name"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setSellerName(e.target.value)}
            value={sellerName}
            required
          />
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col gap-1 w-48">
            <label className="text-base font-medium" htmlFor="brand">
              Brand
            </label>
            <input
              id="brand"
              type="text"
              placeholder="Enter brand name"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setBrand(e.target.value)}
              value={brand}
              required
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1 w-48">
            <label className="text-base font-medium" htmlFor="color">
              Color
            </label>
            <input
              id="color"
              type="text"
              placeholder="Enter product color"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setColor(e.target.value)}
              value={color}
              required
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-base font-medium" htmlFor="delivery-date">
              Delivery Date
            </label>
            <input
              id="delivery-date"
              type="text"
              placeholder="e.g. 7-10 days, 2 weeks, etc."
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setDeliveryDate(e.target.value)}
              value={deliveryDate}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-base font-medium" htmlFor="stock">
                Available Stock
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                placeholder="Number of items in stock"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setStock(e.target.value)}
                value={stock}
                required
              />
              <span className="text-xs text-gray-500 mt-1">Set to 0 for out of stock items</span>
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-base font-medium" htmlFor="warranty">
                Warranty Duration
              </label>
              <input
                id="warranty"
                type="text"
                pattern="^(\d+\s*(year|month|day)s?)$"
                placeholder="e.g. 1 year, 6 months, 30 days"
                title="Please enter duration like: 1 year, 6 months, or 30 days"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().trim();
                  setWarrantyDuration(val);
                }}
                value={warrantyDuration}
              />
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-base font-medium" htmlFor="return">
                Return Period
              </label>
              <input
                id="return"
                type="text"
                pattern="^(\d+\s*(day)s?)$"
                placeholder="e.g. 7 days, 30 days"
                title="Please enter period in days like: 7 days, 30 days"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().trim();
                  setReturnPeriod(val);
                }}
                value={returnPeriod}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? 'Adding...' : 'ADD'}
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;