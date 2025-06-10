'use client'
import React, { useState, useEffect } from 'react';
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSearchParams } from 'next/navigation';
import Loading from "@/components/Loading";
import axios from 'axios';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 20
    });
    
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Include search and category params if they exist
                const params = new URLSearchParams();
                if (searchQuery) params.append('search', searchQuery);
                if (categoryFilter) params.append('category', categoryFilter);
                params.append('page', page);
                params.append('limit', pagination.limit);
                
                const { data } = await axios.get(`/api/product/list?${params}`);
                
                if (data.success) {
                    setProducts(data.products);
                    setPagination(data.pagination);
                } else {
                    setError(data.message || 'Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error.message || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery, categoryFilter, page]);

    // Function to generate page numbers array
    const getPageNumbers = () => {
        const pageNumbers = [];
        const totalPages = pagination.totalPages;
        const currentPage = pagination.currentPage;
        
        // Show max 5 page numbers
        let startPage = Math.max(currentPage - 2, 1);
        let endPage = Math.min(startPage + 4, totalPages);
        
        // Adjust startPage if we're near the end
        if (endPage - startPage < 4) {
            startPage = Math.max(endPage - 4, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    };

    // Function to handle page changes
    const handlePageChange = (newPage) => {
        const url = new URL(window.location);
        url.searchParams.set('page', newPage);
        window.history.pushState({}, '', url);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // The useEffect will handle fetching new data
    };

    const getPageTitle = () => {
        if (categoryFilter) return `Category: ${categoryFilter}`;
        if (searchQuery) return `Search Results for "${searchQuery}"`;
        return "All Products";
    };

    if (loading) return (
        <>
            <Navbar />
            <div className="min-h-screen">
                <Loading />
            </div>
            <Footer />
        </>
    );

    if (error) {
        console.error('Error in AllProducts:', error);
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-red-500">Failed to load products. Please try again later.</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col">
                <div className="flex-1 px-6 md:px-16 lg:px-32">
                    <div className="flex flex-col items-end pt-12">
                        <p className="text-2xl font-medium">{getPageTitle()}</p>
                        <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                        <p className="text-sm text-gray-500 mt-2">
                            {products.length} {products.length === 1 ? 'product' : 'products'} found
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                        {products.length === 0 && (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                {categoryFilter ? 
                                    `No products found in category "${categoryFilter}"` :
                                    searchQuery ? 
                                        `No products found matching "${searchQuery}"` :
                                        "No products available"
                                }
                            </div>
                        )}
                    </div>
                    
                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 py-8">
                            {/* Previous button */}
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className={`px-3 py-1 rounded ${
                                    pagination.currentPage === 1
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-orange-600 text-white hover:bg-orange-700'
                                }`}
                            >
                                Previous
                            </button>
                            
                            {/* Page numbers */}
                            {getPageNumbers().map(pageNum => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-1 rounded ${
                                        pageNum === pagination.currentPage
                                            ? 'bg-orange-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                            
                            {/* Next button */}
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className={`px-3 py-1 rounded ${
                                    pagination.currentPage === pagination.totalPages
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-orange-600 text-white hover:bg-orange-700'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default AllProducts;
