"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { 
  FaCalendarAlt, 
  FaTrophy, 
  FaUsers, 
  FaArrowLeft,
  FaTimes,
  FaClock,
  FaMapMarkerAlt,
  FaUserAlt,
  FaRocket,
  FaShareAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaBullhorn
} from 'react-icons/fa';
import eventsApi from '@/api/events';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { formatImageUrl } from '@/helpers/url';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/notifications/notificationSlice';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = params;
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    if (user) {
      setRegData(prev => ({
        ...prev,
        name: user.name || user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'TBD';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return 'TBD';
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        // Attempt direct fetch
        const response = await eventsApi.getEventById(id);
        if (response?.data) {
          setEvent(response.data);
        } else {
          // Fallback if data is missing
          throw new Error("No data returned");
        }
      } catch (error) {
        console.warn("Direct fetch failed, attempting fallback...", error);
        try {
          // Fallback: Fetch all events and filter by ID
          // This helps if the GET /api/events/:id endpoint is missing or returns 404 incorrectly
          const allEventsRes = await eventsApi.getEvents();
          const foundEvent = allEventsRes.data.find(e => e._id === id || e.id === id);
          
          if (foundEvent) {
             setEvent(foundEvent);
          } else {
             setNotFound(true);
          }
        } catch (fallbackError) {
          console.error("Fallback also failed", fallbackError);
          if (error.response?.status === 404) {
            setNotFound(true);
          } else {
            toast.error("Failed to load event details.");
            router.push('/events');
          }
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id, router]);

  const refreshEvent = async () => {
    try {
      const response = await eventsApi.getEventById(id);
      if (response?.data) {
        setEvent(response.data);
      }
    } catch (error) {
      console.error("Failed to refresh event:", error);
    }
  };

  const handleRegisterEvent = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning("Please login to register.");
      router.push('/login');
      return;
    }

    try {
      await eventsApi.registerForEvent({
        eventId: event._id,
        ...regData
      });
      toast.success("Successfully registered for the event!");

      // Automatic Community Notification
      dispatch(addNotification({
        id: `event-reg-${event._id}-${Date.now()}`,
        type: "event",
        title: "Community Update!",
        message: `${user.name || user.username} just claimed a spot in the showdown: "${event.title}"!`,
        fromProjectUser: true,
        projectName: event.title,
        link: `/events/${event._id}`
      }));

      setShowRegisterModal(false);
      refreshEvent();
      setRegData({ name: user?.name || user?.username || '', email: user?.email || '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d0118]">
        <div className="relative">
           <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
           </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0d0118] px-4 text-center">
        <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
           <FaTimes className="text-4xl text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Showdown Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-10 text-lg leading-relaxed">
          The competition you're looking for might have vanished into the Aether.
        </p>
        <Link 
          href="/events"
          className="px-10 py-4 bg-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-600/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <FaArrowLeft /> Explore Other Showdowns
        </Link>
      </div>
    );
  }

  if (!event) return null;

  const isAlreadyRegistered = isAuthenticated && user && event?.registrations?.some(
    reg => reg.userId === user._id || reg.userId?._id === user._id || reg.userId === user.id || reg.userId?._id === user.id
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0118] pb-24 selection:bg-purple-500 selection:text-white">
      {/* Immersive Hero Header */}
      <section className="relative w-full min-h-[500px] flex items-end pt-32 pb-16 overflow-hidden">
        {/* Main Cover Image */}
        {event.image ? (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={formatImageUrl(event.image)} 
              alt={event.title}
              className="w-full h-full object-cover" 
            />
            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0d0118] via-[#0d0118]/40 to-transparent"></div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 dark:opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0d0118] via-transparent to-transparent"></div>
          </>
        )}
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <Link 
            href="/events" 
            className="group inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-8 transition-all font-bold text-sm bg-white/50 dark:bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full border border-gray-100 dark:border-white/10"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Arena
          </Link>

          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-5 py-1.5 bg-purple-600 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg shadow-purple-600/20">
                  {event.eventType}
                </span>
                <span className="px-5 py-1.5 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-full uppercase tracking-[0.2em] flex items-center gap-2">
                  <FaRocket className="animate-bounce" /> Live & Active
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-8 text-gray-600 dark:text-gray-300 font-bold uppercase text-[11px] tracking-widest">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center border border-purple-100 dark:border-purple-800">
                    <FaCalendarAlt className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-400 leading-none mb-1">Registration Opens</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(event.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-800">
                    <FaClock className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-400 leading-none mb-1">Final Submission</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(event.endDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto shrink-0">
               <button 
                onClick={() => !isAlreadyRegistered && setShowRegisterModal(true)}
                disabled={isAlreadyRegistered}
                className={`w-full lg:w-auto px-12 py-5 font-black rounded-[2rem] uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${isAlreadyRegistered ? 'bg-green-500 text-white cursor-not-allowed shadow-none' : 'bg-purple-600 text-white shadow-2xl shadow-purple-600/30 hover:bg-purple-700 hover:scale-[1.03] active:scale-95 group'}`}
              >
                {isAlreadyRegistered ? (
                  <>You Are Registered <FaCheckCircle className="text-white" /></>
                ) : (
                  <>Claim Your Spot <FaArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Layout */}
      <div className="container mx-auto px-4 max-w-7xl mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Info */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white dark:bg-[#160327]/40 rounded-[3rem] p-8 md:p-14 shadow-sm border border-gray-100 dark:border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-1 bg-purple-600 rounded-full"></div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Competition Roadmap</h2>
              </div>
              <div className="prose prose-purple dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-loose text-lg font-medium whitespace-pre-wrap">
                {event.description}
              </div>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                  <FaInfoCircle className="text-purple-600 text-2xl mb-4" />
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Rules & Ethics</h4>
                  <p className="text-sm text-gray-500 font-medium">All submissions must be original work. Collaboration is allowed only where explicitly stated.</p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                  <FaCheckCircle className="text-green-500 text-2xl mb-4" />
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Selection Process</h4>
                  <p className="text-sm text-gray-500 font-medium">Entries will be judged by community legends and industry experts based on creativity and execution.</p>
                </div>
              </div>
            </div>

            {/* Registered Warriors Section */}
            {event.registrations?.length > 0 && (
                <div className="bg-white dark:bg-[#160327]/40 rounded-[3rem] p-8 md:p-14 shadow-sm border border-gray-100 dark:border-white/5 backdrop-blur-sm mt-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-1 bg-blue-600 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Registered Warriors</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {event.registrations.map((reg, idx) => (
                      <div key={idx} className="flex flex-col items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 group hover:bg-white dark:hover:bg-white/10 transition-all">
                        <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center bg-primary/10 text-primary font-black text-sm mb-3 group-hover:scale-110 transition-transform">
                          {reg.name?.charAt(0).toUpperCase() || 'W'}
                        </div>
                        <p className="text-xs font-bold text-gray-800 dark:text-white text-center line-clamp-1">{reg.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">Warrior</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
             {/* Prize Pool Card */}
            <div className="relative group p-1 rounded-[3rem] bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 shadow-2xl">
              <div className="bg-white dark:bg-[#160327] rounded-[2.8rem] p-10 flex flex-col items-center text-center overflow-hidden relative">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                
                <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                  <FaTrophy className="text-4xl text-amber-500 drop-shadow-lg" />
                </div>
                <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-2 leading-none">Bounty & Rewards</h3>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-400">
                  {event.prizePool || 'GLORY & FAME'}
                </p>
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 w-full flex justify-center gap-6">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Participants</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {event.registrations?.length || 0}
                    </p>
                  </div>
                  <div className="w-px h-10 bg-gray-100 dark:bg-white/5"></div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                    <p className="text-xl font-bold text-green-500">Open</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Host Card */}
            <div className="bg-white dark:bg-[#160327]/40 rounded-[3rem] p-10 shadow-sm border border-gray-100 dark:border-white/5 backdrop-blur-sm text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-white/5 pb-4">Tournament Master</h3>
              <div className="flex flex-col items-center">
                 <div className="relative">
                    <div className="w-24 h-24 rounded-[30%] border-4 border-white dark:border-[#0d0118] overflow-hidden bg-purple-50 shadow-2xl relative z-10 group-hover:rotate-6 transition-transform">
                        {event.creatorUserId?.profileImageUrl ? (
                          <img src={event.creatorUserId.profileImageUrl} alt="Host" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600 font-black text-white text-3xl">
                            {event.creatorUserId?.name?.charAt(0) || event.creatorUserId?.username?.charAt(0) || 'H'}
                          </div>
                        )}
                    </div>
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 w-24 h-24 bg-purple-600 rounded-full blur-xl scale-125 opacity-20 animate-pulse"></div>
                 </div>
                 <div className="mt-6">
                    <Link href={`/profile/${event.creatorUserId?._id}`}>
                      <p className="font-black text-gray-900 dark:text-white text-2xl tracking-tight leading-tight hover:text-primary transition-colors cursor-pointer">{event.creatorUserId?.name || event.creatorUserId?.username || 'Legendary Host'}</p>
                    </Link>
                    <p className="text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-widest mt-2">Arena Curator</p>
                 </div>
                 
                 <div className="mt-8 flex gap-3 w-full">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.info("Event link copied to clipboard!");
                      }}
                      className="flex-1 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-purple-600 transition-colors border border-gray-100 dark:border-white/5"
                      title="Share Event"
                    >
                      <FaShareAlt className="mx-auto" />
                    </button>
                    <Link 
                      href={`/profile/${event.creatorUserId?._id}`}
                      className="flex-[4] py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center font-bold"
                    >
                      View Profile
                    </Link>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto py-10">
          <div className="fixed inset-0 bg-[#0d0118]/80 backdrop-blur-xl" onClick={() => setShowRegisterModal(false)}></div>
          <div className="relative bg-white dark:bg-[#160327] w-full max-w-xl rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-10 md:p-14 transform scale-100 transition-all border border-gray-100 dark:border-white/10 overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <button 
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-10 right-10 p-4 text-gray-400 hover:text-purple-600 dark:hover:text-white bg-gray-50 dark:bg-white/5 rounded-full transition-all border border-gray-100 dark:border-white/5 hover:rotate-90"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="mb-10">
              <div className="w-20 h-20 bg-blue-600/10 dark:bg-blue-600/20 rounded-[2.5rem] flex items-center justify-center mb-8 border border-blue-600/20">
                <FaUsers className="text-3xl text-blue-600" />
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">Elite Entry</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium text-lg leading-relaxed">
                Joining the legendary showdown: <span className="text-purple-600 font-black underline underline-offset-8 decoration-purple-600/30">{event.title}</span>
              </p>
            </div>

            <form onSubmit={handleRegisterEvent} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 ml-2">Your Identity</label>
                <div className="relative">
                  <FaUserAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                  <input 
                    required
                    type="text" 
                    value={regData.name}
                    onChange={(e) => setRegData({...regData, name: e.target.value})}
                    placeholder="Full Professional Name"
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[1.5rem] focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600/50 outline-none transition-all dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 ml-2">Contact Email</label>
                <input 
                  required
                  type="email" 
                  value={regData.email}
                  onChange={(e) => setRegData({...regData, email: e.target.value})}
                  placeholder="contact@art-hub.com"
                  className="w-full px-6 py-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[1.5rem] focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600/50 outline-none transition-all dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 ml-2">Words for the Host (Optional)</label>
                <textarea 
                  rows="4" 
                  value={regData.message}
                  onChange={(e) => setRegData({...regData, message: e.target.value})}
                  placeholder="Tell the master about your vision or portfolio links..."
                  className="w-full px-6 py-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600/50 outline-none transition-all dark:text-white font-medium resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  className="w-full py-6 bg-purple-600 text-white font-black rounded-[2rem] shadow-2xl shadow-purple-600/30 hover:bg-purple-700 hover:scale-[1.02] active:scale-95 transform transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
                >
                  Confirm Enrollment <FaRocket className="group-hover:rotate-12 transition-transform" />
                </button>
                <p className="text-center text-[10px] text-gray-400 font-bold mt-6 uppercase tracking-widest">AETHER ART HUB • OFFICIAL COMPETITION</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
