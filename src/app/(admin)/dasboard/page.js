"use client";
import userApi from "@/api/users";
import { toast } from "react-toastify";
import Card from "./_components/Card";
import { useEffect, useState } from "react";
import { FaPalette, FaMusic, FaVideo, FaHeart, FaUsers, FaCalendarAlt, FaChartBar, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ADMIN_ROLE, MERCHANT_ROLE } from "@/constants/userRoles";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LabelList
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
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

  // Mock data generation for category-specific analysis
  const chartData = [
    { name: 'Jan', all: 45, arts: 12, music: 20, videos: 13 },
    { name: 'Feb', all: 52, arts: 15, music: 22, videos: 15 },
    { name: 'Mar', all: 48, arts: 10, music: 25, videos: 13 },
    { name: 'Apr', all: 70, arts: 25, music: 28, videos: 17 },
    { name: 'May', all: 85, arts: 30, music: 35, videos: 20 },
    { name: 'Jun', all: 100, arts: 40, music: 40, videos: 20 },
  ];

  const getCategoryColor = () => {
    switch(activeCategory) {
      case 'arts': return "#8b5cf6";
      case 'music': return "#3b82f6";
      case 'videos': return "#10b981";
      default: return "#6366f1";
    }
  };

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
          value={isAdmin ? (stats?.totalUsers || 0) : (stats?.totalMusics || 0)}
        />
        <Card
          label="Total Videos"
          icon={<FaVideo className="text-4xl text-green-600" />}
          value={stats?.totalVideos || 0}
        />
        <Card
          label="Total Arts"
          icon={<FaPalette className="text-4xl text-purple-600" />}
          value={stats?.totalArts || 0}
        />
        {isAdmin && (
          <Card
            label="Total Revenue"
            icon={<FaChartLine className="text-4xl text-emerald-600" />}
            value={`$${(stats?.revenue || 0).toFixed(2)}`}
          />
        )}
        <Card
          label={isAdmin ? "Total Events" : "Total Likes"}
          icon={isAdmin ? <FaCalendarAlt className="text-4xl text-orange-600" /> : <FaHeart className="text-4xl text-red-600" />}
          value={isAdmin ? (stats?.totalEvents || 0) : (stats?.totalReactions || 0)}
        />
      </div>

      <div className="bg-white dark:bg-[#160327] p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
               <FaChartBar className="text-xl text-blue-600" />
             </div>
             <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200">
               {isAdmin ? "Global Growth Analysis" : "Personal Content Analysis"}
             </h3>
          </div>

          {!isAdmin && (
            <div className="flex flex-wrap gap-2 bg-gray-50 dark:bg-[#160327] p-1.5 rounded-2xl border border-gray-100 dark:border-slate-600">
              {['all', 'arts', 'music', 'videos'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                    activeCategory === cat 
                      ? 'bg-white dark:bg-[#160327] text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-[400px] w-full relative group">
          <div className="absolute inset-0">
            {isMounted ? (
            <ResponsiveContainer width="99%" height={400} minWidth={0}>
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getCategoryColor()} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={getCategoryColor()} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px',
                    fontWeight: '700'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey={activeCategory} 
                  stroke={getCategoryColor()} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  strokeWidth={4}
                  animationDuration={1500}
                  dot={{ r: 4, fill: getCategoryColor(), strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                >
                  <LabelList 
                    dataKey={activeCategory} 
                    position="top" 
                    offset={15} 
                    style={{ fill: getCategoryColor(), fontSize: '13px', fontWeight: '800' }} 
                  />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">Loading content analysis...</div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;