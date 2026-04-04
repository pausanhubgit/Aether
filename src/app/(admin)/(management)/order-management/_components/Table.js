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
  {
    label: "S.N",
    key: "id",
  },
  {
    label: "Order number",
    key: "orderNumber",
  },
  {
    label: "User",
    key: "user",
  },
  {
    label: "Order items",
    key: "orderItems",
  },
  {
    label: "Total price",
    key: "totalPrice",
  },

  {
    label: "Status",
    key: "status",
  },
  {
    label: "Created At",
    key: "createdAt",
  },
];

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);

  const { user } = useSelector((state) => state.auth);

  async function getAllOrders() {
    try {
      const response = user.roles.includes(ADMIN_ROLE)
        ? await orderApi.getOrders()
        : await orderApi.getOrdersByMerchant();

      console.log(response);

      setOrders(response.data);
    } catch (error) {
      toast.error(error.response.data, { autoClose: 1500 });
    }
  }

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="relative overflow-hidden bg-white shadow-md dark:bg-[#160327] border border-gray-300 dark:border-gray-700 sm:rounded-lg">
      <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
        <div className="flex items-center flex-1 space-x-4">
          <h5>
            <span className="text-gray-500">All Orders: </span>
            <span className="dark:text-white">{orders?.length}</span>
          </h5>
          <h5>
            <span className="text-gray-500">Total sales: </span>
            <span className="dark:text-white">
              Rs.
              {orders?.reduce((acc, item) => acc + item.totalPrice, 0) / 1000}k
            </span>
          </h5>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
          <thead className="text-xs text-gray-700 font-medium uppercase bg-gray-50 dark:bg-[#160327] dark:text-gray-300">
            <tr>
              {columns.map((column, index) => (
                <th
                  scope="col"
                  className="px-4 py-3 cursor-pointer"
                  key={index}
                >
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
                key={index}
                className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2">
                  <div className="flex items-center">{index + 1}.</div>
                </td>
                <td className="px-4 py-2 font-medium text-[10px] break-all max-w-[120px] uppercase">{order._id || order.id || "N/A"}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center text-xs break-all max-w-[150px]">{order?.userid?.username || order?.user?.username || order?.userid?.name || "Unknown"}</div>
                </td>
                <td className="px-4 py-2">
                  <ul className="max-w-[200px] max-h-24 overflow-y-auto custom-scrollbar">
                    {order.orderItems?.map((item, index) => {
                      const art = (item.artId && typeof item.artId === 'object') ? item.artId : item;
                      return (
                      <li key={index} className="flex items-start text-xs mb-1">
                        <RxDotFilled className="mt-0.5 shrink-0" />
                        <span className="font-medium px-1 line-clamp-2">
                          {art.title || art.name || "Art Piece"}
                          <span className="text-[10px] text-gray-400 block">Qty: {item.quantity || 1}</span>
                        </span>
                      </li>
                    )})}
                  </ul>
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap">
                  <div className="flex items-center">
                    Rs. {order.totalPrice}
                  </div>
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap">
                  <div className="flex items-center">
                    {order.status == ORDER_STATUS_DELIVERED && (
                      <div className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full" />
                    )}
                    {order.status == ORDER_STATUS_SHIPPED && (
                      <div className="inline-block w-3 h-3 mr-2 bg-yellow-500 rounded-full" />
                    )}
                    {order.status == ORDER_STATUS_CONFIRMED && (
                      <div className="inline-block w-3 h-3 mr-2 bg-blue-500 rounded-full" />
                    )}

                    {order.status == ORDER_STATUS_PENDING && (
                      <div className="inline-block w-3 h-3 mr-2 bg-red-500 rounded-full" />
                    )}
                    <span className="text-xs">{order.status}</span>
                  </div>
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap">
                  {order.createdAt ? format(new Date(order.createdAt), "dd MMM, yyyy") : "N/A"}
                </td>
                <td className="px-4 py-2 sticky right-0 bg-white dark:bg-[#160327] shadow-[-5px_0_10px_rgba(0,0,0,0.02)] group-hover:bg-gray-50 dark:group-hover:bg-[#1c0433] transition-colors">
                  <Action id={order._id} orderStatus={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;