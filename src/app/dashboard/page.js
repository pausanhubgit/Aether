"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList
} from "recharts";
import {
  FaPalette,
  FaMusic,
  FaVideo,
  FaHeart,
  FaPlus,
  FaChartLine,
  FaCalendarAlt
} from "react-icons/fa";
import api from "@/api/api";
import { toast } from "react-toastify";
import ArtsTable from "../(admin)/(management)/Art-management/_components/Table";
import MusicTable from "../(admin)/(management)/Music-management/_components/Table";
import VideoTable from "../(admin)/(management)/Video-management/_components/Table";

// Provide some nice mock graph data showcasing growth
const graphData = [
  { name: "Mon", likes: 12, views: 45 },
  { name: "Tue", likes: 19, views: 60 },
  { name: "Wed", likes: 15, views: 55 },
  { name: "Thu", likes: 25, views: 80 },
  { name: "Fri", likes: 42, views: 120 },
  { name: "Sat", likes: 65, views: 210 },
  { name: "Sun", likes: 88, views: 310 },
];

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState({
    totalArts: 0,
    totalMusics: 0,
    totalVideos: 0,
    totalReactions: 0,
    badges: []
  });

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      router.push("/login");
      return;
    }
    
    // Fetch Metrics from Backend
    if (user?._id) {
       api.get(`/api/users/${user._id}/dashboard`)
         .then(res => setMetrics(res.data))
         .catch(err => console.error("Could not load metrics", err));
    }
  }, [isAuthenticated, user, router]);

  // Handle Tab Switcher
  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
        activeTab === id
          ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
          : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 dark:bg-[#160327] dark:text-gray-300 dark:hover:bg-slate-700 border border-gray-100 dark:border-gray-700"
      }`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#160327]/50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Management Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track your creative portfolio and audience engagement.</p>
          </div>
          <button onClick={() => router.push('/profile')} className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 dark:bg-[#160327] dark:border-slate-700 dark:text-gray-200 transition shadow-sm">
            ← Back to Profile
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 pb-2">
          <TabButton id="overview" label="Analytics" icon={FaChartLine} />
          <TabButton id="arts" label="Arts Portfolio" icon={FaPalette} />
          <TabButton id="music" label="Music Tracks" icon={FaMusic} />
          <TabButton id="video" label="Video Library" icon={FaVideo} />
          <TabButton id="events" label="Event Management" icon={FaCalendarAlt} />
        </div>

        {/* Dynamic Content */}
        <div className="pt-2">
          {activeTab === "overview" && <OverviewTab metrics={metrics} />}
          {activeTab === "arts" && <ArtsTable />}
          {activeTab === "music" && <MusicTable />}
          {activeTab === "video" && <VideoTable />}
          {activeTab === "events" && <EventManagementTab />}
        </div>

      </div>
    </div>
  );
}

// Subcomponents

function OverviewTab({ metrics }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const MetricCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="p-6 bg-white dark:bg-[#160327] rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-semibold text-black dark:text-white mt-1">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Arts" value={metrics.totalArts} icon={FaPalette} colorClass="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" />
        <MetricCard title="Music Uploads" value={metrics.totalMusics} icon={FaMusic} colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <MetricCard title="Video Uploads" value={metrics.totalVideos} icon={FaVideo} colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
        <MetricCard title="Total Likes" value={metrics.totalReactions} icon={FaHeart} colorClass="bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" />
      </div>

      {/* Point Graph Analysis */}
      <div className="p-6 bg-white dark:bg-[#160327] rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="mb-8 pl-2">
          <h2 className="text-xl font-bold text-black dark:text-white">Engagement Analysis</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Views and Likes velocity over the last 7 days</p>
        </div>
        <div className="h-[400px] w-full">
          {isMounted ? (
            <ResponsiveContainer width="99%" height={400} minWidth={0}>
              <LineChart data={graphData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                />
                <Legend verticalAlign="top" height={40} iconType="circle" />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  name="Total Views"
                  stroke="#6366f1" 
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#fff', strokeWidth: 3, stroke: '#6366f1' }}
                  activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 2 }}
                >
                   <LabelList dataKey="views" position="top" offset={15} style={{ fill: '#6366f1', fontSize: '12px', fontWeight: 'bold' }} />
                </Line>
                <Line 
                  type="monotone" 
                  dataKey="likes" 
                  name="Total Likes"
                  stroke="#ec4899" 
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#fff', strokeWidth: 3, stroke: '#ec4899' }}
                  activeDot={{ r: 8, stroke: '#ec4899', strokeWidth: 2 }}
                >
                   <LabelList dataKey="likes" position="top" offset={15} style={{ fill: '#ec4899', fontSize: '12px', fontWeight: 'bold' }} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">Loading chart...</div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventManagementTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', eventType: 'Art', prizePool: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    api.get('/api/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to load events", err))
      .finally(() => setLoading(false));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    api.post('/api/events', formData)
      .then(() => {
        toast.success("Event created successfully");
        setIsCreating(false);
        setFormData({ title: '', description: '', eventType: 'Art', prizePool: '' });
        fetchEvents();
      })
      .catch(err => toast.error(err.response?.data?.message || "Failed to create event"));
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    api.delete(`/api/events/${id}`)
      .then(() => {
        toast.success("Event deleted");
        fetchEvents();
      })
      .catch(err => toast.error("Failed to delete event"));
  };

  return (
    <div className="relative overflow-hidden backdrop-blur-md bg-white/80 dark:bg-[#160327]/80 shadow-2xl border border-white/20 dark:border-gray-700/30 sm:rounded-2xl transition-all duration-300">
      <div className="flex flex-col px-6 py-6 space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center flex-1 space-x-4">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <FaCalendarAlt className="text-amber-600 text-xl" />
          </div>
          <div>
            <h5 className="text-xl font-bold text-black dark:text-white">Events & Competitions</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">Host and manage artistic showdowns</p>
          </div>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:scale-105 transition-transform shadow-lg shadow-amber-500/25"
          >
            <FaPlus className="h-3.5 w-3.5 mr-2" />
            Create Event
          </button>
        )}
      </div>

      <div className="p-6">
        {isCreating ? (
          <div className="bg-white/50 dark:bg-[#160327]/50 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-inner">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6">Host New Competition</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Event Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#160327] dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  placeholder="e.g. Masterpiece 2024"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <select
                  value={formData.eventType}
                  onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#160327] dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                >
                  <option value="Art">Visual Arts</option>
                  <option value="Music">Musical Performance</option>
                  <option value="Video">Video Production</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Prize Pool / Rewards</label>
                <input
                  required
                  type="text"
                  value={formData.prizePool}
                  onChange={e => setFormData({ ...formData, prizePool: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#160327] dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  placeholder="e.g. $10,000 + Front Page Feature"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description & Guidelines</label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#160327] dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                  placeholder="Define the rules and spirit of the competition..."
                ></textarea>
              </div>
              <div className="col-span-2 flex gap-4 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-2.5 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-amber-600 font-bold hover:scale-105 transition-all shadow-lg"
                >
                  Launch Event
                </button>
              </div>
            </form>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 dark:bg-[#160327] rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-amber-50 dark:bg-[#160327] rounded-full flex items-center justify-center mb-6 group hover:rotate-12 transition-transform">
              <FaCalendarAlt className="text-amber-200 text-5xl" />
            </div>
            <h3 className="text-2xl font-semibold text-black dark:text-white tracking-tight">Arena is Empty</h3>
            <p className="text-gray-500 text-center max-w-xs mt-2 leading-relaxed italic">"Great things never came from comfort zones." Host a competition now.</p>
            <button
               onClick={() => setIsCreating(true)}
               className="mt-8 px-8 py-3 bg-amber-600 text-white rounded-full font-bold shadow-xl shadow-amber-600/20 hover:scale-105 transition-all"
            >
              Start First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div key={evt._id} className="group bg-white dark:bg-[#160327] p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-semibold rounded-lg uppercase tracking-widest shadow-sm">
                    {evt.eventType}
                  </span>
                  <button
                    onClick={() => handleDelete(evt._id)}
                    className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  >
                    <FaCog className="animate-spin-slow rotate-45" />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2 leading-tight group-hover:text-amber-600 transition-colors">{evt.title}</h3>
                <div className="flex items-center gap-2 mb-4 text-amber-500">
                  <span className="text-xs font-semibold uppercase">Reward:</span>
                  <span className="text-sm font-bold truncate">{evt.prizePool}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                  {evt.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#160327] flex items-center justify-center font-bold text-xs text-gray-500 uppercase">
                      {evt.creatorUserId?.name?.slice(0, 2) || 'AD'}
                    </div>
                    <span className="text-xs font-bold text-gray-400 tracking-tight">Hosted by Organizers</span>
                  </div>
                  <button className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 group-hover:text-amber-500 transition-colors">Details →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
