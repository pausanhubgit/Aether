"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const TYPE_ICONS = {
  comment: "💬",
  like: "❤️",
  follow: "👤",
  follow_back: "🤝",
  event: "🎪",
  music: "🎵",
};

/**
 * Watches the Redux notification store.
 * Whenever a NEW real-action notification appears (from like/comment),
 * it shows a Toastify alert at the bottom-right.
 * Does NOT poll any API — all notifications are frontend-dispatched.
 */
export default function NotificationWatcher() {
  const { items: notifications } = useSelector((s) => s.notifications);
  const prevCountRef = useRef(null);

  useEffect(() => {
    // Count only real-action unread notifications
    const realUnread = notifications.filter((n) => n.fromRealAction && !n.read);
    const count = realUnread.length;

    // On first mount just record count, don't toast seed data
    if (prevCountRef.current === null) {
      prevCountRef.current = count;
      return;
    }

    // A new real notification was added
    if (count > prevCountRef.current) {
      const latest = realUnread[0]; // addNotification uses unshift → newest is first
      if (latest) {
        const icon = TYPE_ICONS[latest.type] || "🔔";
        toast(
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span style={{ fontSize: "18px", lineHeight: 1 }}>{icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "2px" }}>
                {latest.title}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.8, lineHeight: 1.4 }}>
                {latest.message}
              </div>
            </div>
          </div>,
          {
            style: {
              borderRadius: "1rem",
              background: "#1a0533",
              color: "#fff",
              border: "1px solid rgba(139,92,246,0.4)",
              padding: "12px 16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            },
            progressStyle: { background: "rgba(139,92,246,0.7)" },
            icon: false,
            autoClose: 4000,
          }
        );
      }
    }

    prevCountRef.current = count;
  }, [notifications]);

  return null;
}
