"use client";
import { format } from "date-fns";
import { FaCog } from "react-icons/fa";
import { useEffect, useState } from "react";
import orderApi from "@/api/order";
import {
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_DELIVERED,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_SHIPPED,
} from "@/constants/orderStatus";
import { RxDotFilled } from "react-icons/rx";
import Action from "./Action";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ADMIN_ROLE } from "@/constants/userRoles";

const columns = [
  { label: "S.N", key: "id" },
  { label: "Order number", key: "orderNumber" },
  { label: "User", key: "user" },
  { label: "Order items", key: "orderItems" },
  { label: "Total price", key: "totalPrice" },
  { label: "Status", key: "status" },
  { label: "Created At", key: "createdAt" },
];

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  async function getAllOrders() {
    setLoading(true);
    setFetchError(null);
    try {
      const response = user?.roles?.includes(ADMIN_ROLE)
        ? await orderApi.getOrders()
        : await orderApi.getOrdersByMerchant();

      // Handle array, {data:[...]}, or {orders:[...]} response shapes
      const raw = response?.data;
      const ordersArray = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.orders)
        ? raw.orders
        : [];

      setOrders(ordersArray);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Failed to load orders. Please try again.";
      setFetchError(String(msg));
      toast.error(String(msg), { autoClose: 3000 });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) getAllOrders();
  }, [user]);

  const totalSales = orders.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

  return (
    <div className="relative overflow-hidden bg-white shadow-md dark:bg-[#160327] border border-gray-300 dark:border-gray-700 sm:rounded-lg">
      {/* Header */}
      <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
        <div className="flex items-center flex-1 space-x-4">
          <h5>
            <span className="text-gray-500">All Orders: </span>
            <span className="dark:text-white font-bold">{orders.length}</span>
          </h5>
          <h5>
            <span className="text-gray-500">Total sales: </span>
            <span className="dark:text-white font-bold">Rs. {totalSales.toLocaleString()}</span>
          </h5>
        </div>
        <button
          onClick={getAllOrders}
          className="px-4 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/80 transition"
        >
          Refresh
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
      ) : fetchError ? (
        <div className="py-16 text-center px-4">
          <p className="text-red-500 font-semibold mb-2">Failed to load orders</p>
          <p className="text-gray-400 text-sm mb-4">{fetchError}</p>
          <button onClick={getAllOrders} className="px-5 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/80 transition">
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center px-4">
          <p className="text-gray-500 dark:text-gray-400 font-medium">No orders found.</p>
          <p className="text-gray-400 text-sm mt-1">Orders will appear here once customers make purchases.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
            <thead className="text-xs text-gray-700 font-medium uppercase bg-gray-50 dark:bg-[#160327] dark:text-gray-300">
              <tr>
                {columns.map((column, index) => (
                  <th scope="col" className="px-4 py-3 cursor-pointer" key={index}>
                    <div className="flex items-center gap-2">{column.label}</div>
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 flex justify-center sticky right-0 bg-gray-50 dark:bg-[#160327] shadow-[-5px_0_10px_rgba(0,0,0,0.02)] z-10 w-16">
                  <FaCog />
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id || order.id || index}
                  className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-2">{index + 1}.</td>
                  <td className="px-4 py-2 font-medium text-[10px] break-all max-w-[120px] uppercase">
                    {order._id || order.id || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-xs break-all max-w-[150px]">
                      {order?.userid?.username || order?.user?.username || order?.userid?.name || order?.user?.name || "Unknown"}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <ul className="max-w-[200px] max-h-24 overflow-y-auto">
                      {order.orderItems?.map((item, idx) => {
                        const art = (item.artId && typeof item.artId === "object") ? item.artId : item;
                        return (
                          <li key={idx} className="flex items-start text-xs mb-1">
                            <RxDotFilled className="mt-0.5 shrink-0" />
                            <span className="font-medium px-1 line-clamp-2">
                              {art.title || art.name || "Art Piece"}
                              <span className="text-[10px] text-gray-400 block">Qty: {item.quantity || 1}</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    Rs. {(order.totalPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <div className="flex items-center">
                      {order.status === ORDER_STATUS_DELIVERED && <div className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full" />}
                      {order.status === ORDER_STATUS_SHIPPED && <div className="inline-block w-3 h-3 mr-2 bg-yellow-500 rounded-full" />}
                      {order.status === ORDER_STATUS_CONFIRMED && <div className="inline-block w-3 h-3 mr-2 bg-blue-500 rounded-full" />}
                      {order.status === ORDER_STATUS_PENDING && <div className="inline-block w-3 h-3 mr-2 bg-red-500 rounded-full" />}
                      <span className="text-xs capitalize">{order.status || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    {order.createdAt ? format(new Date(order.createdAt), "dd MMM, yyyy") : "N/A"}
                  </td>
                  <td className="px-4 py-2 sticky right-0 bg-white dark:bg-[#160327] shadow-[-5px_0_10px_rgba(0,0,0,0.02)] transition-colors">
                    <Action order={order} onUpdate={getAllOrders} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;