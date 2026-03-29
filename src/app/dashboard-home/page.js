"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { FaChartBar, FaHeart, FaPlay, FaImage, FaMusic, FaVideo, FaTrophy, FaArrowRight } from "react-icons/fa";
import artsAPI from "@/api/arts";
import musicAPI from "@/api/music";
import videoAPI from "@/api/video";

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
        const [artsRes, musicRes, videosRes] = await Promise.all([
          artsAPI.getArt(query),
          musicAPI.getMusic(query),
          videoAPI.getVideo(query)
        ]);

        const allArts = Array.isArray(artsRes.data) ? artsRes.data : (artsRes.data?.arts || []);
        const allMusic = Array.isArray(musicRes.data) ? musicRes.data : (musicRes.data?.music || []);
        const allVideos = Array.isArray(videosRes.data) ? videosRes.data : (videosRes.data?.videos || []);

        const arts = allArts.filter(a => a.merchant?._id === user._id || a.merchant === user._id);
        const music = allMusic.filter(m => m.merchant?._id === user._id || m.merchant === user._id);
        const videos = allVideos.filter(v => v.merchant?._id === user._id || v.merchant === user._id);

        setStats({
          totalArts: arts.length,
          totalMusic: music.length,
          totalVideos: videos.length,
          totalLikes: arts.reduce((sum, art) => sum + (art.likes || 0), 0) +
                      music.reduce((sum, m) => sum + (m.likes || 0), 0) +
                      videos.reduce((sum, v) => sum + (v.likes || 0), 0),
          totalViews: arts.reduce((sum, art) => sum + (art.views || 0), 0) +
                      music.reduce((sum, m) => sum + (m.views || 0), 0) +
                      videos.reduce((sum, v) => sum + (v.views || 0), 0),
        });

        setContentBreakdown({
          arts: arts.length,
          music: music.length,
          videos: videos.length,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {/* Badge */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 text-center">
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
        </div>

        {/* Content Breakdown */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-6">Content Breakdown</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Arts */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FaImage className="text-purple-600" />
                <span className="font-semibold">Arts</span>
                <span className="text-sm text-gray-600">({stats.totalArts})</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${artsPercent}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{artsPercent}% of content</p>
            </div>

            {/* Music */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FaMusic className="text-blue-600" />
                <span className="font-semibold">Music</span>
                <span className="text-sm text-gray-600">({stats.totalMusic})</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${musicPercent}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{musicPercent}% of content</p>
            </div>

            {/* Videos */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FaVideo className="text-green-600" />
                <span className="font-semibold">Videos</span>
                <span className="text-sm text-gray-600">({stats.totalVideos})</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${videosPercent}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{videosPercent}% of content</p>
            </div>
          </div>
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