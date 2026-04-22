"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import userApi from "@/api/users";
import { toast } from "react-toastify";
import MediaCard from "@/components/MediaCard";
import Image from "next/image";
import Link from "next/link";
import { formatImageUrl } from "@/helpers/url";
import { FaPalette, FaMusic, FaVideo, FaAward, FaCalendarAlt, FaUser, FaUserPlus, FaUserMinus, FaChevronRight, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "@/redux/notifications/notificationSlice";
import { localFollow, localUnfollow } from "@/redux/social/socialSlice";

export default function UserProfile() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { followedUserIds } = useSelector((state) => state.socialPersistence);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("arts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowModal, setShowFollowModal] = useState({ type: null, users: [] }); // type: 'followers' | 'following'

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await userApi.getUserProfile(id);
        const data = response.data;
        setProfile(data);
        
        // Robust follow detection
        if (currentUser && data.user) {
           const myId = String(currentUser._id || currentUser.id || "");
           const profileId = String(id || "");
           
           // Check both the backend array AND our local persistent bridge
           const isFollowedInBackend = data.user.followers?.some(f => {
              const fId = String(f._id || f.id || f || "");
              return fId === myId && myId !== "";
           });
           
           const isFollowedInLocalBridge = followedUserIds.includes(profileId);
           
           setIsFollowing(!!isFollowedInBackend || isFollowedInLocalBridge);
        }
        setFollowerCount(data.user.followers?.length || 0);
        setFollowingCount(data.user.following?.length || 0);
        
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("User not found or failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProfile();
  }, [id, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.info("Please login to follow users.");
      return;
    }
    try {
      const merchant = profile?.user;
      if (!merchant) return;

      // Prevent self-follow on frontend as well
      if (String(currentUser._id || currentUser.id || "") === String(id)) {
        toast.warning("You cannot follow yourself.");
        return;
      }

      if (isFollowing) {
        await userApi.unfollowUser(id);
        setIsFollowing(false);
        setFollowerCount(prev => Math.max(0, prev - 1));
        dispatch(localUnfollow(id));
        toast.success(`Unfollowed ${merchant.name || merchant.username}`);
      } else {
        await userApi.followUser(id);
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        
        // Update local bridge for persistence across navigations
        dispatch(localFollow(id));

        toast.success(`Following ${merchant.name || merchant.username}`);
      }
    } catch (error) {
      console.error("Follow action failed:", error);
      toast.error("Unable to update following status.");
    }
  };

  const openFollowList = (type) => {
    const list = type === 'followers' ? user.followers : user.following;
    setShowFollowModal({ type, users: list || [] });
  };

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
      {/* Back Button */}
      <div className="fixed top-20 left-4 md:left-8 z-50">
        <Link 
          href="/search/profiles"
          className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#1a0533]/80 backdrop-blur-md border border-purple-500/20 rounded-full text-xs font-bold text-purple-600 dark:text-purple-300 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-500/10"
        >
          <FaChevronRight size={12} className="rotate-180" />
          <span>Back to Discover</span>
        </Link>
      </div>

      {/* Header / Banner + Profile Image wrapper */}
      <div className="relative">
        {/* Cover Banner */}
        <div className="h-56 md:h-72 relative overflow-hidden">
          {user.coverImageUrl ? (
            <img
              src={user.coverImageUrl ? formatImageUrl(user.coverImageUrl) : ""}
              className="w-full h-full object-cover"
              alt={`${user.name || user.username || 'User'}'s profile cover image`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600" aria-hidden="true" />
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
                alt={user.name || user.username || "Profile picture"}
                fill
                priority
                loading="eager"
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
              <p className="text-gray-500 text-sm mb-3">@{user.username || "artist"}</p>
              
              {/* Follow Stats & Action - Consolidated for clarity and visibility */}
              <div className="flex items-center gap-6 border-y border-gray-100 dark:border-slate-700/50 py-5 my-6">
                <button onClick={() => openFollowList('followers')} className="group text-center flex-1 transition-all hover:scale-110 active:scale-95 outline-none border-none bg-transparent">
                   <div className="text-xl font-black text-purple-600 dark:text-purple-400">{followerCount}</div>
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-purple-500">Followers</div>
                </button>
                <div className="h-8 w-px bg-gray-100 dark:bg-slate-700/50"></div>
                <button onClick={() => openFollowList('following')} className="group text-center flex-1 transition-all hover:scale-110 active:scale-95 outline-none border-none bg-transparent">
                   <div className="text-xl font-black text-blue-600 dark:text-blue-400">{followingCount}</div>
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500">Following</div>
                </button>
              </div>

              {(!currentUser || String(currentUser._id || currentUser.id || "") !== String(id)) && (
                <button
                  onClick={handleFollowToggle}
                  className={`w-3/4 mx-auto py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-md ${
                    isFollowing 
                      ? "bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-200 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/40 dark:hover:to-red-900/20 hover:text-red-600 dark:hover:text-red-400 border border-slate-300 dark:border-slate-600" 
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/30 border border-purple-500/20"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <FaUserMinus size={14} className="opacity-80" /> <span className="tracking-wide uppercase letter-spacing-wide">Unfollow</span>
                    </>
                  ) : (
                    <>
                      <FaUserPlus size={14} className="animate-pulse" /> <span className="tracking-wide uppercase letter-spacing-wide">Follow Artist</span>
                    </>
                  )}
                </button>
              )}
              {user.bio && (
                <p className="text-gray-600 dark:text-gray-300 text-sm my-6 leading-relaxed">
                  {user.bio}
                </p>
              )}

              <div className="flex items-center gap-2 text-gray-400 text-xs mb-6 px-1">
                <FaCalendarAlt className="text-purple-500/50" />
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

      {/* Follow Modal */}
      {showFollowModal.type && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowFollowModal({ type: null, users: [] })} />
          <div className="relative w-full max-w-sm bg-[#1a0533] border border-purple-800/20 rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="px-6 py-5 border-b border-purple-900/30 flex items-center justify-between">
                <h3 className="text-white font-bold text-lg capitalize">{showFollowModal.type}</h3>
                <button onClick={() => setShowFollowModal({ type: null, users: [] })} className="p-2 text-purple-400 hover:text-red-400 transition-colors">
                  <FaTimes />
                </button>
             </div>
             <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-purple-900">
                {showFollowModal.users.length > 0 ? (
                  showFollowModal.users.map((f) => {
                    const isPopulated = typeof f === 'object' && f !== null;
                    const uId = isPopulated ? (f._id || f.id) : f;
                    const uName = isPopulated ? (f.name || f.username || "Merchant") : "User";
                    const uHandle = isPopulated ? (f.username || "social") : "user";
                    const uPic = isPopulated ? f.profileImageUrl : null;

                    return (
                      <Link 
                        key={uId} 
                        href={`/profile/${uId}`}
                        onClick={() => setShowFollowModal({ type: null, users: [] })}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-purple-800/10 transition-colors group"
                      >
                         <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center font-bold text-purple-400 text-xs shadow-inner overflow-hidden">
                            {uPic ? (
                              <img src={formatImageUrl(uPic)} className="w-full h-full object-cover" alt={uName} />
                            ) : (
                              uName.charAt(0).toUpperCase()
                            )}
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="text-white font-bold text-sm truncate group-hover:text-purple-300">{uName}</div>
                            <div className="text-purple-400/50 text-[10px] tracking-widest font-bold uppercase truncate">@{uHandle}</div>
                         </div>
                         <FaChevronRight size={12} className="text-purple-500/30 group-hover:text-purple-400 flex-shrink-0" />
                      </Link>
                    );
                  })
                ) : (
                  <div className="py-20 text-center text-purple-400/30 text-sm">No {showFollowModal.type} yet.</div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
