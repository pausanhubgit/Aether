"use client";

import { updateUserProfile } from "@/redux/auth/authActions";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { resetSuccess } from "@/redux/auth/authSlice";
import ProfileImage from "./_components/ProfileImage";
import api from "@/api/users";
import eventsApi from "@/api/events";
import CoverImage from "./_components/CoverImage";
import { formatImageUrl } from "../../../helpers/url";
import Link from "next/link";
import {
  FaUser,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCog,
  FaChartLine,
  FaPalette,
  FaMusic,
  FaVideo,
  FaUserShield,
  FaHeart,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaTrophy
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from "recharts";
import { format } from "date-fns";

const ProfilePage = () => {
  const { error, loading, user, success } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState(null);
  const [creations, setCreations] = useState({ arts: [], musics: [], videos: [], events: [] });
  const [registrations, setRegistrations] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsMounted(true);
    async function fetchData() {
      const userId = user?._id || user?.id;
      if (userId) {
        try {
          const [statsRes, profileRes, regRes] = await Promise.all([
            api.getUserDashboard(userId),
            api.getUserProfile(userId),
            eventsApi.getMyRegistrations()
          ]);
          setStats(statsRes.data);
          setCreations(profileRes.data.creations);
          setRegistrations(regRes.data);
        } catch (err) {
          console.error("Failed to load profile data", err);
        }
      }
    }
    fetchData();
  }, [user?._id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      name: user?.username || user?.name,
      bio: user?.bio,
      city: user?.city || user?.address?.city,
    },
  });

  const chartData = [
    { name: 'Arts', value: stats?.totalArts || 0 },
    { name: 'Music', value: stats?.totalMusics || 0 },
    { name: 'Videos', value: stats?.totalVideos || 0 },
    { name: 'Events', value: stats?.totalEvents || 0 },
  ];

  function submitForm(data) {
    dispatch(
      updateUserProfile({
        id: user._id,
        name: data.name,
        bio: data.bio,
        address: {
          city: data.city,
        },
      })
    );
  }

  useEffect(() => {
    if (error) {
      toast.error(error, { autoClose: 1000 });
    }
    if (success) {
      toast.success("Profile updated successfully!", { autoClose: 1000 });
      dispatch(resetSuccess());
      setActiveTab("overview");
    }
  }, [error, success, dispatch]);

  return (
    <section className="bg-white dark:bg-[#160327] min-h-screen">
      {/* Premium Banner */}
      <div className="h-60 w-full relative overflow-hidden">
        {user?.coverImageUrl ? (
          <img 
            src={formatImageUrl(user.coverImageUrl)} 
            className="w-full h-full object-cover" 
            alt="Cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>
        )}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-20 relative z-10">
        <div className="bg-white dark:bg-[#160327] rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          {/* Header Area */}
          <div className="p-8 sm:p-10 border-b border-gray-100 dark:border-slate-700 relative">
            {/* Quick Settings Icon */}
            <div className="absolute top-8 right-8">
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-3 bg-white dark:bg-[#160327] shadow-lg rounded-2xl border border-gray-100 dark:border-slate-600 hover:scale-110 transition-transform text-gray-700 dark:text-gray-200"
                >
                  <FaCog className={`text-xl ${showSettings ? 'rotate-90' : ''} transition-transform duration-300`} />
                </button>
                {showSettings && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#160327] rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={() => {
                        if (user?.roles?.some(role => role.toUpperCase() === "ADMIN")) {
                          window.location.href = "/user-management";
                        } else {
                          toast.error("Access Denied: Only admins can access the management panel.", {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                          });
                        }
                      }} 
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-200 transition group border-b border-gray-100 dark:border-slate-700 mb-1 pointer-events-auto"
                    >
                      <FaUserShield className="text-purple-600 group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-sm">Admin Panel</span>
                        <span className="text-[10px] text-gray-400 font-medium">System Management</span>
                      </div>
                    </button>
                    <button
                      onClick={() => { setActiveTab("settings"); setShowSettings(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 transition group"
                    >
                      <FaCog className="text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-sm">Profile Edit</span>
                    </button>
                    <Link href="/dasboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-200 transition group">
                      <FaChartLine className="text-green-600 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-sm">Dashboard</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="h-40 w-40 rounded-full border-8 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-gray-100">
                {user?.profileImageUrl ? (
                  <img src={formatImageUrl(user.profileImageUrl)} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-purple-100 text-purple-600 text-4xl font-bold">
                    {user?.username?.charAt(0) || user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left mb-2">
                <h1 className="text-4xl font-semibold text-black dark:text-white mb-2">{user?.username || user?.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 dark:text-gray-400 font-medium">
                  <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-purple-500" /> {user?.address?.city || user?.city || "Unknown Location"}</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {user?.roles?.find(r => r.toUpperCase() === "ADMIN") ? "Admin" : (user?.roles?.[0] || "User")}
                  </span>
                  {user?.roles?.some(role => role.toUpperCase() === "ADMIN") && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-semibold uppercase tracking-widest border border-amber-200 dark:border-amber-700 shadow-sm shadow-amber-200/50">
                      <FaUserShield className="text-amber-500 animate-pulse" /> Official Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Removed Tab Navigation as requested - access via Quick Settings Icon */}
          <div className="p-0 border-b border-gray-100 dark:border-slate-700"></div>

          {/* Tab Content */}
          <div className="p-8 sm:p-10">
            {activeTab === "overview" ? (
              <div className="space-y-12">
                <section>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white mb-4">
                    <FaInfoCircle className="text-purple-600" /> Biography
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-[#160327]/30 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 italic">
                    "{user?.bio || "No biography shared yet. This user is a mystery!"}"
                  </p>
                </section>

                <section>
                   <div className="flex flex-col lg:flex-row gap-8">
                      {/* Detailed Stats */}
                      <div className="flex-1 space-y-4">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white mb-4">
                          <FaChartLine className="text-blue-600" /> Performance Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800 shadow-sm">
                            <p className="text-[10px] font-bold text-purple-500 uppercase mb-1 tracking-widest">Arts</p>
                            <p className="text-2xl font-semibold text-purple-700 dark:text-purple-300">{stats?.totalArts || 0}</p>
                          </div>
                          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm">
                            <p className="text-[10px] font-bold text-blue-500 uppercase mb-1 tracking-widest">Music</p>
                            <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">{stats?.totalMusics || 0}</p>
                          </div>
                          <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800 shadow-sm">
                            <p className="text-[10px] font-bold text-green-500 uppercase mb-1 tracking-widest">Videos</p>
                            <p className="text-2xl font-semibold text-green-700 dark:text-green-300">{stats?.totalVideos || 0}</p>
                          </div>
                          <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800 shadow-sm">
                            <p className="text-[10px] font-bold text-orange-500 uppercase mb-1 tracking-widest">Events</p>
                            <p className="text-2xl font-semibold text-orange-700 dark:text-orange-300">{stats?.totalEvents || 0}</p>
                          </div>
                          <div className="p-5 bg-pink-50 dark:bg-pink-900/20 rounded-2xl border border-pink-100 dark:border-pink-800 shadow-sm col-span-2 flex justify-between items-center">
                            <div>
                               <p className="text-[10px] font-bold text-pink-500 uppercase mb-1 tracking-widest">Total Reactions</p>
                               <p className="text-2xl font-semibold text-pink-700 dark:text-pink-300">{stats?.totalReactions || 0}</p>
                            </div>
                            <FaHeart className="text-pink-400 text-3xl opacity-50" />
                          </div>
                        </div>
                      </div>

                      {/* Personal Analysis Graph */}
                      <div className="flex-1 bg-white dark:bg-[#160327] p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Content Analysis</h3>
                        <div className="h-[250px] w-full">
                          {isMounted ? (
                            <ResponsiveContainer width="99%" height={250} minWidth={0}>
                              <AreaChart data={chartData}>
                                <defs>
                                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                                <YAxis hide />
                                <Tooltip 
                                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke="#8b5cf6" 
                                  fillOpacity={1} 
                                  fill="url(#colorVal)" 
                                  strokeWidth={4}
                                  dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                                  activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                                >
                                  <LabelList dataKey="value" position="top" offset={15} style={{ fill: '#8b5cf6', fontSize: '13px', fontWeight: 'bold' }} />
                                </Area>
                              </AreaChart>
                            </ResponsiveContainer>
                          ) : null}
                        </div>
                      </div>
                   </div>
                </section>

                {/* My Creative Portfolio */}
                <section>
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="flex items-center gap-2 text-2xl font-semibold text-black dark:text-white">
                        <FaPalette className="text-purple-600" /> My Collections
                     </h3>
                  </div>

                  <div className="space-y-12">
                    {/* Arts Section */}
                    {creations.arts?.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Featured Arts</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {creations.arts.map((art) => (
                            <Link key={art._id} href={`/arts/detail/${art._id}`} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 dark:border-slate-700">
                               <img src={formatImageUrl(art.imageUrls?.[0] || art.image)} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                  <p className="text-white font-bold text-sm truncate">{art.title}</p>
                                  <p className="text-purple-300 text-[10px] font-semibold uppercase">View Details →</p>
                               </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Music Section */}
                    {creations.musics?.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Music Tracks</h4>
                        <div className="space-y-3">
                          {creations.musics.map((music) => (
                            <Link key={music._id} href={`/music/detail/${music._id}`} className="flex items-center gap-4 p-4 bg-white dark:bg-[#160327] rounded-2xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition group">
                              <div className="h-14 w-14 rounded-xl overflow-hidden bg-blue-100 flex-shrink-0">
                                <img src={formatImageUrl(music.thumbnail || music.image)} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-black dark:text-white truncate">{music.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{music.genre || 'Various'}</p>
                              </div>
                              <FaExternalLinkAlt className="text-gray-300 group-hover:text-purple-600 transition-colors mr-2" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Videos Section */}
                    {creations.videos?.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Video library</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {creations.videos.map((vid) => (
                            <Link key={vid._id} href={`/video/detail/${vid._id}`} className="group relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 dark:border-slate-700">
                               <img src={formatImageUrl(vid.thumbnail || vid.image)} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                                  <p className="text-white font-bold text-lg">{vid.title}</p>
                                  <p className="text-green-400 text-xs font-semibold uppercase tracking-widest flex items-center gap-2"><FaVideo /> Watch Now</p>
                               </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Events Section */}
                    {creations.events?.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Hosted Events</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {creations.events.map((evt) => (
                             <div key={evt._id} className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-[2rem] border border-purple-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 bg-purple-600 text-white rounded-bl-[2rem] text-[10px] font-semibold uppercase tracking-tighter">Hosted</div>
                                <h5 className="text-xl font-semibold text-black dark:text-white mb-2 pr-12 leading-tight">{evt.title}</h5>
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-4">
                                   <span className="flex items-center gap-1"><FaCalendarAlt className="text-purple-500" /> {format(new Date(evt.startDate), 'MMM dd')}</span>
                                   <span className="flex items-center gap-1"><FaTrophy className="text-amber-500" /> {evt.prizePool}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{evt.description}</p>
                                <button className="text-xs font-semibold text-purple-600 uppercase tracking-widest hover:text-purple-800 transition-colors">Manage Event →</button>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {(!creations.arts?.length && !creations.musics?.length && !creations.videos?.length && !creations.events?.length) && (
                      <div className="text-center py-20 bg-gray-50 dark:bg-[#160327]/20 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
                         <div className="w-20 h-20 bg-white dark:bg-[#160327] shadow-xl rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaPalette className="text-gray-200 text-3xl" />
                         </div>
                         <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Your Portfolio is Empty</h4>
                         <p className="text-gray-500 mt-2">Start creating and hosting to build your audience!</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Event Participations */}
                <section className="mt-16 pt-16 border-t border-gray-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-3xl font-semibold text-black dark:text-white tracking-tight">Participating In</h3>
                      <p className="text-gray-500 font-medium mt-1">Events you've registered for</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <FaTrophy className="text-blue-600 text-xl" />
                    </div>
                  </div>

                  {registrations?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {registrations.map((reg) => (
                        <div key={reg._id} className="group relative bg-white dark:bg-[#160327] p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                          <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                              <FaCalendarAlt className="text-purple-600 text-2xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-semibold uppercase tracking-widest rounded-full">
                                    {reg.status}
                                  </span>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{reg.eventId?.eventType}</span>
                               </div>
                               <h4 className="text-lg font-semibold text-black dark:text-white truncate">{reg.eventId?.title}</h4>
                               <p className="text-sm text-gray-500 font-medium mt-1">Starts: {reg.eventId?.startDate ? format(new Date(reg.eventId.startDate), 'MMM dd, yyyy') : 'TBD'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gray-50 dark:bg-[#160327]/20 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
                       <p className="text-gray-500 font-bold">You haven't joined any events yet.</p>
                       <Link href="/events" className="inline-block mt-4 text-purple-600 font-semibold text-sm hover:underline">Browse Events →</Link>
                    </div>
                  )}
                </section>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-white mb-8">
                  <FaCog className="text-purple-600" /> Profile Settings
                </h3>

                <ProfileImage user={user} />
                <CoverImage user={user} />

                <form onSubmit={handleSubmit(submitForm)} className="space-y-8 mt-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Full Name</label>
                      <input
                        {...register("name", { required: "Name is required" })}
                        className="w-full p-4 bg-gray-50 dark:bg-[#160327] border border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition dark:text-white"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">City</label>
                      <input
                        {...register("city", { required: "City is required" })}
                        className="w-full p-4 bg-gray-50 dark:bg-[#160327] border border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition dark:text-white"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Biography</label>
                    <textarea
                      {...register("bio")}
                      rows="5"
                      placeholder="Tell the community about yourself..."
                      className="w-full p-4 bg-gray-50 dark:bg-[#160327] border border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className="px-8 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-[#160327] dark:hover:bg-slate-600 text-gray-700 dark:text-white font-bold rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <Button
                      loading={loading}
                      label="Save Profie Changes"
                      className="px-10 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 dark:shadow-none"
                    />
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;