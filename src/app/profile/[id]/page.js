"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import userApi from "@/api/users";
import { toast } from "react-toastify";
import MediaCard from "@/components/MediaCard";
import Image from "next/image";
import { formatImageUrl } from "@/helpers/url";
import { FaPalette, FaMusic, FaVideo, FaAward, FaCalendarAlt, FaUser } from "react-icons/fa";

export default function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("arts");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await userApi.getUserProfile(id);
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("User not found or failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      User profile not found.
    </div>
  );

  const { user, creations } = profile;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#160327] pb-20">
      {/* Header / Banner */}
      <div className="h-64 relative overflow-hidden">
        {user.coverImageUrl ? (
          <img 
            src={formatImageUrl(user.coverImageUrl)} 
            className="w-full h-full object-cover" 
            alt={`${user.name || user.username || 'User'}'s profile cover image`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-600 to-blue-600"></div>
        )}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-20 md:translate-x-0">
          <div className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-white shadow-xl relative">
            {user.profileImageUrl ? (
              <Image 
                src={user.profileImageUrl} 
                alt={user.name || "Profile"} 
                fill 
                sizes="(max-width: 768px) 100vw, 128px"
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#160327]">
                <FaUser className="text-4xl text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mx-auto max-w-7xl pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#160327] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <h1 className="text-2xl font-semibold text-black dark:text-white mb-1">
                {user.name || user.username}
              </h1>
              <p className="text-gray-500 text-sm mb-4">@{user.username || "artist"}</p>
              
              {user.bio && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                  {user.bio}
                </p>
              )}

              <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
                <FaCalendarAlt />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Badges */}
              {user.badges?.length > 0 && (
                <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge, index) => (
                      <span key={index} className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-[10px] font-bold border border-yellow-200 dark:border-yellow-700/50">
                        <FaAward /> {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-[#160327] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-center lg:text-left">Portfolio Stats</h4>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                <div className="flex flex-col lg:flex-row lg:justify-between items-center bg-gray-50 dark:bg-[#160327]/50 p-3 rounded-xl">
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase">Arts</span>
                    <span className="text-lg font-semibold text-purple-600">{user.totalArts || (creations.arts?.length || 0)}</span>
                 </div>
                 <div className="flex flex-col lg:flex-row lg:justify-between items-center bg-gray-50 dark:bg-[#160327]/50 p-3 rounded-xl">
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase">Music</span>
                    <span className="text-lg font-semibold text-blue-600">{user.totalMusics || (creations.musics?.length || 0)}</span>
                 </div>
                 <div className="flex flex-col lg:flex-row lg:justify-between items-center bg-gray-50 dark:bg-[#160327]/50 p-3 rounded-xl">
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase">Videos</span>
                    <span className="text-lg font-semibold text-green-600">{user.totalVideos || (creations.videos?.length || 0)}</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 dark:border-slate-700 sticky top-0 bg-gray-50/80 dark:bg-[#160327]/80 backdrop-blur-md z-10 pt-2 transition-all">
              <button 
                onClick={() => setActiveTab("arts")}
                className={`flex items-center gap-2 pb-4 px-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'arts' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                <FaPalette /> <span>Arts</span>
              </button>
              <button 
                onClick={() => setActiveTab("musics")}
                className={`flex items-center gap-2 pb-4 px-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'musics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                <FaMusic /> <span>Music</span>
              </button>
              <button 
                onClick={() => setActiveTab("videos")}
                className={`flex items-center gap-2 pb-4 px-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'videos' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                <FaVideo /> <span>Videos</span>
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creations[activeTab]?.length > 0 ? (
                creations[activeTab].map((item) => (
                  <MediaCard key={item._id} item={item} type={activeTab === 'arts' ? 'art' : activeTab === 'musics' ? 'music' : 'video'} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-400">No {activeTab} shared by this artist yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
