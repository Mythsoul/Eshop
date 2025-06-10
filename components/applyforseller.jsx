import { useAuth } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function ApplyForSeller() {
    const { getToken } = useAuth();
    const { user, isSeller } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // If user is admin or seller, don't show the button
    if (!user || isSeller || user?.publicMetadata?.role?.includes('admin')) {
        return null;
    }

    const apply = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();
            const response = await axios.post("/api/user/setseller", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                // Refresh the page to update user roles
                window.location.reload();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
            setShowModal(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-sm font-medium text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors duration-200 flex items-center gap-2"
            >
                Become a Seller
            </button>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-2">Become a Seller</h3>
                        <p className="text-gray-600 mb-4">
                            Apply to become a seller and start selling your products on our platform.
                            You'll get access to the seller dashboard and tools to manage your products.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={apply}
                                disabled={isLoading}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Applying...
                                    </>
                                ) : (
                                    'Apply Now'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}