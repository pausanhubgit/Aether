"use client";
import UsersTable from "./_components/Table";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userApi from "@/api/users";
import { FaUsers, FaPalette, FaVideo, FaCalendarAlt, FaChartLine, FaMusic, FaHeart } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

// Format large numbers to human-readable: 1200 → 1.2K, 1500000 → 1.5M
const formatNumber = (num) => {
  const n = Math.max(0, num || 0);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
};

// Clamp to 0 or above — never show negative counts
const clamp = (val) => Math.max(0, val || 0);

const UserManagement = () => {
  const [stats, setStats] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // All clamped to 0+ — no negative values ever displayed
  const totalUsers     = clamp(stats?.totalUsers);
  const totalArts      = clamp(stats?.totalArts);
  const totalVideos    = clamp(stats?.totalVideos);
  const totalEvents    = clamp(stats?.totalEvents);
  const totalMusics    = clamp(stats?.totalMusics);
  const totalReactions = clamp(stats?.totalReactions);

  // Actual time-series data from backend
  const chartData = stats?.growthData || [
    { name: 'Jan', users: 0, arts: 0, events: 0 },
    { name: 'Feb', users: 0, arts: 0, events: 0 },
    { name: 'Mar', users: 0, arts: 0, events: 0 },
    { name: 'Apr', users: 0, arts: 0, events: 0 },
    { name: 'May', users: 0, arts: 0, events: 0 },
    { name: 'Jun', users: 0, arts: 0, events: 0 },
  ];


  const statCards = [
    { label: 'Users',     value: totalUsers,     icon: FaUsers,       color: 'blue'    },
    { label: 'Arts',      value: totalArts,      icon: FaPalette,     color: 'purple'  },
    { label: 'Music',     value: totalMusics,    icon: FaMusic,       color: 'indigo'  },
    { label: 'Videos',    value: totalVideos,    icon: FaVideo,       color: 'emerald' },
    { label: 'Events',    value: totalEvents,    icon: FaCalendarAlt, color: 'amber'   },
    { label: 'Reactions', value: totalReactions, icon: FaHeart,       color: 'pink'    },
  ];

  const colorMap = {
    blue:    { bg: 'bg-blue-50 dark:bg-blue-900/30',     icon: 'text-blue-600',    num: 'text-blue-700 dark:text-blue-300'     },
    purple:  { bg: 'bg-purple-50 dark:bg-purple-900/30', icon: 'text-purple-600',  num: 'text-purple-700 dark:text-purple-300' },
    indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-900/30', icon: 'text-indigo-600',  num: 'text-indigo-700 dark:text-indigo-300' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/30',icon:'text-emerald-600', num: 'text-emerald-700 dark:text-emerald-300'},
    amber:   { bg: 'bg-amber-50 dark:bg-amber-900/30',   icon: 'text-amber-600',   num: 'text-amber-700 dark:text-amber-300'   },
    pink:    { bg: 'bg-pink-50 dark:bg-pink-900/30',     icon: 'text-pink-600',    num: 'text-pink-700 dark:text-pink-300'     },
  };

  return (
    <div className="px-4 mx-auto max-w-screen-2xl pb-10 mt-10">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="font-semibold text-4xl text-black dark:text-white mb-2 tracking-tight">
          System Administration
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium italic">
          High-level overview of community growth and platform health.
        </p>
      </div>

      {/* Stat Cards — 6 metrics, all clamped to ≥0, formatted */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, color }) => {
          const c = colorMap[color];
          return (
            <div key={label} className="bg-white dark:bg-[#160327] p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col gap-3">
              <div className={`h-11 w-11 rounded-xl ${c.bg} flex items-center justify-center`}>
                <Icon className={`${c.icon} text-xl`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <h4 className={`text-2xl font-black ${c.num} leading-none`}>{formatNumber(value)}</h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Growth Chart */}
      <div className="bg-white dark:bg-[#160327] p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl shadow-sm">
              <FaChartLine className="text-indigo-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-black dark:text-white">Growth Velocity</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Users &amp; Content Trends (Jan → Jun)</p>
            </div>
          </div>
          {/* Chart Legend */}
          <div className="flex items-center gap-5 text-[11px] font-bold text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>Users
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span>Arts
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>Events
            </span>
          </div>
        </div>

        <div className="h-[350px] w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={chartData} margin={{ top: 30, right: 20, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorArts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
  
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
  
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }}
                  dy={15}
                />
  
                {/* Y-Axis: starts at 0, auto max, formatted as 100 / 200 / 1K / 1.5M etc. */}
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                  tickFormatter={formatNumber}
                  domain={[0, 'auto']}
                  tickCount={6}
                  dx={-8}
                />
  
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.12)',
                    fontSize: '13px',
                    fontWeight: 700
                  }}
                  formatter={(value, name) => [formatNumber(value), name]}
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
                  <LabelList
                    dataKey="users"
                    position="top"
                    offset={12}
                    formatter={formatNumber}
                    style={{ fill: '#4f46e5', fontSize: '11px', fontWeight: 'bold' }}
                  />
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
                  <LabelList
                    dataKey="arts"
                    position="top"
                    offset={12}
                    formatter={formatNumber}
                    style={{ fill: '#8b5cf6', fontSize: '11px', fontWeight: 'bold' }}
                  />
                </Area>
  
                <Area
                  type="monotone"
                  dataKey="events"
                  name="Events Launched"
                  stroke="#f59e0b"
                  fillOpacity={0}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">Loading analysis...</div>
          )}
        </div>

      </div>

      <UsersTable />
    </div>
  );
};

export default UserManagement;