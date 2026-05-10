"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import orderApi from "@/api/order";
import { FaCheckCircle, FaTruck, FaBox, FaClock } from "react-icons/fa";

const OrderStatusContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await orderApi.getOrdersByUser();
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;

    const loadOrders = async () => {
      if (isMounted) {
        await fetchOrders();
      }

      // Handle Payment Success Parameters
      const pidx = searchParams.get("pidx");
      const status = searchParams.get("status");
      const purchaseOrderId = searchParams.get("purchase_order_id");

      if (status === "Completed" && pidx && purchaseOrderId) {
        try {
          await orderApi.confirmPayment(purchaseOrderId, { status: "success", pidx });
          if (isMounted) {
            await fetchOrders();
          }
          // Clear URL to avoid reprocessing
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } catch (err) {
          console.error("Payment confirmation failed:", err);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, fetchOrders, searchParams]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-yellow-600" />;
      case "confirmed":
        return <FaBox className="text-blue-600" />;
      case "shipped":
        return <FaTruck className="text-purple-600" />;
      case "delivered":
        return <FaCheckCircle className="text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNextStatus = (currentStatus) => {
    const statuses = ["pending", "confirmed", "shipped", "delivered"];
    const currentIndex = statuses.indexOf(currentStatus);
    return currentIndex < statuses.length - 1
      ? statuses[currentIndex + 1]
      : null;
  };

  if (!isAuthenticated) {
    return <div className="text-center py-20">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Order Status</h1>
        <p className="text-gray-600 mb-10">
          Track your art purchases and manage delivery status
        </p>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">
              No orders yet. Start shopping to see your orders here!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <span
                        className={`px-4 py-2 rounded-full font-semibold text-sm border ${getStatusColor(order.status)}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="font-semibold mb-3">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded"
                      >
                        <span className="text-sm">{item.title}</span>
                        <span className="font-semibold text-purple-600">
                          Rs. {item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total & Actions */}
                <div className="px-6 py-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-purple-600">
                        Rs. {order.total.toFixed(2)}
                      </p>
                    </div>

                    {/* Status Progress */}
                    <div className="w-full sm:w-auto">
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${order.status === "pending" || order.status === "confirmed" || order.status === "shipped" || order.status === "delivered" ? "bg-yellow-600 text-white" : "bg-gray-300 text-gray-500"}`}
                        >
                          <FaClock className="text-xs" />
                        </div>
                        <div
                          className={`h-1 flex-1 ${["pending", "confirmed", "shipped", "delivered"].indexOf(order.status) >= 1 ? "bg-blue-600" : "bg-gray-300"}`}
                        ></div>
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${["confirmed", "shipped", "delivered"].includes(order.status) ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500"}`}
                        >
                          <FaBox className="text-xs" />
                        </div>
                        <div
                          className={`h-1 flex-1 ${["shipped", "delivered"].includes(order.status) ? "bg-purple-600" : "bg-gray-300"}`}
                        ></div>
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${["shipped", "delivered"].includes(order.status) ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-500"}`}
                        >
                          <FaTruck className="text-xs" />
                        </div>
                        <div
                          className={`h-1 flex-1 ${order.status === "delivered" ? "bg-green-600" : "bg-gray-300"}`}
                        ></div>
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${order.status === "delivered" ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"}`}
                        >
                          <FaCheckCircle className="text-xs" />
                        </div>
                      </div>
                      <div className="flex justify-between mt-3 px-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-tighter ${order.status === "pending" ? "text-yellow-600" : "text-gray-400"}`}
                        >
                          Pending
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-tighter ${order.status === "confirmed" ? "text-blue-600" : "text-gray-400"}`}
                        >
                          Confirmed
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-tighter ${order.status === "shipped" ? "text-purple-600" : "text-gray-400"}`}
                        >
                          Shipped
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-tighter ${order.status === "delivered" ? "text-green-600" : "text-gray-400"}`}
                        >
                          Delivered
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Update Status Button (Admin Feature) */}
                  {getNextStatus(order.status) && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order.id, getNextStatus(order.status))
                      }
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition font-semibold"
                    >
                      Update to{" "}
                      {getNextStatus(order.status).charAt(0).toUpperCase() +
                        getNextStatus(order.status).slice(1)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const OrderStatus = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <OrderStatusContent />
    </Suspense>
  );
};

export default OrderStatus;
