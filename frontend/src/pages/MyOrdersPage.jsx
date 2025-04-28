import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../redux/slices/orderSlice';

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);
    const { user, token } = useSelector((state) => state.auth);

    useEffect(() => {
        // Check authentication before fetching orders
        if (!user || !token) {
            navigate('/login', { 
                state: { from: '/profile' },
                replace: true 
            });
            return;
        }

        dispatch(fetchUserOrders());
    }, [dispatch, navigate, user, token]);

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`);
    }

    // Show loading state
    if (loading) {
        return (
            <div className='min-h-[400px] flex items-center justify-center'>
                <div className='text-center text-gray-600'>Loading orders...</div>
            </div>
        );
    }

    // Show error state with login redirect
    if (error) {
        return (
            <div className='min-h-[400px] flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-red-500 mb-4'>{error}</p>
                    {(!user || !token) && (
                        <button 
                            onClick={() => navigate('/login')}
                            className='text-[var(--srh-orange)] hover:underline'
                        >
                            Click here to login
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto p-4 sm:p-6'>
            <h2 className='text-xl sm:text-2xl font-bold mb-6'>My Orders</h2>
            <div className='relative shadow-md sm:rounded-lg overflow-hidden'>
                <table className='w-full text-left text-gray-500'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='px-6 py-3'>Image</th>
                            <th className='px-6 py-3'>Order ID</th>
                            <th className='px-6 py-3'>Date</th>
                            <th className='px-6 py-3'>Shipping Address</th>
                            <th className='px-6 py-3'>Items</th>
                            <th className='px-6 py-3'>Price</th>
                            <th className='px-6 py-3'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr 
                                key={order._id}
                                onClick={() => handleRowClick(order._id)} 
                                className='border-b hover:bg-gray-50 cursor-pointer'>
                                    <td className='px-6 py-4'>
                                        <img 
                                            src={order.orderItems[0].image} 
                                            alt={order.orderItems[0].name} 
                                            className='w-10 h-10 object-cover rounded-lg' 
                                        />
                                    </td>
                                    <td className='px-6 py-4 font-medium text-gray-900'>
                                        #{order._id}
                                    </td>
                                    <td className='px-6 py-4'>
                                        {new Date(order.createdAt).toLocaleDateString()}{" "}
                                        {new Date(order.createdAt).toLocaleTimeString()}
                                    </td>
                                    <td className='px-6 py-4'>
                                        {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.country}` : "N/A"}
                                    </td>
                                    <td className='px-6 py-4'>
                                        {order.orderItems.length}
                                    </td>
                                    <td className='px-6 py-4'>
                                        ${order.totalPrice.toFixed(2)}
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span className={`${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded-full text-xs font-medium`}>
                                            {order.isPaid ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className='px-6 py-4 text-center text-gray-500'>
                                    No orders found. You have no orders yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyOrdersPage;