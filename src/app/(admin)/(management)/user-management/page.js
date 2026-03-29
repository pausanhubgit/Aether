"use client";
import UsersTable from "./_components/Table";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userApi from "@/api/users";
import { FaUsers, FaPalette, FaVideo, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const UserManagement = () => {
  const [stats, setStats] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    async function fetchStats() {
      if (user?._id) {
        try {
          const response = await userApi.getUserDashboard(user._id);
          setStats(response.data);
        } catch (error) {
          console.error("Failed to fetch admin stats", error);
        }
      }
    }
    fetchStats();
  }, [user?._id]);

  const chartData = [
    { name: 'Jan', users: 100, arts: 50, videos: 30, events: 10 },
    { name: 'Feb', users: 150, arts: 80, videos: 45, events: 15 },
    { name: 'Mar', users: 200, arts: 120, videos: 70, events: 20 },
    { name: 'Apr', users: 300, arts: 200, videos: 110, events: 35 },
    { name: 'May', users: 450, arts: 350, videos: 180, events: 50 },
    { name: 'Jun', 
      users: stats?.totalUsers || 600, 
      arts: stats?.totalArts || 400, 
      videos: stats?.totalVideos || 250, 
      events: stats?.totalEvents || 60 
    },
  ];

  return (
    <div className="px-4 mx-auto max-w-screen-2xl pb-10 mt-10">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="font-semibold text-4xl text-black dark:text-white mb-2 tracking-tight">
          System Administration
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium italic">High-level overview of community growth and platform health.</p>
      </div>

      {/* Admin Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <div className="lg:col-span-3 bg-white dark:bg-[#160327] p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl shadow-sm">
                <FaChartLine className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-xl text-black dark:text-white">Growth Velocity</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Users & Content Trends</p>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorArts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                   contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  name="Total Users" 
                  stroke="#4f46e5" 
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                  strokeWidth={4}
                  dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                >
                  <LabelList dataKey="users" position="top" offset={15} style={{ fill: '#4f46e5', fontSize: '12px', fontWeight: 'bold' }} />
                </Area>
                <Area 
                  type="monotone" 
                  dataKey="arts" 
                  name="Arts Published" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorArts)" 
                  strokeWidth={3} 
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                >
                   <LabelList dataKey="arts" position="top" offset={15} style={{ fill: '#8b5cf6', fontSize: '11px', fontWeight: 'bold' }} />
                </Area>
                <Area type="monotone" dataKey="events" name="Events Launched" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-[#160327] p-6 rounded-3xl border border-gray-100 dark:border-slate-700 flex items-center gap-5 shadow-sm hover:shadow-md transition">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <FaUsers className="text-blue-600 text-2xl" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Users</p>
              <h4 className="text-3xl font-semibold text-black dark:text-white">{stats?.totalUsers || 0}</h4>
            </div>
          </div>
          <div className="bg-white dark:bg-[#160327] p-6 rounded-3xl border border-gray-100 dark:border-slate-700 flex items-center gap-5 shadow-sm hover:shadow-md transition">
            <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <FaPalette className="text-purple-600 text-2xl" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Arts</p>
              <h4 className="text-3xl font-semibold text-black dark:text-white">{stats?.totalArts || 0}</h4>
            </div>
          </div>
          <div className="bg-white dark:bg-[#160327] p-6 rounded-3xl border border-gray-100 dark:border-slate-700 flex items-center gap-5 shadow-sm hover:shadow-md transition">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <FaVideo className="text-emerald-600 text-2xl" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Videos</p>
              <h4 className="text-3xl font-semibold text-black dark:text-white">{stats?.totalVideos || 0}</h4>
            </div>
          </div>
          <div className="bg-white dark:bg-[#160327] p-6 rounded-3xl border border-gray-100 dark:border-slate-700 flex items-center gap-5 shadow-sm hover:shadow-md transition">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <FaCalendarAlt className="text-amber-600 text-2xl" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Events</p>
              <h4 className="text-3xl font-semibold text-black dark:text-white">{stats?.totalEvents || 0}</h4>
            </div>
          </div>
        </div>
      </div>

      <UsersTable />
    </div>
  );
};

export default UserManagement;