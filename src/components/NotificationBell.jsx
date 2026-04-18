"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  fetchNotifications,
  markReadBackend,
  deleteNotificationBackend,
  markAllReadBackend,
} from "@/redux/notifications/notificationSlice";
import { localFollow } from "@/redux/social/socialSlice";
import {
  FaBell,
  FaComment,
  FaHeart,
  FaUserPlus,
  FaCalendarAlt,
  FaTimes,
  FaCheckDouble,
  FaMusic,
  FaProjectDiagram,
  FaUserCheck,
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
  comment: {
    icon: FaComment,
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    ring: "ring-purple-500/30",
    dot: "bg-purple-500",
  },
  like: {
    icon: FaHeart,
    bg: "bg-pink-500/20",
    text: "text-pink-400",
    ring: "ring-pink-500/30",
    dot: "bg-pink-500",
  },
  follow: {
    icon: FaUserPlus,
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    ring: "ring-purple-500/30",
    dot: "bg-purple-500",
  },
  event: {
    icon: FaCalendarAlt,
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    ring: "ring-orange-500/30",
    dot: "bg-orange-500",
  },
  music: {
    icon: FaMusic,
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    ring: "ring-blue-500/30",
    dot: "bg-blue-500",
  },
};

const DEFAULT_META = {
  icon: FaBell,
  bg: "bg-slate-500/20",
  text: "text-slate-400",
  ring: "ring-slate-500/30",
  dot: "bg-slate-500",
};

// ── component ─────────────────────────────────────────────────────
export default function NotificationBell() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items: notifications } = useSelector((s) => s.notifications);
  const { user: currentUser } = useSelector((s) => s.auth);
  const { followedUserIds } = useSelector((s) => s.socialPersistence);
  
  // Filter notifications for the current user
  const currentUserId = String(currentUser?._id || currentUser?.id || "");
  const userNotifications = (notifications || []).filter(n => {
    // n.targetUserId is normalized in the slice (Remote)
    // n.recipient might be present in local-only dispatches
    const target = n.targetUserId || n.recipient;
    if (!target) return true; // Show global if no target is specified
    return String(target) === currentUserId;
  });
  
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const [open, setOpen] = useState(false);
  const [animateBell, setAnimateBell] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef(null);
  const bellRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // bell wiggle on new unread
  useEffect(() => {
    if (unreadCount > 0) {
      setAnimateBell(true);
      const t = setTimeout(() => setAnimateBell(false), 800);
      return () => clearTimeout(t);
    }
  }, [unreadCount]);

  useEffect(() => {
    if (currentUser?._id || currentUser?.id) {
      // Check for token existence before attempting protected calls
      const hasToken = typeof window !== "undefined" && 
                     (localStorage.getItem("authtoken") || localStorage.getItem("persist:root")?.includes("token"));
      
      if (hasToken) {
        // Initial fetch
        dispatch(fetchNotifications());

        // Set up background polling every 60 seconds
        const pollInterval = setInterval(() => {
          dispatch(fetchNotifications());
        }, 60000);

        return () => clearInterval(pollInterval);
      }
    }
  }, [dispatch, currentUser?._id, currentUser?.id]);

  const handleFollowBack = async (e, followerId, notifId) => {
    e.stopPropagation();
    try {
      await userApi.followUser(followerId);
      
      // Also update local bridge for persistence
      dispatch(localFollow(followerId));
      
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
    setOpen(false);
    if (notif.link) router.push(notif.link);
  };

  const handleRemove = (e, id) => {
    e.stopPropagation();
    // For seed notifications (non-DB), just remove locally.
    // For real notifications, remove locally AND delete on backend.
    if (String(id).startsWith("seed-")) {
       dispatch(removeNotification(id));
    } else {
       // Optimistically remove locally
       dispatch(removeNotification(id));
       // Persistent delete on backend
       dispatch(deleteNotificationBackend(id));
    }
  };

  return (
    <div className="relative flex-shrink-0">
      {/* ── Bell Button ── */}
      <button
        ref={bellRef}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) {
            console.group("🔔 [NOTIF DIAGNOSTICS]");
            console.log("Current Logged-in User ID:", currentUserId);
            console.log("Total notifications in memory:", notifications.length);
            const debugTable = notifications.slice(0, 10).map(n => ({
              ID: n.id,
              Type: n.type,
              Targeted_To: n.targetUserId || "GLOBAL",
              Match: n.targetUserId ? (String(n.targetUserId) === currentUserId ? "✅ YES" : "❌ NO") : "🌍 GLOBAL",
              Message: n.message?.substring(0, 30) + "..."
            }));
            console.table(debugTable);
            console.groupEnd();
          }
        }}
        aria-label="Notifications"
        className={`relative p-1.5 text-primary hover:text-primary/70 transition-all active:scale-90 outline-none border-none focus:outline-none focus:ring-0 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/30 ${
          animateBell ? "animate-wiggle" : ""
        }`}
      >
        <FaBell size={19} />
        {mounted && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow ring-2 ring-white dark:ring-[#0d0118] leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        {/* pulse ring on unread */}
        {mounted && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 opacity-60 animate-ping pointer-events-none" />
        )}
      </button>

      {/* ── Dropdown Panel ── */}
      {open && (
        <div
          ref={panelRef}
          className="fixed sm:absolute right-0 top-[60px] sm:top-[calc(100%+10px)] z-[999] w-[calc(100vw-32px)] sm:w-[380px] mx-4 sm:mx-0 rounded-[2rem] shadow-2xl border overflow-hidden animate-in slide-in-from-top-2 duration-300"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10">
                <FaBell size={13} className="text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-bold text-[var(--foreground)] text-sm">Notifications</span>
              {mounted && unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                  {unreadCount} new
                </span>
              )}
            </div>
            {mounted && unreadCount > 0 && (
              <button
                onClick={() => dispatch(markAllReadBackend())}
                className="flex items-center gap-1.5 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-200 transition-colors"
                title="Mark all as read"
              >
                <FaCheckDouble size={11} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* list */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-purple-900/30 custom-scrollbar">
            {!mounted ? (
               <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary"></div>
               </div>
            ) : userNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <FaBell size={22} className="text-purple-400/50" />
                </div>
                <p className="text-[var(--muted)] text-sm font-medium">
                  You&apos;re all caught up!
                </p>
              </div>
            ) : (
              userNotifications.map((notif) => {
                const meta = TYPE_META[notif.type] || DEFAULT_META;
                const Icon = meta.icon;
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotifClick(notif)}
                    className={`group relative flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-800/20 ${
                      !notif.read ? "bg-purple-500/5 dark:bg-purple-900/15" : ""
                    }`}
                  >
                    {/* unread dot */}
                    {!notif.read && (
                      <span
                        className={`absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full ${meta.dot} flex-shrink-0`}
                      />
                    )}

                    {/* avatar / icon */}
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-2xl ${meta.bg} ring-1 ${meta.ring} flex items-center justify-center font-bold text-sm ${meta.text}`}
                    >
                      {notif.initials?.length > 2 ? (
                        <span className="text-base leading-none">{notif.initials}</span>
                      ) : notif.initials ? (
                        <span className="text-xs font-black">{notif.initials}</span>
                      ) : (
                        <Icon size={14} />
                      )}
                    </div>

                    {/* text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-bold leading-tight mb-0.5 truncate ${
                          !notif.read ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-[var(--muted)] leading-snug line-clamp-2">
                        {notif.message}
                      </p>

                      {/* Project User badge */}
                      {notif.fromProjectUser && (
                        <div className="flex items-center gap-1.5 mt-1.5 mb-0.5">
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "1px 7px",
                              borderRadius: "999px",
                              background: "var(--primary-light, rgba(139,92,246,0.1))",
                              border: "1px solid var(--primary-border, rgba(139,92,246,0.2))",
                              fontSize: "8px",
                              fontWeight: 800,
                              letterSpacing: "0.05em",
                              color: "var(--primary)",
                              textTransform: "uppercase",
                            }}
                          >
                            <FaProjectDiagram size={8} />
                            Project User
                          </span>
                          {notif.projectName && (
                            <span
                              className="text-[9px] font-medium truncate max-w-[120px]"
                              style={{ color: "var(--muted)" }}
                            >
                              {notif.projectName}
                            </span>
                          )}
                        </div>
                      )}


                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-[var(--muted)] font-medium">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* actions */}
                    <div className="flex flex-col items-center gap-1.5 flex-shrink-0 ml-1">
                      <FiChevronRight
                        size={13}
                        className="text-purple-500/40 group-hover:text-purple-300 transition-colors"
                      />
                      <button
                        onClick={(e) => handleRemove(e, notif.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-red-500/20 text-red-400/60 hover:text-red-400 transition-all"
                        title="Dismiss"
                      >
                        <FaTimes size={9} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* footer */}
          {userNotifications.length > 0 && (
            <div className="px-5 py-3 border-t border-purple-800/30 flex items-center justify-between">
              <span className="text-[11px] text-purple-400/50 font-medium">
                {userNotifications.length} total notification{userNotifications.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => { setOpen(false); router.push("/notifications"); }}
                className="text-[11px] font-bold text-purple-400 hover:text-purple-200 transition-colors flex items-center gap-1"
              >
                View all <FiChevronRight size={11} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* global wiggle keyframe */}
      <style jsx global>{`
        @keyframes wiggle {
          0%,100% { transform: rotate(0deg); }
          15% { transform: rotate(-18deg); }
          30% { transform: rotate(18deg); }
          45% { transform: rotate(-12deg); }
          60% { transform: rotate(12deg); }
          75% { transform: rotate(-6deg); }
          90% { transform: rotate(6deg); }
        }
        .animate-wiggle { animation: wiggle 0.8s ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 9999px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.5); }
      `}</style>
    </div>
  );
}
