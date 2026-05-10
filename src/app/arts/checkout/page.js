"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  FaCreditCard,
  FaLock,
  FaMapMarkerAlt,
  FaMobileAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { clearCart } from "@/redux/cart/cartSlice";
import orderApi from "@/api/orders";

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    city: user?.city || "",
    Province: "",
    country: "Nepal",
    street: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
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
        orderItems: items.map((item) => {
          // Support both backend shape {artId: {_id}} and local flat shape {_id}
          const artId =
            item.artId && typeof item.artId === "object"
              ? item.artId._id || item.artId.id
              : item.artId || item._id || item.id;
          return {
            artId,
            quantity: item.quantity || 1,
          };
        }),
        totalPrice: total,
        shippingAddress,
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
        <button
          onClick={() => router.push("/arts")}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Browse Arts
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-semibold text-black dark:text-white mb-8">
        Checkout
      </h1>

      <form
        onSubmit={handleCheckout}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#160327] p-6 rounded-2xl border border-gray-100 dark:border-purple-900/30 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 dark:text-white">
              <FaMapMarkerAlt className="text-purple-600 dark:text-purple-400" />{" "}
              Shipping Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0d0118] text-gray-900 dark:text-white border border-gray-200 dark:border-purple-900/40 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Province *
                </label>
                <input
                  type="text"
                  name="Province"
                  value={shippingAddress.Province}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0d0118] text-gray-900 dark:text-white border border-gray-200 dark:border-purple-900/40 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0d0118] text-gray-900 dark:text-white border border-gray-200 dark:border-purple-900/40 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#160327] p-6 rounded-2xl border border-gray-100 dark:border-purple-900/30 shadow-sm text-center">
            <h2 className="text-xl font-bold flex items-center justify-center gap-2 mb-4 dark:text-white">
              <FaCreditCard className="text-purple-600 dark:text-purple-400" />{" "}
              Payment
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base">
              We currently support Cash on Delivery and Online Payment via
              Khalti.
            </p>
            <div className="flex justify-center gap-4">
              <div className="border-2 border-purple-600 dark:border-purple-500 p-4 rounded-xl flex flex-col items-center gap-2 bg-purple-50 dark:bg-purple-900/20">
                <FaMobileAlt
                  size={24}
                  className="text-purple-600 dark:text-purple-400"
                />
                <span className="font-bold text-xs dark:text-purple-200 text-purple-900">
                  Standard Billing
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 dark:bg-black/40 dark:border dark:border-purple-900/50 text-white p-6 sm:p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 border-b border-white/10 pb-4">
              Order Summary
            </h2>
            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item, index) => {
                // Support both backend shape {artId: {...}} and local flat shape
                const art =
                  item.artId && typeof item.artId === "object"
                    ? item.artId
                    : item;
                const artId = art._id || art.id || item._id;
                const price = art.price || item.price || 0;
                return (
                  <div
                    key={artId ? `${artId}-${index}` : index}
                    className="flex justify-between items-center bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-sm truncate max-w-[150px]">
                        {art.title || art.name || "Art"}
                      </p>
                      <p className="text-white/50 text-xs">
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                    <p className="font-semibold text-purple-400">
                      Rs. {Number(price).toLocaleString()}
                    </p>
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
                <span className="text-purple-400">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handleCheckout}
              className="w-full bg-white dark:bg-purple-600 text-black dark:text-white mt-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 dark:hover:bg-purple-700 transition transform active:scale-95 disabled:opacity-50 shadow-xl shadow-purple-900/20"
            >
              {loading ? "Processing..." : "Place Order & Pay Later"}
            </button>
            <p className="flex items-start sm:items-center justify-center gap-2 text-white/40 text-[10px] sm:text-xs mt-4 mt-top text-center sm:text-left">
              <FaLock size={12} className="mt-0.5 sm:mt-0 flex-shrink-0" />
              <span>
                You will choose your payment method (Khalti / Stripe / COD) on the
                next step.
              </span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
