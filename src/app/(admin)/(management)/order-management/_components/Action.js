"use client";
import api from "@/api/api";
import orderApi from "@/api/order";
import Modal from "@/components/Modal";
import { useState } from "react";
import { BsBox2 } from "react-icons/bs";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import {
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_DELIVERED,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_SHIPPED,
} from "@/constants/orderStatus";

const Action = ({ order, onUpdate }) => {
  const id = order._id || order.id;
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(
    order.estimatedDeliveryDate
      ? new Date(order.estimatedDeliveryDate).toISOString().split("T")[0]
      : "",
  );
  const [loading, setLoading] = useState(false);

  const updateOrderStatus = async () => {
    setLoading(true);
    try {
      // STAGE 1: Status Update (Dedicated Backend Endpoint)
      await orderApi.updateOrderStatus(id, { status });

      // STAGE 2: Metadata Sync (Only if changed)
      if (
        estimatedDeliveryDate !==
        (order.estimatedDeliveryDate
          ? new Date(order.estimatedDeliveryDate).toISOString().split("T")[0]
          : "")
      ) {
        await api.put(`/api/orders/${id}`, { estimatedDeliveryDate });
      }

      toast.success("Order updated successfully!");
      setShowModal(false);

      // Refresh data
      if (onUpdate) onUpdate();
      else if (typeof window !== "undefined") window.location.reload();
    } catch (error) {
      console.error("⛔ [ORDER UPDATE] SYSTEM FAILURE:", error);
      const serverMsg = error.response?.data?.message || error.message;
      toast.error(`Update Failed: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm("Are you sure you want to permanently delete this order?")
    )
      return;

    try {
      await orderApi.deleteOrder(id);
      toast.success("Order deleted successfully");
      if (onUpdate) onUpdate();
      else if (typeof window !== "undefined") window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Order deletion failed");
    }
  };

  return (
    <div className="flex items-center gap-4 justify-center">
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-2 text-blue-500 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all flex items-center gap-2"
        title="Edit Order"
      >
        <FaPencil /> <span className="text-xs">Edit</span>
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-2 text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex items-center gap-2"
        title="Delete Order"
      >
        <FaTrash /> <span className="text-xs">Delete</span>
      </button>

      <Modal
        icon={<BsBox2 className="mx-auto text-6xl text-gray-400 mb-5" />}
        showModal={showModal}
        setShowModal={setShowModal}
        label={"Update Order Details"}
        info={
          <div className="pb-5">
            <div className="flex flex-col gap-4 max-w-xs mx-auto text-left">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Order Status
              </label>
              <select
                className="w-full border-2 rounded-xl px-4 py-3 border-gray-100 dark:border-purple-900/30 bg-gray-50 dark:bg-[#0d0118] text-black dark:text-white focus:border-purple-500 outline-none transition-all font-bold text-sm cursor-pointer"
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                <option value={ORDER_STATUS_PENDING}>⏳ Pending</option>
                <option value={ORDER_STATUS_CONFIRMED}>✅ Confirmed</option>
                <option value={ORDER_STATUS_SHIPPED}>🚚 Shipped</option>
                <option value={ORDER_STATUS_DELIVERED}>🎁 Delivered</option>
                <option value={ORDER_STATUS_CANCELLED}>❌ Cancelled</option>
              </select>

              {(status === ORDER_STATUS_SHIPPED ||
                status === ORDER_STATUS_CONFIRMED) && (
                <div className="animate-fade-in mt-2 p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                  <label className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-[0.2em] mb-2 block font-heading">
                    Est. Delivery Date
                  </label>
                  <input
                    type="date"
                    value={estimatedDeliveryDate}
                    onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                    className="w-full border-2 rounded-xl px-4 py-3 border-gray-100 dark:border-purple-900/30 bg-white dark:bg-[#0d0118] text-black dark:text-white focus:border-purple-500 outline-none font-bold"
                  />
                  <p className="text-[10px] text-gray-400 mt-2 font-medium italic">
                    Required for customer tracking
                  </p>
                </div>
              )}
            </div>
          </div>
        }
        confirmAction={
          <button
            onClick={updateOrderStatus}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-xs shadow-xl shadow-purple-600/20 hover:scale-[1.02] active:scale-95 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Processing..." : "Confirm Update"}
          </button>
        }
      />
    </div>
  );
};

export default Action;
