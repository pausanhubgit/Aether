"use client";
import React, { useEffect, useState } from "react";
import subscriberAPI from "@/api/subscriber";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import {
  FaBell,
  FaTrash,
  FaEnvelope,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await subscriberAPI.getSubscribers();
      setSubscribers(response.data);
    } catch (error) {
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-50 flex items-center gap-3">
          <FaBell className="text-primary" /> Newsletter Subscribers
        </h1>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <FaChartLine /> Total: {subscribers.length}
        </div>
      </div>

      <div className="bg-white dark:bg-[#160327] rounded-3xl border border-slate-200 dark:border-purple-900/40 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-[#0f021b] border-b border-slate-200 dark:border-purple-900/40">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                Email Address
              </th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider text-right">
                Subscribed At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-purple-900/20">
            {subscribers.length > 0 ? (
              subscribers.map((sub) => (
                <tr
                  key={sub._id}
                  className="hover:bg-slate-50 dark:hover:bg-[#0f021b] transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/5 text-primary rounded-lg">
                        <FaEnvelope size={14} />
                      </div>
                      <span className="text-gray-800 dark:text-slate-200 font-medium">
                        {sub.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 text-gray-500 dark:text-purple-400 text-sm font-medium">
                      <FaCalendarAlt size={12} className="text-primary/70" />
                      {new Date(sub.subscribedAt).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-20 text-center text-gray-500 dark:text-purple-300"
                >
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscribersPage;
