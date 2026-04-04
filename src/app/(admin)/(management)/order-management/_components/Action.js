import orderApi from "@/api/order";
import Modal from "@/components/Modal";
import { useState } from "react";
import { BsBox2 } from "react-icons/bs";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";

const Action = ({ id, orderStatus }) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(orderStatus);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");

  function updateOrderStatus() {
    orderApi.updateOrder(id, { status, ...(estimatedDeliveryDate && { estimatedDeliveryDate }) })
      .then(() => {
        toast.success(`Status updated: ${status}`, { autoClose: 1500 });
        if (typeof window !== "undefined") window.location.reload(); // Refresh table
      })
      .catch(() => {
        toast.error("Status update failed.", { autoClose: 1500 });
      })
      .finally(() => {
        setShowModal(false);
      });
  }

  function handleDelete() {
    if (!window.confirm("Are you sure you want to permanently delete this order?")) return;
    
    orderApi.deleteOrder(id)
      .then(() => {
        toast.success("Order deleted successfully", { autoClose: 1500 });
        if (typeof window !== "undefined") window.location.reload();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Order deletion failed", { autoClose: 1500 });
      });
  }

  return (
    <div className="flex items-center gap-4 justify-center">
      <button onClick={() => setShowModal(true)} className="px-3 py-2 text-blue-500 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all flex items-center gap-2" title="Edit Status">
        <FaPencil /> <span className="text-xs">Edit</span>
      </button>
      <button onClick={handleDelete} className="px-3 py-2 text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex items-center gap-2" title="Delete Order">
        <FaTrash /> <span className="text-xs">Delete</span>
      </button>

      <Modal
        icon={<BsBox2 className="mx-auto text-6xl text-gray-400 mb-5" />}
        showModal={showModal}
        setShowModal={setShowModal}
        label={"Update order status"}
        info={
          <div className="pb-5">
            <div className="flex flex-col gap-4 max-w-xs mx-auto text-left">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Status</label>
              <select
                className="border rounded-xl px-4 py-3 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0d0118] text-black dark:text-white focus:outline-purple-500"
                onChange={(e) => setStatus(e.target.value)}
                defaultValue={orderStatus}
              >
                <option value="pending">PENDING</option>
                <option value="confirmed">CONFIRMED</option>
                <option value="shipped">SHIPPED</option>
                <option value="delivered">DELIVERED</option>
                <option value="cancelled">CANCELLED</option>
              </select>

              {(status.toLowerCase() === 'shipped' || status.toLowerCase() === 'confirmed') && (
                <div className="animate-fade-in mt-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Est. Delivery Date</label>
                  <input 
                    type="date" 
                    onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                    className="mt-1 w-full border rounded-xl px-4 py-3 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0d0118] text-black dark:text-white focus:outline-purple-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">If left blank, auto-estimated to +5 days</p>
                </div>
              )}
            </div>
          </div>
        }
        confirmAction={
          <button
            onClick={updateOrderStatus}
            className="bg-green-700 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-800"
          >
            Update
          </button>
        }
      />
    </div>
  );
};

export default Action;