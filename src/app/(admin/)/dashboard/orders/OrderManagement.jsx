"use client";

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaBox, FaTruck, FaCheckCircle, FaClock, FaEye, FaDownload } from 'react-icons/fa';
import orderAPI from '@/api/order';
import { ToastContainer, toast } from 'react-toastify';

function OrderManagement() {
  const router = useRouter();
  const { user: currentUser } = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!currentUser || !['MERCHANT', 'ADMIN'].includes(currentUser.role)) {
      router.push('/');
      return;
    }
    fetchOrders();
  }, [currentUser, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let response;
      if (currentUser.role === 'ADMIN') {
        response = await orderAPI.getAllOrders();
      } else {
        response = await orderAPI.getMerchantOrders(currentUser.id);
      }
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDownloadInvoice = (orderId) => {
    // Implementation for invoice download
    toast.info('Invoice download functionality coming soon');
  };

  const filteredOrders = filterStatus === '' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  if (loading) {
    return (
      <div className="py-10 px-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
        <FaBox /> Order Management
      </h1>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white dark:bg-[#160327] rounded-lg shadow-lg mb-8">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-[#160327] border-b border-gray-300 dark:border-gray-600">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Order ID</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Customer</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Amount</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Date</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  <td className="px-6 py-4 text-gray-800 dark:text-white font-semibold">
                    #{order.id?.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {order.customerName || 'Guest'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.customerEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-white font-semibold">
                    Rs. {order.totalAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${
                        statusColors[order.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm"
                    >
                      <FaEye /> View
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 text-sm"
                    >
                      <FaDownload /> Invoice
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#160327] rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-red-500 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Order ID</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    #{selectedOrder.id?.substring(0, 12)}...
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Date</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mb-4">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>{item.productName} x{item.quantity}</span>
                      <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-white">
                  <span>Total</span>
                  <span>Rs. {selectedOrder.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Shipping Address</p>
                <p className="text-gray-800 dark:text-white">
                  {selectedOrder.shippingAddress}, {selectedOrder.city}, {selectedOrder.postalCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {orders.length}
              </p>
            </div>
            <FaBox className="text-4xl text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <FaClock className="text-4xl text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Shipped</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {orders.filter(o => o.status === 'shipped').length}
              </p>
            </div>
            <FaTruck className="text-4xl text-purple-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Delivered</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
            <FaCheckCircle className="text-4xl text-green-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;
