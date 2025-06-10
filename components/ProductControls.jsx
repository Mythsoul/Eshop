import React from 'react';
import { Pencil, Trash2, Star } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ProductControls = ({ 
    productId, 
    isAdmin,
    isSeller,
    sellerId,
    isPopular,
    userId,
    getToken,
    onProductUpdate 
}) => {
    const router = useRouter();
    const canManage = isAdmin || (isSeller && sellerId === userId);

    const handleTogglePopular = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.post(
                '/api/product/popular/manage',
                { 
                    productId,
                    action: isPopular ? 'remove' : 'add'
                },
                { headers: { Authorization: `Bearer ${token}` }}
            );

            if (data.success) {
                toast.success(data.message);
                if (onProductUpdate) onProductUpdate();
            }
        } catch (error) {
            toast.error('Failed to update popular status');
            console.error('Toggle popular error:', error);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = await getToken();
            const { data } = await axios.delete(`/api/product/delete?id=${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success('Product deleted successfully');
                router.push('/all-products');
            }
        } catch (error) {
            toast.error('Failed to delete product');
            console.error('Delete error:', error);
        }
    };

    const handleEdit = () => {
        const route = isAdmin ? '/admin' : '/seller';
        router.push(`${route}/manage-products?edit=${productId}`);
    };

    if (!canManage && !isAdmin) return null;

    return (
        <div className="flex justify-end gap-2 mb-4">
            {isAdmin && (
                <button
                    onClick={handleTogglePopular}
                    className={`flex items-center gap-2 px-4 py-2 rounded ${
                        isPopular 
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    <Star className="w-4 h-4" />
                    {isPopular ? 'Remove Popular' : 'Set Popular'}
                </button>
            )}
            {canManage && (
                <>
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </>
            )}
        </div>
    );
};

export default ProductControls;
