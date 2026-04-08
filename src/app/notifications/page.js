"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  fetchNotifications,
  markReadBackend,
  markAllReadBackend,
  deleteAllNotificationsBackend,
} from "@/redux/notifications/notificationSlice";
import {
  FaBell,
  FaComment,
  FaHeart,
  FaUserPlus,
  FaCalendarAlt,
  FaTimes,
  FaCheckDouble,
  FaProjectDiagram,
  FaUserCheck,
  FaInbox,
  FaTrash
} from "react-icons/fa";
import userApi from "@/api/users";
import { toast } from "react-toastify";
import { FiChevronRight } from "react-icons/fi";

// ── helpers ───────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const TYPE_META = {
  comment: { icon: FaComment, bg: "bg-purple-500/10", text: "text-purple-500", ring: "ring-purple-500/20", dot: "bg-purple-500" },
  like: { icon: FaHeart, bg: "bg-pink-500/10", text: "text-pink-500", ring: "ring-pink-500/20", dot: "bg-pink-500" },
  follow: { icon: FaUserPlus, bg: "bg-purple-500/10", text: "text-purple-500", ring: "ring-purple-500/20", dot: "bg-purple-500" },
  event: { icon: FaCalendarAlt, bg: "bg-orange-500/10", text: "text-orange-500", ring: "ring-orange-500/20", dot: "bg-orange-500" },
};

const DEFAULT_META = { icon: FaBell, bg: "bg-slate-500/10", text: "text-slate-500", ring: "ring-slate-500/20", dot: "bg-slate-500" };

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items: notifications } = useSelector((s) => s.notifications);
  const { user: currentUser } = useSelector((s) => s.auth);
  const [filter, setFilter] = useState("all");
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (currentUser?._id || currentUser?.id) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, currentUser?._id, currentUser?.id]);

  const currentUserId = String(currentUser?._id || currentUser?.id || "");
  const userNotifications = notifications.filter(n => {
    if (!n.targetUserId) return true;
    return String(n.targetUserId) === currentUserId;
  });

  const filtered = userNotifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const handleFollowBack = async (e, followerId, notifId) => {
    e.stopPropagation();
    try {
      await userApi.followUser(followerId);
      toast.success("Followed back!");
      dispatch(markAsRead(notifId));
    } catch (err) {
      console.error("Follow back err:", err);
      toast.error("Failed to follow back.");
    }
  };

  const handleNotifClick = (notif) => {
    dispatch(markAsRead(notif.id));
    dispatch(markReadBackend(notif.id));
    if (notif.link) router.push(notif.link);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--background)] pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] flex items-center gap-3">
              <FaBell className="text-purple-600" /> Notifications
            </h1>
            <p className="text-[var(--muted)] mt-1">Manage your activity alerts and social updates.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => dispatch(markAllReadBackend())}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-purple-500/20"
            >
              <FaCheckDouble size={14} /> Mark all Read
            </button>
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to delete all notifications? This cannot be undone.")) {
                  dispatch(deleteAllNotificationsBackend());
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold transition"
            >
              <FaTrash size={14} /> Clear All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8 bg-[var(--surface)] p-2 rounded-2xl border border-[var(--border)]">
          {["all", "unread", "like", "comment", "follow", "event"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f 
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20" 
                  : "text-[var(--muted)] hover:bg-purple-50 dark:hover:bg-purple-950/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {!mounted ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-[var(--surface)] rounded-[2.5rem] border border-dashed border-[var(--border)]">
              <div className="p-6 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                <FaInbox size={40} className="text-purple-300" />
              </div>
              <p className="text-[var(--muted)] font-medium">No notifications found in this category.</p>
            </div>
          ) : (
            filtered.map((notif) => {
              const meta = TYPE_META[notif.type] || DEFAULT_META;
              const Icon = meta.icon;
              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotifClick(notif)}
                  className={`group relative flex items-start gap-4 p-5 rounded-[2rem] border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl cursor-pointer ${
                    !notif.read 
                      ? "bg-[var(--surface)] border-purple-500/30 shadow-lg shadow-purple-500/5 ring-1 ring-purple-500/10" 
                      : "bg-[var(--surface)] border-[var(--border)] opacity-80"
                  }`}
                >
                  {/* unread indicator */}
                  {!notif.read && (
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-8 bg-purple-600 rounded-r-full" />
                  )}

                  <div className={`shrink-0 h-14 w-14 rounded-2xl ${meta.bg} border border-white/10 flex items-center justify-center`}>
                    {notif.initials ? (
                      <span className={`text-lg font-black ${meta.text}`}>{notif.initials}</span>
                    ) : (
                      <Icon size={20} className={meta.text} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold text-base truncate ${!notif.read ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] font-medium text-[var(--muted)] whitespace-nowrap">{timeAgo(notif.createdAt)}</span>
                    </div>
                    <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">{notif.message}</p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${meta.text}`}>{notif.type}</span>
                       <div className="h-1 w-1 rounded-full bg-[var(--border)]" />
                       
                       {notif.fromProjectUser && (
                         <div className="flex items-center gap-2">
                           <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black text-purple-600 uppercase tracking-tighter flex items-center gap-1">
                             <FaProjectDiagram size={8} /> Project Contributor
                           </span>
                           {notif.projectName && (
                             <span className="text-[10px] font-bold text-[var(--muted)] italic">#{notif.projectName}</span>
                           )}
                         </div>
                       )}

                    </div>
                  </div>

                  <div className="flex flex-col gap-2 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); dispatch(removeNotification(notif.id)); }}
                      className="p-2 hover:bg-red-500/10 text-red-400 hover:text-red-500 rounded-xl transition-colors"
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                    <div className="p-2 text-purple-400">
                      <FiChevronRight size={18} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
