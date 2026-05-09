"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaBox,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
} from "react-icons/fa";
import orderApi from "@/api/orders";
import { formatImageUrl } from "@/helpers/url";
import { toast } from "react-toastify";
import PayViaKhalti from "./_components/PayViaKhalti";
import PayViaStripe from "./_components/PayViaStripe";

const OrdersPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "pending";
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // COD Modal State
  const [codModalOpen, setCodModalOpen] = useState(false);
  const [activeCodOrder, setActiveCodOrder] = useState(null);
  const [codForm, setCodForm] = useState({ phone: "", email: "", address: "" });

  // Tracking State
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi.getOrdersByUser({
          status: statusFilter,
        });
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
      phone: order.userid?.phone || "",
      email: order.userid?.email || "",
      address: order.shippingAddress?.street || "",
    });
    setCodModalOpen(true);
  };

  const handleCODSubmit = async (e) => {
    e.preventDefault();
    try {
      await orderApi.markAsCOD(activeCodOrder._id, codForm);
      toast.success("Order set to Cash on Delivery!");
      setOrders(orders.filter((o) => o._id !== activeCodOrder._id)); // removes from 'pending' tab visually
      setCodModalOpen(false);
    } catch (e) {
      toast.error(e?.response?.data || "Failed to select COD");
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await orderApi.cancelOrder(orderId);
      toast.success("Order cancelled securely.");
      setOrders(orders.filter((o) => o._id !== orderId)); // removes from 'pending' tab visually
    } catch (e) {
      toast.error(e?.response?.data || "Failed to cancel order");
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "confirmed":
        return <FaCheckCircle className="text-blue-500" />;
      case "shipped":
        return <FaTruck className="text-purple-500" />;
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!mounted)
    return (
      <div className="container mx-auto py-20 px-4 max-w-5xl text-center">
        <div className="animate-pulse bg-gray-100 h-10 w-48 mx-auto rounded-full mb-8"></div>
        <div className="space-y-4">
          <div className="animate-pulse bg-gray-50 h-32 w-full rounded-3xl"></div>
          <div className="animate-pulse bg-gray-50 h-32 w-full rounded-3xl"></div>
        </div>
      </div>
    );

  if (!isAuthenticated)
    return (
      <div className="p-20 text-center font-bold">
        Please login to view orders.
      </div>
    );

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-black dark:text-white mb-6 md:mb-8 tracking-tight">
        My Orders
      </h1>

      {/* Filter Tabs */}
      <div className="-mx-4 px-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex gap-2 min-w-max">
          {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => router.push(`/orders?status=${status}`)}
                className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition whitespace-nowrap flex-shrink-0 ${
                  statusFilter === status
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-purple-200"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white h-40 rounded-3xl border border-gray-100"
            ></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <FaBox className="mx-auto text-gray-200 text-6xl mb-4" />
          <h2 className="text-xl font-bold text-gray-800">
            No orders found for this status.
          </h2>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-50 dark:border-purple-900/40 pb-4">
                <div className="w-full md:w-auto overflow-hidden">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Order Number
                  </p>
                  <p className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400 break-all">
                    {order.orderNumber || order._id}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
                  <div
                    className={`flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap flex-shrink-0 ${getStatusClass(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                {order.orderItems.map((item, idx) => {
                  // artId is populated from backend as an object
                  const art =
                    item.artId && typeof item.artId === "object"
                      ? item.artId
                      : {};
                  const imageUrl = art.imageUrls?.[0] || art.image || null;
                  return (
                    <div
                      key={item._id || idx}
                      className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100"
                    >
                      <div className="h-12 w-12 relative rounded-lg overflow-hidden border border-white">
                        {imageUrl ? (
                          <img
                            src={formatImageUrl(imageUrl)}
                            alt={art.title || "Art"}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <div className="h-full w-full bg-purple-100 flex items-center justify-center text-purple-400 text-xs font-bold">
                            Art
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">
                          {art.title || art.name || "Artwork"}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold">
                          Qty: {item.quantity}
                        </p>
                        {art.price && (
                          <p className="text-[10px] text-purple-500 font-bold">
                            Rs. {Number(art.price).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center bg-purple-50 p-4 rounded-2xl gap-4 mt-4">
                <div className="text-center sm:text-left w-full sm:w-auto">
                  <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest">
                    Total Value
                  </p>
                  <p className="text-xl font-semibold text-purple-600">
                    Rs. {order.totalPrice.toLocaleString()}
                  </p>
                </div>

                {order.status === "pending" ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
                    <PayViaKhalti order={order} className="w-full sm:w-auto" />
                    <PayViaStripe order={order} className="w-full sm:w-auto" />
                    <button
                      onClick={() => openCodModal(order)}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-green-700 transition w-full sm:w-auto"
                    >
                      Cash on Delivery
                    </button>
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold border border-red-200 hover:bg-red-100 transition w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                ) : order.status === "shipped" ||
                  order.status === "delivered" ? (
                  <button
                    onClick={() =>
                      setTrackingOrderId(
                        trackingOrderId === order._id ? null : order._id,
                      )
                    }
                    className="bg-white dark:bg-[#0d0118] text-purple-600 dark:text-purple-400 px-6 py-2 rounded-xl text-sm font-semibold shadow-sm border border-purple-100 dark:border-purple-900/50 hover:bg-purple-600 hover:text-white transition w-full sm:w-auto"
                  >
                    {trackingOrderId === order._id
                      ? "Close Tracking"
                      : "Track Order"}
                  </button>
                ) : null}
              </div>

              {/* Order Tracking Timeline Dropdown */}
              {trackingOrderId === order._id && (
                <div className="mt-6 border-t border-gray-100 dark:border-purple-900/30 pt-6 animate-fade-in">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-6 tracking-tight">
                    Tracking Progress
                  </h3>
                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                    {/* Progress Bar Background */}
                    <div className="hidden md:block absolute top-[18px] left-[5%] right-[5%] h-1 bg-gray-100 dark:bg-[#160327] -z-10 rounded-full"></div>

                    {/* Stages logic: 0=Pending, 1=Confirmed, 2=Shipped, 3=Delivered */}
                    {(() => {
                      const statusWeights = {
                        pending: 0,
                        confirmed: 1,
                        shipped: 2,
                        delivered: 3,
                      };
                      const orderStatusWeight =
                        statusWeights[order.status?.toLowerCase()] ?? -1;

                      const calcDaysBetween = (start, end) =>
                        Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                      const orderStart = new Date(order.createdAt);
                      // Example dynamic/manual tracking assumption: +3 days from shipped to delivered
                      let expectedDeliveryDate = new Date(
                        orderStart.getTime() + 5 * 24 * 60 * 60 * 1000,
                      );
                      if (order.estimatedDeliveryDate)
                        expectedDeliveryDate = new Date(
                          order.estimatedDeliveryDate,
                        );

                      const daysLeft = calcDaysBetween(
                        new Date(),
                        expectedDeliveryDate,
                      );
                      const isLate = daysLeft < 0;

                      const stages = [
                        {
                          label: "Pending",
                          icon: FaClock,
                          active: orderStatusWeight >= 0,
                        },
                        {
                          label: "Confirmed (Paid)",
                          icon: FaCheckCircle,
                          active: orderStatusWeight >= 1,
                        },
                        {
                          label: "Shipped",
                          icon: FaTruck,
                          active: orderStatusWeight >= 2,
                        },
                        {
                          label: "Delivered",
                          icon: FaBox,
                          active: orderStatusWeight >= 3,
                        },
                      ];

                      return (
                        <>
                          <div
                            className="hidden md:block absolute top-[18px] left-[5%] h-1 bg-purple-500 transition-all rounded-full z-0"
                            style={{
                              width: `${(Math.max(0, orderStatusWeight) / 3) * 90}%`,
                            }}
                          ></div>

                          {stages.map((stage, idx) => (
                            <div
                              key={stage.label}
                              className="flex flex-row md:flex-col items-center gap-4 md:gap-2 relative z-10 w-full md:w-auto"
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-[#0d0118] transition-colors ${stage.active ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-[#160327] text-gray-400"}`}
                              >
                                <stage.icon size={14} />
                              </div>
                              <div className="text-left md:text-center flex-grow">
                                <p
                                  className={`text-xs font-bold ${stage.active ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
                                >
                                  {stage.label}
                                </p>
                                {stage.label === "Shipped" &&
                                  (orderStatusWeight === 1 ||
                                    orderStatusWeight === 2) && (
                                    <span
                                      className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-xl block mt-1 break-words w-auto max-w-[120px] md:mx-auto text-center ${isLate ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}
                                    >
                                      {isLate
                                        ? "Delayed Delivery"
                                        : `Expected in ${daysLeft} days`}
                                    </span>
                                  )}
                                {stage.label === "Delivered" &&
                                  orderStatusWeight === 3 && (
                                    <span className="text-[10px] font-bold text-green-500 block mt-1">
                                      Order Complete
                                    </span>
                                  )}
                              </div>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* COD Configuration Modal */}
      {codModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#160327] rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Delivery Details
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Before confirming Cash On Delivery, please verify your contact and
              delivery location.
            </p>
            <form onSubmit={handleCODSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-purple-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={codForm.phone}
                  onChange={(e) =>
                    setCodForm({ ...codForm, phone: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 dark:bg-[#20053a] dark:border-purple-800 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-purple-500"
                  placeholder="Enter Phone Number"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-purple-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={codForm.email}
                  onChange={(e) =>
                    setCodForm({ ...codForm, email: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 dark:bg-[#20053a] dark:border-purple-800 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-purple-500"
                  placeholder="Enter Email Address"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-purple-300 mb-1">
                  Detailed Delivery Address
                </label>
                <textarea
                  required
                  value={codForm.address}
                  onChange={(e) =>
                    setCodForm({ ...codForm, address: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 dark:bg-[#20053a] dark:border-purple-800 dark:text-white rounded-xl px-4 py-2 text-sm h-24 resize-none focus:outline-purple-500"
                  placeholder="Street, landmark, etc."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setCodModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition shadow-md"
                >
                  Confirm Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
