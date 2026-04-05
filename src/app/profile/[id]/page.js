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

  // Derive dynamic achievements based on portfolio stats
  const totalArts = Math.abs(user.totalArts ?? creations.arts?.length ?? 0);
  const totalMusics = Math.abs(user.totalMusics ?? creations.musics?.length ?? 0);
  const totalVideos = Math.abs(user.totalVideos ?? creations.videos?.length ?? 0);
  const totalEvents = Math.abs(user.totalEvents ?? creations.events?.length ?? 0);

  const derivedBadges = [];
  if (totalArts > 0) derivedBadges.push("Visual Artist");
  if (totalMusics > 0) derivedBadges.push("Musician");
  if (totalVideos > 0) derivedBadges.push("Videographer");
  if (totalEvents > 0) derivedBadges.push("Tourney Master");

  // Merge with any backend provided badges
  let displayBadges = [...new Set([...(user.badges || []), ...derivedBadges])];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#160327] pb-20">
      {/* Header / Banner + Profile Image wrapper */}
      <div className="relative">
        {/* Cover Banner */}
        <div className="h-56 md:h-72 relative overflow-hidden">
          {user.coverImageUrl ? (
            <img
              src={formatImageUrl(user.coverImageUrl)}
              className="w-full h-full object-cover"
              alt={`${user.name || user.username || 'User'}'s profile cover image`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600" />
          )}
          {/* Overlay gradient at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Profile Image — positioned OUTSIDE overflow-hidden, so it's always visible */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0 z-20">
          <div className="h-36 w-36 rounded-full border-4 border-white dark:border-[#160327] overflow-hidden bg-white shadow-2xl relative ring-4 ring-purple-500/30">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={user.name || "Profile"}
                fill
                sizes="(max-width: 768px) 144px, 144px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
                <FaUser className="text-5xl text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page content — padded top to clear the overlapping avatar */}
      <div className="px-4 mx-auto max-w-7xl pt-24">
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
              {displayBadges.length > 0 && (
                <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    {displayBadges.map((badge, index) => (
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
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="flex flex-col lg:flex-row lg:justify-between items-center bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-800/30">
                  <div className="flex items-center gap-2">
                    <FaPalette className="text-purple-500 text-xs" />
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase">Arts</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{totalArts}</span>
                </div>
                <div className="flex flex-col lg:flex-row lg:justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center gap-2">
                    <FaMusic className="text-blue-500 text-xs" />
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase">Music</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{totalMusics}</span>
                </div>
                <div className="flex flex-col lg:flex-row lg:justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800/30">
                  <div className="flex items-center gap-2">
                    <FaVideo className="text-green-500 text-xs" />
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase">Videos</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{totalVideos}</span>
                </div>
                <div className="flex flex-col lg:flex-row lg:justify-between items-center bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-800/30">
                  <div className="flex items-center gap-2">
                    <FaAward className="text-amber-500 text-xs" />
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase">Events</span>
                  </div>
                  <span className="text-lg font-bold text-amber-600">{totalEvents}</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {creations[activeTab]?.length > 0 ? (
                creations[activeTab].map((item) => (
                  <MediaCard key={item._id} item={item} type={activeTab === 'arts' ? 'art' : activeTab === 'musics' ? 'music' : 'video'} view="grid" />
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
