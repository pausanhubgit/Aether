"use client";

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaPhone, FaMapPin, FaEnvelope, FaCreditCard } from 'react-icons/fa';
import { clearCart } from '@/lib/slices/cartSlice';
import orderAPI from '@/api/order';
import { ToastContainer, toast } from 'react-toastify';

function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items = [], total = 0 } = useSelector(state => state.cart || {});
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('khalti');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    postalCode: '',
  });

  const taxAmount = total * 0.1;
  const finalTotal = total + taxAmount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          productId: item.id || item._id,
          productType: item.type || 'art',
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone,
        paymentMethod: paymentMethod,
        totalAmount: finalTotal,
      };

      const response = await orderAPI.createOrder(orderData);
      
      toast.success('Order securely saved! Please complete your payment.');
      dispatch(clearCart());
      router.push(`/orders?status=pending`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const initializeKhaltiPayment = (orderData) => {
    // Khalti payment initialization
    if (window.KhaltiCheckout) {
      const checkout = new window.KhaltiCheckout({
        publicKey: process.env.NEXT_PUBLIC_KHALTI_KEY,
        productIdentity: orderData.orderId,
        productName: 'Order',
        productUrl: typeof window !== "undefined" ? window.location.href : "",
        eventHandler: {
          onSuccess: async (payload) => {
            try {
              await orderAPI.completePayment({
                orderId: orderData.orderId,
                paymentId: payload.token,
              });
              toast.success('Payment successful!');
              dispatch(clearCart());
              router.push(`/order-status/${orderData.orderId}`);
            } catch (error) {
              toast.error('Payment verification failed');
            }
          },
          onError: (error) => {
            toast.error('Payment failed: ' + error.message);
          },
        },
        amount: finalTotal * 100,
      });
      checkout.show();
    }
  };

  const initializeStripePayment = (orderData) => {
    // Stripe payment initialization
    toast.info('Redirecting to payment...');
    // Implementation depends on Stripe setup
  };

  if (items.length === 0) {
    return (
      <div className="py-10 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Checkout</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Your cart is empty</p>
        <a
          href="/arts"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleCheckout} className="space-y-6">
            {/* Billing Information */}
            <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Billing Information
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
                />
              </div>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white mb-4"
              />

              <div className="flex gap-2 items-center mb-4">
                <FaPhone className="text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
                />
              </div>

              <div className="flex gap-2 items-center mb-4">
                <FaMapPin className="text-gray-500" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street Address"
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
                />
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  required
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FaCreditCard /> Payment Method
              </h2>

              <div className="space-y-3">
                {[
                  { value: 'khalti', label: 'Khalti' },
                  { value: 'stripe', label: 'Stripe' },
                  { value: 'cod', label: 'Cash on Delivery' },
                ].map(method => (
                  <label key={method.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition font-bold text-lg"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg h-fit sticky top-20">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Order Summary</h2>

          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {items.map((item, index) => (
              <div key={item.id || index} className="flex justify-between pb-3 gap-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white truncate">
                    {item.title || item.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    x{item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-800 dark:text-white shrink-0">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <hr className="border-gray-300 dark:border-gray-600 my-4" />

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Subtotal:</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Tax (10%):</span>
              <span>Rs. {taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-white">
              <span>Total:</span>
              <span>Rs. {finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CheckoutPage;
