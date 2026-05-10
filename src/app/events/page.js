"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaPlus,
  FaTrophy,
  FaUsers,
  FaPalette,
  FaMusic,
  FaVideo,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import eventsApi from "@/api/events";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import { formatImageUrl } from "@/helpers/url";
import { FaLayerGroup } from "react-icons/fa";

const EventsPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [showHostModal, setShowHostModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventImage, setEventImage] = useState(null);
  const [localImageUrl, setLocalImageUrl] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "Art",
    prizePool: "",
    startDate: "",
    endDate: "",
  });
  const [regData, setRegData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsApi.getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Could not load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleHostEvent = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning("Please login to host an event.");
      return;
    }

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });
      if (eventImage) {
        payload.append("image", eventImage);
      }

      await eventsApi.createEvent(payload);
      toast.success("Event launched successfully!");
      setShowHostModal(false);
      setFormData({
        title: "",
        description: "",
        eventType: "Art",
        prizePool: "",
        startDate: "",
        endDate: "",
      });
      setEventImage(null);
      setLocalImageUrl(null);
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to launch event.");
    }
  };

  const handleRegisterEvent = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning("Please login to register.");
      return;
    }

    try {
      await eventsApi.registerForEvent({
        eventId: selectedEvent._id,
        ...regData,
      });
      toast.success("Successfully registered for the event!");
      setShowRegisterModal(false);
      setRegData({
        name: user?.name || "",
        email: user?.email || "",
        message: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  const filteredEvents =
    filter === "All" ? events : events.filter((e) => e.eventType === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#160327] pb-20">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 z-0"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-1"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight">
            The Creative{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Arena
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 font-medium">
            Host or join high-stakes competitions in Arts, Music, and Video.
            Show the world what you are made of.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowHostModal(true)}
              className="px-8 py-4 bg-white text-purple-900 font-semibold rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              <FaPlus /> Host New Event
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("browse")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 bg-purple-600/30 backdrop-blur-md border border-white/20 text-white font-semibold rounded-2xl hover:bg-purple-600/50 transition-all flex items-center gap-2"
            >
              <FaSearch /> Browse Competitions
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div id="browse" className="container mx-auto px-4 mt-16 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-semibold text-black dark:text-white mb-2">
              Ongoing Showdowns
            </h2>
            <p className="text-gray-500 font-medium tracking-tight uppercase text-xs">
              Join the top competitions of the week
            </p>
          </div>

          <div className="flex gap-2 bg-white dark:bg-[#160327] p-1.5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
            {["All", "Art", "Music", "Video"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition ${
                  filter === type
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                    : "text-gray-500 hover:text-purple-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white dark:bg-[#160327] h-80 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm"
              ></div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-40 bg-white dark:bg-[#160327] rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="text-4xl text-purple-200" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              No Active Showdowns
            </h3>
            <p className="text-gray-500">
              Be the first to host a competition and ignite the community!
            </p>
            <button
              onClick={() => setShowHostModal(true)}
              className="mt-8 px-10 py-4 bg-purple-600 text-white font-semibold rounded-2xl shadow-xl shadow-purple-600/20 hover:scale-105 transition-transform"
            >
              Launch First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt) => (
              <div
                key={evt._id}
                className="group bg-white dark:bg-[#160327] rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative flex flex-col overflow-hidden"
              >
                {/* Event Cover Image Overlay */}
                {evt.image ? (
                  <div className="absolute inset-0 w-full h-full z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                    <img
                      src={formatImageUrl(evt.image)}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#160327] to-transparent"></div>
                  </div>
                ) : null}

                <div className="p-8 pb-0 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-4 py-1.5 bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-[10px] font-semibold rounded-full uppercase tracking-widest shadow-sm">
                      {evt.eventType}
                    </span>
                    <div className="flex items-center gap-2 text-gray-400 font-bold text-xs capitalize">
                      <FaCalendarAlt className="text-purple-400" />
                      {new Date(evt.startDate).toLocaleDateString() || "TBD"}
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold text-black dark:text-white mb-3 hover:text-purple-600 transition-colors leading-tight">
                    {evt.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-8 leading-relaxed font-medium">
                    {evt.description}
                  </p>
                </div>

                <div className="mt-auto space-y-6 relative z-10 px-8 pb-8">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#160327]/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100/50 rounded-lg">
                        <FaTrophy className="text-amber-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                          Prize Pool
                        </p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">
                          {evt.prizePool || "Glory & Fame"}
                        </p>
                      </div>
                    </div>
                    {evt.registrations?.length > 0 && (
                      <div className="text-right">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                          Warriors
                        </p>
                        <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {evt.registrations.length}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-purple-100">
                        {evt.creatorUserId?.profileImageUrl ? (
                          <img
                            src={evt.creatorUserId.profileImageUrl}
                            alt="Host"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-purple-600 text-xs">
                            {evt.creatorUserId?.name?.charAt(0) || "H"}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-400">
                        Hosted by{" "}
                        <Link
                          href={
                            evt.creatorUserId?._id
                              ? `/profile/${evt.creatorUserId._id}`
                              : "#"
                          }
                          className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          {evt.creatorUserId?.name || "Anonymous"}
                        </Link>
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => {
                          setSelectedEvent(evt);
                          setShowRegisterModal(true);
                        }}
                        className="h-9 px-4 bg-purple-600 text-white rounded-lg text-xs font-semibold shadow-md hover:bg-purple-700 transition-all flex items-center justify-center"
                      >
                        Register
                      </button>
                      <Link
                        href={`/events/${evt._id}`}
                        className="h-9 px-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-[#310c55] dark:to-[#160327] text-white rounded-lg text-xs font-bold shadow-md hover:scale-105 transition-all inline-flex items-center justify-center gap-1"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Host Modal */}
      {showHostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto pt-20 pb-10">
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setShowHostModal(false)}
          ></div>
          <div className="relative bg-white dark:bg-[#160327] w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 transform scale-100 transition-all border border-gray-100 dark:border-slate-700">
            <button
              onClick={() => setShowHostModal(false)}
              className="absolute top-8 right-8 p-3 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="mb-10 text-center">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <FaCalendarAlt className="text-3xl text-purple-600" />
              </div>
              <h2 className="text-4xl font-semibold text-black dark:text-white tracking-tight">
                Host Your Showdown
              </h2>
              <p className="text-gray-500 mt-2 font-medium italic">
                Create a legacy and engage with top creative talent.
              </p>
            </div>

            <form onSubmit={handleHostEvent} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Competition Title
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Masterpiece Showdown 2024"
                    className="w-full p-4 bg-gray-50 dark:bg-[#160327] border border-gray-100 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Discipline
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) =>
                      setFormData({ ...formData, eventType: e.target.value })
                    }
                    className="w-full p-4 bg-gray-50 dark:bg-[#160327] border border-gray-100 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white"
                  >
                    <option value="Art">Visual Arts</option>
                    <option value="Music">Musical Tracks</option>
                    <option value="Video">Video Production</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Prize Pool / Rewards
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.prizePool}
                    onChange={(e) =>
                      setFormData({ ...formData, prizePool: e.target.value })
                    }
                    placeholder="e.g. $10,000 + Spotlight"
                    className="w-full p-4 bg-gray-50 dark:bg-[#160327] border border-gray-100 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Start Date
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full p-4 bg-gray-50 dark:bg-[#160327] border border-gray-100 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    End Date
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full p-4 bg-gray-50 dark:bg-[#160327] border border-gray-100 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Guidelines & Description
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Define the rules, submission requirements, and the spirit of your competition..."
                    className="w-full p-4 bg-gray-50 dark:bg-[#160327] border border-gray-100 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white resize-none"
                  ></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Showdown Cover Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload-host"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-200 dark:border-slate-600 border-dashed rounded-[2rem] cursor-pointer bg-gray-50 dark:bg-[#160327]/50 hover:bg-gray-100 dark:hover:border-purple-500/50 transition-all overflow-hidden relative group"
                    >
                      {localImageUrl ? (
                        <div className="absolute inset-0 w-full h-full">
                          <img
                            src={localImageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                            <FaLayerGroup className="text-3xl text-white mb-2" />
                            <p className="text-white font-bold text-sm uppercase tracking-widest">
                              Change Cover
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-4 border border-purple-200 dark:border-purple-800/40">
                            <FaLayerGroup className="text-2xl text-purple-600" />
                          </div>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-black text-purple-600">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                            Premium Cover Image (PNG, JPG)
                          </p>
                        </div>
                      )}
                      <input
                        id="image-upload-host"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setEventImage(file);
                            setLocalImageUrl(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowHostModal(false)}
                  className="flex-1 px-8 py-4 bg-gray-100 dark:bg-[#160327] text-gray-600 dark:text-gray-200 font-bold rounded-2xl hover:bg-gray-200 transition-all underline decoration-gray-300"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 px-8 py-4 bg-purple-600 text-white font-semibold rounded-2xl shadow-xl shadow-purple-600/20 hover:scale-[1.02] transform transition-all"
                >
                  Launch Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Register Modal */}
      {showRegisterModal && selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto pt-20 pb-10">
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setShowRegisterModal(false)}
          ></div>
          <div className="relative bg-white dark:bg-[#160327] w-full max-w-lg rounded-[3rem] shadow-2xl p-10 transform scale-100 transition-all border border-gray-100 dark:border-slate-700">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-8 right-8 p-3 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-blue-600" />
              </div>
              <h2 className="text-3xl font-semibold text-black dark:text-white tracking-tight leading-tight">
                Join the Showdown
              </h2>
              <p className="text-gray-500 mt-2 font-medium">
                Registering for:{" "}
                <span className="text-purple-600 font-bold">
                  {selectedEvent.title}
                </span>
              </p>
            </div>

            <form onSubmit={handleRegisterEvent} className="space-y-5">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={regData.name}
                  onChange={(e) =>
                    setRegData({ ...regData, name: e.target.value })
                  }
                  placeholder="Your display name"
                  className="w-full p-4 bg-gray-50 dark:bg-[#160327] border border-gray-100 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={regData.email}
                  onChange={(e) =>
                    setRegData({ ...regData, email: e.target.value })
                  }
                  placeholder="contact@example.com"
                  className="w-full p-4 bg-gray-50 dark:bg-[#160327] border border-gray-100 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Note to Host (Optional)
                </label>
                <textarea
                  rows="3"
                  value={regData.message}
                  onChange={(e) =>
                    setRegData({ ...regData, message: e.target.value })
                  }
                  placeholder="Any portfolio links or questions?"
                  className="w-full p-4 bg-gray-50 dark:bg-[#160327] border border-gray-100 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white text-sm resize-none"
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-purple-600 text-white font-semibold rounded-2xl shadow-xl shadow-purple-600/20 hover:scale-[1.02] transform transition-all text-sm uppercase tracking-widest"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
