"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { FaChartBar, FaHeart, FaPlay, FaImage, FaMusic, FaVideo, FaTrophy, FaArrowRight } from "react-icons/fa";
import artsAPI from "@/api/arts";
import musicAPI from "@/api/music";
import videoAPI from "@/api/video";
import usersAPI from "@/api/users";
import { FaUserFriends, FaUserCheck } from "react-icons/fa";

const DashboardHome = () => {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const [stats, setStats] = useState({
    totalArts: 0,
    totalMusic: 0,
    totalVideos: 0,
    totalLikes: 0,
    totalViews: 0,
    followersCount: 0,
    followingCount: 0,
  });

  const [contentBreakdown, setContentBreakdown] = useState({
    arts: 0,
    music: 0,
    videos: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) return;
      try {
        const query = { merchant: user._id };
        const [artsRes, musicRes, videosRes, profileRes] = await Promise.all([
          artsAPI.getArt(query),
          musicAPI.getMusic(query),
          videoAPI.getVideo(query),
          usersAPI.getUserProfile(user._id)
        ]);

        const allArts = Array.isArray(artsRes.data) ? artsRes.data : (artsRes.data?.arts || []);
        const allMusic = Array.isArray(musicRes.data) ? musicRes.data : (musicRes.data?.music || []);
        const allVideos = Array.isArray(videosRes.data) ? videosRes.data : (videosRes.data?.videos || []);
        
        const userData = profileRes?.data?.user || {};

        const arts = allArts.filter(a => a.merchant?._id === user._id || a.merchant === user._id);
        const music = allMusic.filter(m => m.merchant?._id === user._id || m.merchant === user._id);
        const videos = allVideos.filter(v => v.merchant?._id === user._id || v.merchant === user._id);

        setStats({
          totalArts: Math.max(0, arts.length),
          totalMusic: Math.max(0, music.length),
          totalVideos: Math.max(0, videos.length),
          totalLikes: Math.max(0,
            arts.reduce((sum, art) => sum + Math.max(0, art.likes || 0), 0) +
            music.reduce((sum, m) => sum + Math.max(0, m.likes || 0), 0) +
            videos.reduce((sum, v) => sum + Math.max(0, v.likes || 0), 0)
          ),
          totalViews: Math.max(0,
            arts.reduce((sum, art) => sum + Math.max(0, art.views || 0), 0) +
            music.reduce((sum, m) => sum + Math.max(0, m.views || 0), 0) +
            videos.reduce((sum, v) => sum + Math.max(0, v.views || 0), 0)
          ),
          followersCount: userData.followers?.length || 0,
          followingCount: userData.following?.length || 0,
        });

        setContentBreakdown({
          arts: Math.max(0, arts.length),
          music: Math.max(0, music.length),
          videos: Math.max(0, videos.length),
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, [user]);

  const totalContent = contentBreakdown.arts + contentBreakdown.music + contentBreakdown.videos;
  const artsPercent = totalContent > 0 ? Math.round((contentBreakdown.arts / totalContent) * 100) : 0;
  const musicPercent = totalContent > 0 ? Math.round((contentBreakdown.music / totalContent) * 100) : 0;
  const videosPercent = totalContent > 0 ? Math.round((contentBreakdown.videos / totalContent) * 100) : 0;

  const getBadge = () => {
    if (stats.totalArts + stats.totalMusic + stats.totalVideos === 0) return "Just Started";
    if (stats.totalLikes > 100) return "Super Star ⭐⭐⭐";
    if (stats.totalLikes > 50) return "Rising Star 🌟";
    if (stats.totalLikes > 20) return "Popular 👍";
    return "Newbie 🌱";
  };

  if (!isAuthenticated) {
    return <div className="text-center py-20">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 sm:py-10" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome back, Creator! 👋</h1>
          <p className="text-gray-600">Here is your performance overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-10">
          {/* Badge */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 text-center xl:col-span-1">
            <div className="text-3xl mb-2">{getBadge().split(" ")[getBadge().split(" ").length - 1]}</div>
            <p className="text-sm font-semibold text-purple-900">{getBadge().split(" ").slice(0, -1).join(" ")}</p>
            <p className="text-xs text-gray-600 mt-2">{stats.totalLikes} total likes</p>
          </div>

          {/* Total Content */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaChartBar className="text-blue-600 text-xl" />
              <span className="text-2xl font-bold text-blue-600">{totalContent}</span>
            </div>
            <p className="text-sm font-semibold text-blue-900">Total Content</p>
            <p className="text-xs text-gray-600 mt-1">Arts, Music & Videos</p>
          </div>

          {/* Total Likes */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaHeart className="text-red-600 text-xl" />
              <span className="text-2xl font-bold text-red-600">{stats.totalLikes}</span>
            </div>
            <p className="text-sm font-semibold text-red-900">Total Likes</p>
            <p className="text-xs text-gray-600 mt-1">Community love</p>
          </div>

          {/* Total Views */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaPlay className="text-green-600 text-xl" />
              <span className="text-2xl font-bold text-green-600">{stats.totalViews}</span>
            </div>
            <p className="text-sm font-semibold text-green-900">Total Views</p>
            <p className="text-xs text-gray-600 mt-1">Content reach</p>
          </div>

          {/* User Level */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaTrophy className="text-yellow-600 text-xl" />
              <span className="text-2xl font-bold text-yellow-600">L{Math.floor(stats.totalLikes / 10) + 1}</span>
            </div>
            <p className="text-sm font-semibold text-yellow-900">Creator Level</p>
            <p className="text-xs text-gray-600 mt-1">Keep creating!</p>
          </div>

          {/* Followers */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaUserFriends className="text-indigo-600 text-xl" />
              <span className="text-2xl font-bold text-indigo-600">{stats.followersCount}</span>
            </div>
            <p className="text-sm font-semibold text-indigo-900">Followers</p>
            <p className="text-xs text-gray-600 mt-1">Your community</p>
          </div>

          {/* Following */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaUserCheck className="text-teal-600 text-xl" />
              <span className="text-2xl font-bold text-teal-600">{stats.followingCount}</span>
            </div>
            <p className="text-sm font-semibold text-teal-900">Following</p>
            <p className="text-xs text-gray-600 mt-1">Creators you love</p>
          </div>
        </div>

        {/* Content Breakdown */}
        <div className="bg-white dark:bg-[#160327] border border-gray-100 dark:border-slate-700 rounded-2xl p-8 mb-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Content Breakdown</h2>
              <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">Distribution across all content types</p>
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              {totalContent} <span className="text-sm font-bold text-gray-400">total</span>
            </span>
          </div>

          {/* 0 - 100 Scale Header */}
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest mb-3 px-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          {/* Scale tick marks */}
          <div className="relative h-1 bg-gray-100 dark:bg-slate-800 rounded-full mb-8">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-300 dark:bg-slate-600 rounded-full"></div>
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-300 dark:bg-slate-600 rounded-full"></div>
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-300 dark:bg-slate-600 rounded-full"></div>
            <div className="absolute left-3/4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-300 dark:bg-slate-600 rounded-full"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-300 dark:bg-slate-600 rounded-full"></div>
          </div>

          <div className="space-y-6">
            {/* Arts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FaImage className="text-purple-500 text-sm" />
                  <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Visual Arts</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400">{stats.totalArts} piece{stats.totalArts !== 1 ? 's' : ''}</span>
                  <span className="text-sm font-black text-purple-600 w-12 text-right">{artsPercent}%</span>
                </div>
              </div>
              <div className="relative bg-gray-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-700 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${Math.max(artsPercent, 0)}%`, minWidth: artsPercent > 0 ? '2rem' : '0' }}
                >
                  {artsPercent >= 10 && <span className="text-[9px] font-black text-white">{artsPercent}%</span>}
                </div>
              </div>
            </div>

            {/* Music */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FaMusic className="text-blue-500 text-sm" />
                  <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Music Tracks</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400">{stats.totalMusic} track{stats.totalMusic !== 1 ? 's' : ''}</span>
                  <span className="text-sm font-black text-blue-600 w-12 text-right">{musicPercent}%</span>
                </div>
              </div>
              <div className="relative bg-gray-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-700 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${Math.max(musicPercent, 0)}%`, minWidth: musicPercent > 0 ? '2rem' : '0' }}
                >
                  {musicPercent >= 10 && <span className="text-[9px] font-black text-white">{musicPercent}%</span>}
                </div>
              </div>
            </div>

            {/* Videos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FaVideo className="text-green-500 text-sm" />
                  <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Videos</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400">{stats.totalVideos} video{stats.totalVideos !== 1 ? 's' : ''}</span>
                  <span className="text-sm font-black text-green-600 w-12 text-right">{videosPercent}%</span>
                </div>
              </div>
              <div className="relative bg-gray-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-green-500 to-green-700 transition-all duration-700 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${Math.max(videosPercent, 0)}%`, minWidth: videosPercent > 0 ? '2rem' : '0' }}
                >
                  {videosPercent >= 10 && <span className="text-[9px] font-black text-white">{videosPercent}%</span>}
                </div>
              </div>
            </div>
          </div>

          {totalContent === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm font-medium italic">
              No content yet — start creating to see your breakdown!
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Manage Arts */}
            <Link
              href="/management/arts"
              className="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-3">
                <FaImage className="text-purple-600 text-2xl" />
                <FaArrowRight className="text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Manage Arts</h3>
              <p className="text-xs text-gray-600">Add, edit, delete arts</p>
            </Link>

            {/* Manage Music */}
            <Link
              href="/management/music"
              className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-3">
                <FaMusic className="text-blue-600 text-2xl" />
                <FaArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Manage Music</h3>
              <p className="text-xs text-gray-600">Upload your songs</p>
            </Link>

            {/* Manage Videos */}
            <Link
              href="/management/videos"
              className="bg-green-50 border border-green-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-3">
                <FaVideo className="text-green-600 text-2xl" />
                <FaArrowRight className="text-green-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Manage Videos</h3>
              <p className="text-xs text-gray-600">Create & share videos</p>
            </Link>

            {/* View Orders */}
            <Link
              href="/order-status"
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-3">
                <FaTrophy className="text-yellow-600 text-2xl" />
                <FaArrowRight className="text-yellow-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-sm mb-1">View Orders</h3>
              <p className="text-xs text-gray-600">Track your sales</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;