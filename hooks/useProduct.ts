import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const cache = new Map();
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export function useProduct(productId: string) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProduct = useCallback(async () => {
        // Check cache first
        const cached = cache.get(productId);
        if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
            setProduct(cached.data);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`/api/product/${productId}`);
            
            if (data.success) {
                // Update cache
                cache.set(productId, {
                    data: data.product,
                    timestamp: Date.now()
                });
                setProduct(data.product);
            } else {
                setError(data.message || 'Failed to load product');
                toast.error(data.message || 'Failed to load product');
            }
        } catch (err) {
            setError(err.message || 'Error loading product');
            toast.error('Failed to load product details');
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const invalidateCache = useCallback(() => {
        cache.delete(productId);
        fetchProduct();
    }, [productId, fetchProduct]);

    return {
        product,
        loading,
        error,
        invalidateCache
    };
}
