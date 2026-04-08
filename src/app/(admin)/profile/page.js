"use client";

import { updateUserProfile } from "@/redux/auth/authActions";
import { logoutUser } from "@/redux/auth/authSlice";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { resetSuccess } from "@/redux/auth/authSlice";
import ProfileImage from "./_components/ProfileImage";
import api from "@/api/users";
import eventsApi from "@/api/events";
import { DASHBOARD_ROUTE } from "@/constants/routes";
import CoverImage from "./_components/CoverImage";
import { 
  formatImageUrl 
} from "../../../helpers/url";
import {
  ART_MANAGEMENT_ROUTE,
  MUSIC_MANAGEMENT_ROUTE, 
  VIDEO_MANAGEMENT_ROUTE,
  EVENT_MANAGEMENT_ROUTE
} from "@/constants/routes";
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
  FaArrowLeft,
  FaExternalLinkAlt,
  FaTrophy,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaMedal,
  FaChevronRight,
  FaTimes,
  FaUsers
} from "react-icons/fa";
import apiInstance from "@/api/api";
import { format } from "date-fns";

const VideoThumb = ({ vid, formatImageUrl, setActiveDropdown, activeDropdown, handleDeleteItem, handleEditItem }) => {
  const videoRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const vidImage = vid.imageUrls?.[0] || vid.image || vid.thumbnail;
  const vidVideo = vid.videoUrls?.[0] || (typeof vid.media === 'string' ? vid.media : null);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log("Playback failed", err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      key={vid._id} 
      className="group relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 dark:border-slate-700"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {vidVideo ? (
        <video 
          ref={videoRef}
          src={formatImageUrl(vidVideo)}
          poster={vidImage ? formatImageUrl(vidImage) : undefined}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          muted
          playsInline
          loop
          autoPlay={vid.hide === false || vid.hide === 'false'}
        />
      ) : vidImage ? (
        <img 
          src={formatImageUrl(vidImage)} 
          alt={vid.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-slate-800 group-hover:scale-105 transition-transform duration-500">
          <FaVideo className="text-gray-400 text-4xl" />
        </div>
      )}
      
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveDropdown(activeDropdown === `video-${vid._id}` ? null : `video-${vid._id}`); }}
        className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/60"
      >
        <FaEllipsisV className="text-xs" />
      </button>
      {activeDropdown === `video-${vid._id}` && (
        <div className="absolute top-12 right-4 w-32 bg-white dark:bg-[#160327] rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 py-1 z-30 overflow-hidden">
          <button onClick={(e) => handleEditItem('video', vid._id, e)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-left"><FaEdit/> Edit</button>
          <button onClick={(e) => handleDeleteItem('video', vid._id, e)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"><FaTrash/> Delete</button>
        </div>
      )}

      <Link href={`/video/detail/${vid._id}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end z-10 cursor-pointer">
          <p className="text-white font-bold text-lg">{vid.title}</p>
          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest flex items-center gap-2"><FaVideo /> Watch Now</p>
        </div>
      </Link>
    </div>
  );
};

const MusicTrack = ({ music, formatImageUrl, setActiveDropdown, activeDropdown, handleDeleteItem, handleEditItem }) => {
  const musicRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const musicImage = music.imageUrls?.[0] || music.image || music.thumbnail;
  const musicMedia = music.videoUrls?.[0] || music.audioUrls?.[0] || (typeof music.media === 'string' ? music.media : null);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (musicRef.current) {
      musicRef.current.play().catch(err => console.log("Playback failed", err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      key={music._id} 
      className="group relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 dark:border-slate-700"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {musicMedia ? (
        <video 
          ref={musicRef}
          src={formatImageUrl(musicMedia)}
          poster={musicImage ? formatImageUrl(musicImage) : undefined}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          muted
          playsInline
          loop
          autoPlay={isHovering || music.hide === false || music.hide === 'false'}
        />
      ) : musicImage ? (
        <img 
          src={formatImageUrl(musicImage)} 
          alt={music.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-slate-800 group-hover:scale-105 transition-transform duration-500">
          <FaMusic className="text-gray-400 text-4xl" />
        </div>
      )}
      
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveDropdown(activeDropdown === `music-${music._id}` ? null : `music-${music._id}`); }}
        className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/60"
      >
        <FaEllipsisV className="text-xs" />
      </button>
      {activeDropdown === `music-${music._id}` && (
        <div className="absolute top-12 right-4 w-32 bg-white dark:bg-[#160327] rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 py-1 z-30 overflow-hidden">
          <button onClick={(e) => handleEditItem('music', music._id, e)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-left"><FaEdit/> Edit</button>
          <button onClick={(e) => handleDeleteItem('music', music._id, e)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"><FaTrash/> Delete</button>
        </div>
      )}

      <Link href={`/music/detail/${music._id}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end z-10 cursor-pointer pointer-events-auto">
          <p className="text-white font-bold text-lg">{music.title}</p>
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest flex items-center gap-2"><FaMusic /> Listen Now</p>
        </div>
      </Link>
    </div>
  );
};

const ProfilePage = () => {
  const { error, loading, user, success } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState(null);
  const [creations, setCreations] = useState({ arts: [], musics: [], videos: [], events: [] });
  const [registrations, setRegistrations] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [fullProfile, setFullProfile] = useState(null);
  const [showFollowModal, setShowFollowModal] = useState({ type: null, users: [] });
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDeleteItem = async (type, id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) return;
    try {
      if (type === 'art') {
        await apiInstance.delete(`/api/arts/${id}`);
        setCreations(prev => ({ ...prev, arts: prev.arts.filter(item => item._id !== id) }));
      } else if (type === 'music') {
         await apiInstance.delete(`/api/music/${id}`);
         setCreations(prev => ({ ...prev, musics: prev.musics.filter(item => item._id !== id) }));
      } else if (type === 'video') {
         await apiInstance.delete(`/api/video/${id}`);
         setCreations(prev => ({ ...prev, videos: prev.videos.filter(item => item._id !== id) }));
      } else if (type === 'event') {
         await apiInstance.delete(`/api/events/${id}`);
         setCreations(prev => ({ ...prev, events: prev.events.filter(item => item._id !== id) }));
      }
      toast.success(`${type} deleted successfully.`);
    } catch (err) {
      toast.error(`Failed to delete ${type}.`);
    }
  };

  const handleEditItem = (type, id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const routes = {
      art: ART_MANAGEMENT_ROUTE,
      music: MUSIC_MANAGEMENT_ROUTE,
      video: VIDEO_MANAGEMENT_ROUTE,
      event: EVENT_MANAGEMENT_ROUTE
    };
    const baseRoute = routes[type] || `/${type}-management`;
    // Use router.push instead of window.location.href for better SPA experience
    router.push(`${baseRoute}/edit/${id}`);
    setActiveDropdown(null);
  };

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
          setFullProfile(profileRes.data.user);
          setRegistrations(regRes.data);
        } catch (err) {
          console.error("Failed to load profile data", err);
        }
      }
    }
    fetchData();
  }, [user?._id]);

  const openFollowList = (type) => {
    if (!fullProfile) return;
    const list = type === 'followers' ? fullProfile.followers : fullProfile.following;
    setShowFollowModal({ type, users: list || [] });
  };

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

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.");
    if (!confirm) return;

    try {
      await api.deleteUser(user._id);
      toast.success("Account deleted successfully.");
      dispatch(logoutUser());
      router.push("/");
    } catch (err) {
      console.error("Failed to delete account:", err);
      toast.error("Failed to delete account. Please try again.");
    }
  };

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
                    <Link href={DASHBOARD_ROUTE} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-200 transition group">
                      <FaChartLine className="text-green-600 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-sm">Dashboard</span>
                    </Link>
                    <button
                      onClick={() => { setShowSettings(false); handleDeleteAccount(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition group border-t border-gray-100 dark:border-slate-700 mt-1"
                    >
                      <FaTrash className="group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-sm">Delete Account</span>
                    </button>
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
                <h1 className="text-4xl font-semibold text-black dark:text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                  {user?.username || user?.name}
                  {user?.roles?.some(role => ["ADMIN", "MERCHANT", "CREATOR", "VENDOR"].includes(role.toUpperCase())) && (
                    <span className="p-1 bg-blue-500 rounded-full text-white shadow-lg shadow-blue-200" title="Verified Creator">
                       <FaCheckCircle className="text-[10px]" />
                    </span>
                  )}
                </h1>
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

                {/* Follow Stats */}
                <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                  <button onClick={() => openFollowList('followers')} className="group text-center flex flex-col items-center gap-1 transition-all hover:scale-105 active:scale-95 outline-none border-none">
                     <span className="text-xl font-black text-purple-600 dark:text-purple-400 leading-none">{fullProfile?.followers?.length || 0}</span>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-purple-500">Followers</span>
                  </button>
                  <div className="w-px h-8 bg-gray-200 dark:bg-slate-700"></div>
                  <button onClick={() => openFollowList('following')} className="group text-center flex flex-col items-center gap-1 transition-all hover:scale-105 active:scale-95 outline-none border-none">
                     <span className="text-xl font-black text-blue-600 dark:text-blue-400 leading-none">{fullProfile?.following?.length || 0}</span>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500">Following</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Removed Tab Navigation as requested - access via Quick Settings Icon */}
          <div className="p-0 border-b border-gray-100 dark:border-slate-700"></div>

          {/* Tab Content */}
          <div className="p-8 sm:p-10">
            {activeTab === "overview" ? (
              <div>
                <section className="mb-8">
                  <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white mb-4">
                    <FaInfoCircle className="text-purple-600" /> Biography
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-[#160327]/30 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 italic">
                    "{user?.bio || "No biography shared yet. This user is a mystery!"}"
                  </p>
                </section>



                {/* My Creative Portfolio */}
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="flex items-center gap-2 text-2xl font-semibold text-black dark:text-white">
                        <FaPalette className="text-purple-600" /> My Collections
                     </h3>
                  </div>

                  <div className="space-y-8">
                    {/* Arts Section */}
                    {creations.arts?.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Featured Arts</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {creations.arts.map((art) => {
                            const artImage = art.imageUrls?.[0] || art.image || art.thumbnail;
                            return (
                              <div key={art._id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 dark:border-slate-700">
                                {artImage ? (
                                  <img 
                                    src={formatImageUrl(artImage)} 
                                    alt={art.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-slate-800 group-hover:scale-110 transition-transform duration-500">
                                    <FaPalette className="text-gray-400 text-4xl" />
                                  </div>
                                )}
                                
                                <button 
                                  onClick={(e) => { e.preventDefault(); setActiveDropdown(activeDropdown === `art-${art._id}` ? null : `art-${art._id}`); }}
                                  className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/60"
                                >
                                  <FaEllipsisV className="text-xs" />
                                </button>
                                {activeDropdown === `art-${art._id}` && (
                                  <div className="absolute top-10 right-2 w-32 bg-white dark:bg-[#160327] rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 py-1 z-30 overflow-hidden">
                                    <button onClick={(e) => handleEditItem('art', art._id, e)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-left"><FaEdit/> Edit</button>
                                    <button onClick={(e) => handleDeleteItem('art', art._id, e)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"><FaTrash/> Delete</button>
                                  </div>
                                )}

                                <Link href={`/arts/${art._id || art.id}`}>
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 z-10 cursor-pointer pointer-events-auto">
                                    <p className="text-white font-bold text-sm truncate">{art.title}</p>
                                    <p className="text-purple-300 text-[10px] font-semibold uppercase">View Details →</p>
                                  </div>
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Music Section */}
                    {creations.musics?.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Music Library</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {creations.musics.map((music) => (
                            <MusicTrack 
                              key={music._id}
                              music={music}
                              formatImageUrl={formatImageUrl}
                              setActiveDropdown={setActiveDropdown}
                              activeDropdown={activeDropdown}
                              handleDeleteItem={handleDeleteItem}
                              handleEditItem={handleEditItem}
                            />
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
                            <VideoThumb 
                              key={vid._id}
                              vid={vid}
                              formatImageUrl={formatImageUrl}
                              setActiveDropdown={setActiveDropdown}
                              activeDropdown={activeDropdown}
                              handleDeleteItem={handleDeleteItem}
                              handleEditItem={handleEditItem}
                            />
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
                              
                              <div className="absolute bottom-6 right-6 z-20">
                                <button 
                                  onClick={() => setActiveDropdown(activeDropdown === `event-${evt._id}` ? null : `event-${evt._id}`)}
                                  className="p-3 bg-white dark:bg-[#160327] border border-gray-100 dark:border-slate-600 shadow-sm text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-50 transition"
                                >
                                  <FaEllipsisV className="text-sm" />
                                </button>
                                {activeDropdown === `event-${evt._id}` && (
                                  <div className="absolute bottom-12 right-0 w-32 bg-white dark:bg-[#160327] rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 py-1 z-30 overflow-hidden mb-2">
                                    <button onClick={(e) => handleEditItem('event', evt._id, e)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-left"><FaEdit/> Edit</button>
                                    <button onClick={(e) => handleDeleteItem('event', evt._id, e)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"><FaTrash/> Delete</button>
                                  </div>
                                )}
                              </div>

                              <h5 className="text-xl font-semibold text-black dark:text-white mb-2 pr-12 leading-tight">{evt.title}</h5>
                              <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-4">
                                <span className="flex items-center gap-1"><FaCalendarAlt className="text-purple-500" /> {format(new Date(evt.startDate), 'MMM dd')}</span>
                                <span className="flex items-center gap-1"><FaTrophy className="text-amber-500" /> {evt.prizePool}</span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{evt.description}</p>
                              <Link href={`/events/${evt._id}`} className="text-xs font-semibold text-purple-600 uppercase tracking-widest hover:text-purple-800 transition-colors">Manage Event →</Link>
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
                        <Link 
                          key={reg._id} 
                          href={`/events/${reg.eventId?._id}`}
                          className="group relative bg-white dark:bg-[#160327] p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 block cursor-pointer"
                        >
                          <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                              <FaCalendarAlt className="text-purple-600 text-2xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-semibold uppercase tracking-widest rounded-full">
                                    {reg.status}
                                  </span>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{reg.eventId?.eventType}</span>
                               </div>
                               <h4 className="text-lg font-semibold text-black dark:text-white truncate group-hover:text-purple-600 transition-colors">{reg.eventId?.title}</h4>
                               <p className="text-sm text-gray-500 font-medium mt-1">Starts: {reg.eventId?.startDate ? format(new Date(reg.eventId.startDate), 'MMM dd, yyyy') : 'TBD'}</p>
                               <p className="text-xs text-purple-600 font-bold uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">View Details <FaArrowLeft className="rotate-180" /></p>
                            </div>
                          </div>
                        </Link>
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

                {/* Danger Zone */}
                <div className="mt-20 pt-10 border-t-2 border-dashed border-red-100 dark:border-red-900/20">
                   <div className="bg-red-50 dark:bg-red-950/10 rounded-[2.5rem] p-8 md:p-10 border border-red-100 dark:border-red-900/20">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                         <div className="text-center md:text-left">
                            <h4 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h4>
                            <p className="text-sm text-red-500/70 font-medium max-w-md">Once you delete your account, there is no going back. All your arts, music, and videos will be removed from the Aether arena.</p>
                         </div>
                         <button 
                            onClick={handleDeleteAccount}
                            className="px-8 py-4 bg-white dark:bg-red-950/20 border-2 border-red-600 text-red-600 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-600/10 active:scale-95 uppercase tracking-widest text-xs"
                         >
                            Delete My Account
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            )}
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
                    // Check if f is populated or just an ID
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
    </section>
  );
};

export default ProfilePage;