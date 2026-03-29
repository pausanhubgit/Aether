"use client";

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaCreditCard, FaLock, FaMapMarkerAlt, FaMobileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { clearCart } from '@/redux/cart/cartSlice';
import orderApi from '@/api/orders';

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    city: user?.city || '',
    Province: '',
    country: 'Nepal',
    street: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!shippingAddress.city || !shippingAddress.Province) {
      toast.error("Please fill in required address fields");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: items.map(item => ({
          artId: item.artId?._id || item._id,
          quantity: item.quantity || 1
        })),
        totalPrice: total,
        shippingAddress
      };

      const response = await orderApi.createOrder(orderData);
      const orderId = response.data.data?._id;

      toast.success("Order created! Redirecting to payment...");
      
      // Simulating selecting payment or going to khalti
      // In a real scenario, you'd call payViaKhalti(orderId)
      
      dispatch(clearCart());
      router.push(`/orders?status=pending`);
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <button onClick={() => router.push('/arts')} className="bg-purple-600 text-white px-6 py-2 rounded-lg">
          Browse Arts
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-semibold text-black mb-8">Checkout</h1>
      
      <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <FaMapMarkerAlt className="text-purple-600" /> Shipping Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                <input
                  type="text"
                  name="Province"
                  value={shippingAddress.Province}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <h2 className="text-xl font-bold flex items-center justify-center gap-2 mb-4">
              <FaCreditCard className="text-purple-600" /> Payment
            </h2>
            <p className="text-gray-500 mb-4">We currently support Cash on Delivery and Online Payment via Khalti.</p>
            <div className="flex justify-center gap-4">
               <div className="border-2 border-purple-600 p-4 rounded-xl flex flex-col items-center gap-2">
                 <FaMobileAlt size={24} className="text-purple-600" />
                 <span className="font-bold text-xs">Standard Billing</span>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 border-b border-white/10 pb-4">Order Summary</h2>
            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => {
                const art = item.artId || item;
                return (
                  <div key={art._id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <p className="font-bold text-sm truncate max-w-[150px]">{art.title}</p>
                      <p className="text-white/50 text-xs">Qty: {item.quantity || 1}</p>
                    </div>
                    <p className="font-semibold text-purple-400">Rs. {(art.price || 0).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-400 font-bold">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-2xl font-semibold pt-4">
                <span>Total</span>
                <span className="text-purple-400">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handleCheckout}
              className="w-full bg-white text-black mt-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition transform active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            <p className="flex items-center justify-center gap-2 text-white/40 text-xs mt-4">
              <FaLock size={10} /> Secure SSL Encrypted Checkout
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
