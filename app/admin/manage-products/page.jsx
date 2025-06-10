'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import PopularProductManager from '@/components/PopularProductManager';

const ManageProducts = () => {
  const { getToken } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state for editing
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [shippingFee, setShippingFee] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [files, setFiles] = useState([]);
  const [isPopular, setIsPopular] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [stock, setStock] = useState('');
  const [warrantyDuration, setWarrantyDuration] = useState('');
  const [returnPeriod, setReturnPeriod] = useState('');
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await axios.get('/api/product/all', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect with proper cleanup
  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        await fetchProducts();
      } catch (error) {
        if (mounted) {
          console.error('Error loading products:', error);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  

  // Handle delete product
  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/product/delete?id=${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message);
        // Refresh product list
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  // Handle edit product
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setName(product.name);
    setDescription(product.description);
    setCategory(product.category);
    setPrice(product.price);
    setOfferPrice(product.offerPrice);
    setShippingFee(product.shippingFee);
    setDeliveryCharge(product.deliveryCharge);
    setSellerName(product.sellerName);
    setBrand(product.brand);
    setColor(product.color);
    setFiles([]);
    setIsPopular(product.isPopular || false);
    setDeliveryDate(product.deliveryDate || '');
    setStock(product.stock?.toString() || '');
    setWarrantyDuration(product.warrantyDuration || '');
    setReturnPeriod(product.returnPeriod || '');
    setIsEditing(true);
  };

  // Handle update product
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productId', selectedProduct._id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);
    formData.append('shippingFee', shippingFee);
    formData.append('deliveryCharge', deliveryCharge);
    formData.append('sellerName', sellerName);
    formData.append('brand', brand);
    formData.append('color', color);
    formData.append('isPopular', isPopular.toString());
    formData.append('deliveryDate', deliveryDate);
    formData.append('stock', stock);
    formData.append('warrantyDuration', warrantyDuration);
    formData.append('returnPeriod', returnPeriod);

    // Add images if any
    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        formData.append('images', files[i]);
      }
    }

    try {
      const token = await getToken();
      // Send the update request with proper headers
      const { data } = await axios.put('/api/product/update', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (data.success) {
        toast.success(data.message);
        setIsEditing(false);
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Failed to update product. Please check your seller permissions."
      );
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const togglePopular = async (productId, currentStatus) => {
    try {
      const token = await getToken();
      const response = await axios.put('/api/product/set-popular', 
        { 
          productId, 
          isPopular: !currentStatus 
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        fetchProducts(); // Refresh product list
      }
    } catch (error) {
      console.error('Toggle popular error:', error);
      toast.error('Failed to update popular status');
    }
  };

  return (
    <div className="flex-1 min-h-screen p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage All Products</h1>
        <p className="text-sm text-gray-600">As a seller, you can view and manage all products</p>
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <p className="text-base font-medium">Product Images</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {/* Current product images */}
                {selectedProduct.images && selectedProduct.images.map((img, idx) => (
                  <div key={`current-${idx}`} className="relative">
                    <Image
                      src={img}
                      alt={`Product image ${idx + 1}`}
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                  </div>
                ))}

                {/* New image upload options */}
                {[...Array(4)].map((_, index) => (
                  <label key={index} htmlFor={`edit-image-${index}`} className="cursor-pointer">
                    <input
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        updatedFiles[index] = e.target.files[0];
                        setFiles(updatedFiles);
                      }}
                      type="file"
                      id={`edit-image-${index}`}
                      hidden
                    />
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-500">
                      {files[index] ? (
                        <Image
                          src={URL.createObjectURL(files[index])}
                          alt=""
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <span>+ Add</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload new images to replace existing ones</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-product-name">
                  Product Name
                </label>
                <input
                  id="edit-product-name"
                  type="text"
                  placeholder="Type here"
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-seller-name">
                  Seller Name
                </label>
                <input
                  id="edit-seller-name"
                  type="text"
                  placeholder="Type here"
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" htmlFor="edit-product-description">
                Product Description
              </label>
              <textarea
                id="edit-product-description"
                rows={4}
                className="outline-none py-2.5 px-3 rounded border border-gray-500/40 resize-none"
                placeholder="Type here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-category">
                  Category
                </label>
                <select
                  id="edit-category"
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
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
                  <option value="Gifts & Decorations">Gifts & Decorations</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-brand">
                  Brand
                </label>
                <input
                  id="edit-brand"
                  type="text"
                  placeholder="Type here"
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-color">
                  Color
                </label>
                <input
                  id="edit-color"
                  type="text"
                  placeholder="Type here"
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-price">
                  Price
                </label>
                <input
                  id="edit-price"
                  type="number"
                  placeholder="0"
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-offer-price">
                  Offer Price
                </label>
                <input
                  id="edit-offer-price"
                  type="number"
                  placeholder="0"
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-shipping-fee">
                  Shipping Fee
                </label>
                <input
                  id="edit-shipping-fee"
                  type="number"
                  placeholder="0"
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-delivery-charge">
                  Delivery Charge
                </label>
                <input
                  id="edit-delivery-charge"
                  type="number"
                  placeholder="0"
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-delivery-date">
                  Delivery Date
                </label>
                <input
                  id="edit-delivery-date"
                  type="text"
                  placeholder="e.g. 7-10 days, 2 weeks, etc."
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-stock">
                  Available Stock
                </label>
                <input
                  id="edit-stock"
                  type="number"
                  min="0"
                  placeholder="Number of items in stock"
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
                <span className="text-xs text-gray-500 mt-1">Set to 0 for out of stock items</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-warranty">
                  Warranty Duration
                </label>
                <input
                  id="edit-warranty"
                  type="text"
                  pattern="^(\d+\s*(year|month|day)s?)$"
                  placeholder="e.g. 1 year, 6 months, 30 days"
                  title="Please enter duration like: 1 year, 6 months, or 30 days"
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={warrantyDuration}
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase().trim();
                    setWarrantyDuration(val);
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-return">
                  Return Period
                </label>
                <input
                  id="edit-return"
                  type="text"
                  pattern="^(\d+\s*(day)s?)$"
                  placeholder="e.g. 7 days, 30 days"
                  title="Please enter period in days like: 7 days, 30 days"
                  className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                  value={returnPeriod}
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase().trim();
                    setReturnPeriod(val);
                  }}
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  id="edit-is-popular"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                />
                <label className="text-base font-medium" htmlFor="edit-is-popular">
                  Mark as Popular Product
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Update Product
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
              <p className="text-gray-600 mb-4">You haven't added any products yet.</p>
              <Link 
                href="/seller" 
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 relative">
                    <Image
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-1">{product.category}</p>
                    <div className="flex gap-2 text-sm text-gray-600 mb-2">
                      <span>{product.brand}</span>
                      {product.color && <span>• {product.color}</span>}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold">${product.offerPrice}</span>
                        {product.offerPrice < product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">${product.price}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 mb-3">
                      {product.isPopular && (
                        <span className="text-sm text-blue-600 font-medium">
                          ⭐ Popular Product
                        </span>
                      )}
                      {product.stock !== undefined && (
                        <span className={`text-sm ${product.stock > 0 
                          ? product.stock <= 5 
                            ? 'text-orange-600' 
                            : 'text-green-600' 
                          : 'text-red-600'}`}>
                          {product.stock > 0 
                            ? product.stock <= 5 
                              ? `Only ${product.stock} left in stock` 
                              : `${product.stock} in stock` 
                            : 'Out of stock'}
                        </span>
                      )}
                      {product.warrantyDuration && (
                        <span className="text-sm text-gray-600">
                          Warranty: {product.warrantyDuration}
                        </span>
                      )}
                      {product.returnPeriod && (
                        <span className="text-sm text-gray-600">
                          Returns: {product.returnPeriod}
                        </span>
                      )}
                      {product.deliveryDate && (
                        <span className="text-sm text-gray-600">
                          Delivery: {product.deliveryDate}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <Pencil size={16} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="flex items-center text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </button>
                      </div>
                      <PopularProductManager product={product} />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => togglePopular(product._id, product.isPopular)}
                        className={`px-3 py-1 rounded text-sm ${
                            product.isPopular 
                                ? 'bg-orange-100 text-orange-600' 
                                : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {product.isPopular ? '★ Popular' : '☆ Mark Popular'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageProducts;
