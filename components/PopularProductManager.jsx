import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import React from 'react';

export default function PopularProductManager({ product }) {
    const { getToken } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    const handlePopularStatus = async (action) => {
        try {
            setIsLoading(true);
            const token = await getToken();
            console.log(product);
            const response = await axios.post('/api/product/popular/manage', 
                { productId: product._id,
                 action : action },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                window.location.reload(); // Refresh to update UI
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update popular status');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {product.isPopular ? (
                <button
                    onClick={() => handlePopularStatus('remove')}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50"
                >
                    {isLoading ? 'Updating...' : 'Remove from Popular'}
                </button>
            ) : (
                <button
                    onClick={() => handlePopularStatus('add')}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded hover:bg-green-200 disabled:opacity-50"
                >
                    {isLoading ? 'Updating...' : 'Add to Popular'}
                </button>
            )}
        </div>
    );
}
