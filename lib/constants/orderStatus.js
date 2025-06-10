export const ORDER_STATUS = {
    PLACED: 'Order Placed',
    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
};

export const ORDER_STATUS_COLORS = {
    [ORDER_STATUS.PLACED]: 'bg-blue-100 text-blue-800',
    [ORDER_STATUS.CONFIRMED]: 'bg-purple-100 text-purple-800',
    [ORDER_STATUS.PROCESSING]: 'bg-yellow-100 text-yellow-800',
    [ORDER_STATUS.SHIPPED]: 'bg-indigo-100 text-indigo-800',
    [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
    [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
};
