"use client";

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaBox, FaClock, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
import orderApi from '@/api/orders';
import { formatImageUrl } from '@/helpers/url';
import { toast } from 'react-toastify';
import PayViaKhalti from './_components/PayViaKhalti';

const OrdersPage = () => {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') || 'pending';
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // COD Modal State
  const [codModalOpen, setCodModalOpen] = useState(false);
  const [activeCodOrder, setActiveCodOrder] = useState(null);
  const [codForm, setCodForm] = useState({ phone: '', email: '', address: '' });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi.getOrdersByUser({ status: statusFilter });
        setOrders(response.data);
      } catch (error) {
        console.error("Fetch orders failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, statusFilter]);

  const openCodModal = (order) => {
    setActiveCodOrder(order);
    setCodForm({ 
       phone: order.userid?.phone || '', 
       email: order.userid?.email || '', 
       address: order.shippingAddress?.street || '' 
    });
    setCodModalOpen(true);
  };

  const handleCODSubmit = async (e) => {
    e.preventDefault();
    try {
      await orderApi.markAsCOD(activeCodOrder._id, codForm);
      toast.success("Order set to Cash on Delivery!");
      setOrders(orders.filter(o => o._id !== activeCodOrder._id)); // removes from 'pending' tab visually
      setCodModalOpen(false);
    } catch (e) {
      toast.error(e?.response?.data || "Failed to select COD");
    }
  };

  const handleCancel = async (orderId) => {
    if(!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await orderApi.cancelOrder(orderId);
      toast.success("Order cancelled securely.");
      setOrders(orders.filter(o => o._id !== orderId)); // removes from 'pending' tab visually
    } catch (e) {
      toast.error(e?.response?.data || "Failed to cancel order");
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'confirmed': return <FaCheckCircle className="text-blue-500" />;
      case 'shipped': return <FaTruck className="text-purple-500" />;
      case 'delivered': return <FaCheckCircle className="text-green-500" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      default: return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!mounted) return (
    <div className="container mx-auto py-20 px-4 max-w-5xl text-center">
      <div className="animate-pulse bg-gray-100 h-10 w-48 mx-auto rounded-full mb-8"></div>
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-50 h-32 w-full rounded-3xl"></div>
        <div className="animate-pulse bg-gray-50 h-32 w-full rounded-3xl"></div>
      </div>
    </div>
  );

  if (!isAuthenticated) return <div className="p-20 text-center font-bold">Please login to view orders.</div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-4xl font-semibold text-black mb-8 tracking-tight">My Orders</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => router.push(`/orders?status=${status}`)}
            className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition whitespace-nowrap ${
              statusFilter === status ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 hover:border-purple-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white h-40 rounded-3xl border border-gray-100"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <FaBox className="mx-auto text-gray-200 text-6xl mb-4" />
          <h2 className="text-xl font-bold text-gray-800">No orders found for this status.</h2>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 border-b border-gray-50 pb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
                  <p className="text-sm font-mono font-bold text-purple-600 truncate max-w-[200px]">{order.orderNumber}</p>
                </div>
                <div className="flex gap-4 items-center">
                   <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${getStatusClass(order.status)}`}>
                     {getStatusIcon(order.status)}
                     <span className="capitalize">{order.status}</span>
                   </div>
                   <p className="text-sm font-bold text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                {order.orderItems.map((item, idx) => {
                  const art = item.artId || {};
                  return (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                      <div className="h-12 w-12 relative rounded-lg overflow-hidden border border-white">
                        <img
                          src={formatImageUrl(art.imageUrls?.[0] || art.image)}
                          alt={art.title}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">{art.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center bg-purple-50 p-4 rounded-2xl flex-col sm:flex-row gap-4 sm:gap-0 mt-4">
                 <div className="text-center sm:text-left">
                    <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest">Total Value</p>
                    <p className="text-xl font-semibold text-purple-600">Rs. {order.totalPrice.toLocaleString()}</p>
                 </div>
                 
                 {order.status === 'pending' ? (
                   <div className="flex flex-wrap gap-2 justify-center">
                     <PayViaKhalti order={order} />
                     <button
                       onClick={() => openCodModal(order)}
                       className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-green-700 transition"
                     >
                       Cash on Delivery
                     </button>
                     <button
                       onClick={() => handleCancel(order._id)}
                       className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold border border-red-200 hover:bg-red-100 transition"
                     >
                       Cancel
                     </button>
                   </div>
                 ) : (
                   <button className="bg-white text-purple-600 px-6 py-2 rounded-xl text-sm font-semibold shadow-sm border border-purple-100 hover:bg-purple-600 hover:text-white transition">
                     Track Order
                   </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COD Configuration Modal */}
      {codModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#160327] rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
             <h2 className="text-xl font-bold mb-4 dark:text-white">Delivery Details</h2>
             <p className="text-sm text-gray-500 mb-6">Before confirming Cash On Delivery, please verify your contact and delivery location.</p>
             <form onSubmit={handleCODSubmit} className="space-y-4">
                <div>
                   <label className="block text-xs font-semibold text-gray-600 dark:text-purple-300 mb-1">Phone Number</label>
                   <input type="tel" required value={codForm.phone} onChange={(e) => setCodForm({...codForm, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 dark:bg-[#20053a] dark:border-purple-800 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-purple-500" placeholder="Enter Phone Number" />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-600 dark:text-purple-300 mb-1">Email Address</label>
                   <input type="email" required value={codForm.email} onChange={(e) => setCodForm({...codForm, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 dark:bg-[#20053a] dark:border-purple-800 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-purple-500" placeholder="Enter Email Address" />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-600 dark:text-purple-300 mb-1">Detailed Delivery Address</label>
                   <textarea required value={codForm.address} onChange={(e) => setCodForm({...codForm, address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 dark:bg-[#20053a] dark:border-purple-800 dark:text-white rounded-xl px-4 py-2 text-sm h-24 resize-none focus:outline-purple-500" placeholder="Street, landmark, etc."></textarea>
                </div>
                
                <div className="flex justify-end gap-3 mt-8">
                   <button type="button" onClick={() => setCodModalOpen(false)} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
                   <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition shadow-md">Confirm Delivery</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;