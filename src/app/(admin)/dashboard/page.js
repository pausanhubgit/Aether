"use client";
import userApi from "@/api/users";
import { toast } from "react-toastify";
import Card from "./_components/Card";
import { useEffect, useState } from "react";
import { FaPalette, FaMusic, FaVideo, FaHeart, FaUsers, FaCalendarAlt, FaChartBar, FaPlus, FaChartLine } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ADMIN_ROLE, MERCHANT_ROLE } from "@/constants/userRoles";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const isAdmin = user?.roles?.includes(ADMIN_ROLE);
  const isMerchant = user?.roles?.includes(MERCHANT_ROLE);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function getDashboardStats() {
    try {
      if (!user?._id) return;
      const response = await userApi.getUserDashboard(user._id);
      setStats(response.data);
    } catch (error) {
      toast.error(error?.response?.data || "Failed to load stats", { autoClose: 1500 });
    }
  }

  useEffect(() => {
    getDashboardStats();
  }, [user?._id]);

  // Real content breakdown — each category is one data point with the live count
  // Real time-series growth data from backend
  const chartData = stats?.growthData || [
    { name: 'Jan', users: 0, arts: 0, events: 0 },
    { name: 'Feb', users: 0, arts: 0, events: 0 },
    { name: 'Mar', users: 0, arts: 0, events: 0 },
    { name: 'Apr', users: 0, arts: 0, events: 0 },
    { name: 'May', users: 0, arts: 0, events: 0 },
    { name: 'Jun', users: 0, arts: 0, events: 0 },
  ];

  const merchantChartData = [
    { name: 'Arts', count: Math.max(0, stats?.totalArts || 0) },
    { name: 'Music', count: Math.max(0, stats?.totalMusics || 0) },
    { name: 'Videos', count: Math.max(0, stats?.totalVideos || 0) },
    { name: 'Events', count: Math.max(0, stats?.totalEvents || 0) },
    { name: 'Likes', count: Math.max(0, stats?.totalReactions || 0) },
  ];

  return (
    <div className="px-4 mx-auto max-w-screen-2xl pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-semibold text-3xl text-gray-800 dark:text-white mb-1">
            {isAdmin ? "Admin Overview" : "Merchant Dashboard"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {isAdmin ? "System-wide performance and user analytics" : "Track your content performance and engagement"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <Link href="/" className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 dark:bg-[#160327] dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all font-bold text-sm shadow-sm">
             <span>Back to Website</span>
          </Link>
          {!isAdmin && (
            <>
               <Link href="/Art-management/add" className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 !text-white rounded-xl hover:bg-purple-700 hover:shadow-purple-200/50 transition-all font-bold text-sm shadow-lg shadow-purple-600/20 dark:shadow-none">
                 <FaPlus className="text-xs" /> <span>Add Art</span>
               </Link>
               <Link href="/Music-management/add" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 !text-white rounded-xl hover:bg-blue-700 hover:shadow-blue-200/50 transition-all font-bold text-sm shadow-lg shadow-blue-600/20 dark:shadow-none">
                  <FaPlus className="text-xs" /> <span>Add Music</span>
               </Link>
               <Link href="/Video-management/add" className="flex items-center gap-2 px-5 py-2.5 bg-green-600 !text-white rounded-xl hover:bg-green-700 hover:shadow-green-200/50 transition-all font-bold text-sm shadow-lg shadow-green-600/20 dark:shadow-none">
                  <FaPlus className="text-xs" /> <span>Add Video</span>
               </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card
          label={isAdmin ? "Total Users" : "Total Music"}
          icon={isAdmin ? <FaUsers className="text-4xl text-indigo-600" /> : <FaMusic className="text-4xl text-blue-600" />}
          value={isAdmin ? Math.max(0, stats?.totalUsers || 0) : Math.max(0, stats?.totalMusics || 0)}
        />
        <Card
          label="Total Videos"
          icon={<FaVideo className="text-4xl text-green-600" />}
          value={Math.max(0, stats?.totalVideos || 0)}
        />
        <Card
          label="Total Arts"
          icon={<FaPalette className="text-4xl text-purple-600" />}
          value={Math.max(0, stats?.totalArts || 0)}
        />
        {isAdmin && (
          <Card
            label="Total Revenue"
            icon={<FaChartLine className="text-4xl text-emerald-600" />}
            value={`$${Math.max(0, stats?.revenue || 0).toFixed(2)}`}
          />
        )}
        <Card
          label={isAdmin ? "Total Events" : "Total Likes"}
          icon={isAdmin ? <FaCalendarAlt className="text-4xl text-orange-600" /> : <FaHeart className="text-4xl text-red-600" />}
          value={isAdmin ? Math.max(0, stats?.totalEvents || 0) : Math.max(0, stats?.totalReactions || 0)}
        />
      </div>

      <div className="bg-white dark:bg-[#160327] p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
            <FaChartBar className="text-xl text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200">
              {isAdmin ? "Platform Growth Trends" : "My Content Analysis"}
            </h3>
            <p className="text-sm text-gray-400 font-medium mt-0.5">Cumulative counts — actual database entries</p>
          </div>
        </div>

        <div className="h-[360px] w-full">
          {isMounted ? (
            <ResponsiveContainer width="99%" height={360} minWidth={0}>
              {isAdmin ? (
                <AreaChart
                  data={chartData}
                  margin={{ top: 30, right: 30, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorArts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 700, fill: '#6b7280' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '20px',
                      border: 'none',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      padding: '12px 16px',
                      fontWeight: '700'
                    }}
                    formatter={(val, name) => [val, name.charAt(0).toUpperCase() + name.slice(1)]}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    strokeWidth={3}
                    animationDuration={1200}
                    dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="arts"
                    stroke="#4f46e5"
                    fillOpacity={1}
                    fill="url(#colorArts)"
                    strokeWidth={3}
                    animationDuration={1200}
                    dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              ) : (
                <BarChart data={merchantChartData} margin={{ top: 30, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }} allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px 16px', fontWeight: '700' }} />
                  <Bar dataKey="count" fill="url(#colorCount)" radius={[8, 8, 0, 0]} barSize={40} animationDuration={1200} />
                </BarChart>
              )}
            </ResponsiveContainer>

          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">Loading content analysis...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;