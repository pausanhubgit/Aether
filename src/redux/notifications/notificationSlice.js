import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";

// ── Thunks for Backend Integration ──────────────────────────────
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/notifications");
      // Map backend fields to frontend fields
      return response.data.map((n) => {
        const senderName = n.sender?.name || n.sender?.username || "A user";
        return {
          id: n._id,
          targetUserId: n.recipient
            ? String(n.recipient._id || n.recipient)
            : null,
          type: n.type,
          title: n.title,
          message: n.message,
          link: n.link,
          read: n.read,
          createdAt: n.createdAt,
          initials: n.sender
            ? makeInitials(senderName)
            : n.title?.charAt(0) || "N",
          followerId:
            n.type === "follow" || n.type === "follow_back"
              ? n.sender?._id
              : null,
          senderInfo: n.sender,
          fromRealAction: true, // Enable toasts for polled notifications
        };
      });
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch");
    }
  },
);

export const markReadBackend = createAsyncThunk(
  "notifications/markReadBackend",
  async (notifId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/notifications/${notifId}/read`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to update notification",
      );
    }
  },
);

export const deleteNotificationBackend = createAsyncThunk(
  "notifications/deleteBackend",
  async (notifId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/notifications/${notifId}`);
      return notifId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to delete notification",
      );
    }
  },
);

export const markAllReadBackend = createAsyncThunk(
  "notifications/markAllReadBackend",
  async (_, { rejectWithValue }) => {
    try {
      await api.patch("/api/notifications/read-all");
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to mark all as read",
      );
    }
  },
);

export const deleteAllNotificationsBackend = createAsyncThunk(
  "notifications/deleteAllBackend",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/api/notifications/delete-all");
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to delete all notifications",
      );
    }
  },
);

// ── Seed notifications (demo content — shown before any real interactions) ──
const seedNotifications = [
  {
    id: "seed-1",
    type: "comment",
    title: "New Comment on Your Music",
    message: 'Riya Sharma commented: "This track is absolutely fire! 🔥"',
    initials: "RS",
    color: "purple",
    link: "/music",
    read: false,
    fromRealAction: false,
    createdAt: "2026-04-08T11:00:00.000Z",
  },
  {
    id: "seed-2",
    type: "like",
    title: "Someone Liked Your Art",
    message: 'Aarav Thapa liked your artwork "Nebula Dreams"',
    initials: "AT",
    color: "pink",
    link: "/arts",
    read: false,
    fromRealAction: false,
    createdAt: "2026-04-08T10:30:00.000Z",
  },
  {
    id: "seed-3",
    type: "comment",
    title: "Comment on Your Video",
    message: 'Priya Joshi: "Incredible cinematography, loved every second!"',
    initials: "PJ",
    color: "blue",
    link: "/video",
    read: false,
    fromRealAction: false,
    createdAt: "2026-04-08T10:00:00.000Z",
  },
  {
    id: "seed-4",
    type: "follow",
    title: "New Follower",
    message: "Kiran Magar started following you",
    initials: "KM",
    color: "green",
    link: "/profile",
    read: true,
    fromRealAction: false,
    createdAt: "2026-04-08T09:00:00.000Z",
  },
  {
    id: "seed-5",
    type: "like",
    title: "Your Track Is Trending",
    message: '"Monsoon Vibes" received 50+ likes today!',
    initials: "🎵",
    color: "yellow",
    link: "/music",
    read: true,
    fromRealAction: false,
    createdAt: "2026-04-08T06:00:00.000Z",
  },
  {
    id: "seed-6",
    type: "event",
    title: "Event Reminder",
    message: '"Aether Music Night" starts in 2 hours. Don\'t miss it!',
    initials: "🎪",
    color: "orange",
    link: "/events",
    read: true,
    fromRealAction: false,
    createdAt: "2026-04-08T03:00:00.000Z",
  },
];

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: seedNotifications,
    loading: false,
    error: null,
  },
  reducers: {
    // ── Core CRUD ──────────────────────────────────────────────
    markAsRead: (state, action) => {
      const notif = state.items.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => (n.read = true));
    },
    addNotification: (state, action) => {
      // Prevent exact duplicate real-action notifications within 5 seconds
      const payload = action.payload;
      const fiveSecondsAgo = Date.now() - 5000;
      const isDuplicate = state.items.some(
        (n) =>
          n.fromRealAction &&
          n.type === payload.type &&
          n.link === payload.link &&
          n.actorName === payload.actorName &&
          new Date(n.createdAt).getTime() > fiveSecondsAgo,
      );
      if (isDuplicate) return;

      state.items.unshift({
        ...payload,
        read: false,
        fromRealAction: true,
        createdAt: new Date().toISOString(),
      });
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    clearAll: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        // Merge with existing real-action or seed items, prioritize backend
        const backendItems = action.payload;
        const localItems = state.items.filter(
          (n) => !backendItems.some((bn) => bn.id === n.id),
        );
        state.items = [...backendItems, ...localItems].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markReadBackend.fulfilled, (state, action) => {
        const notif = state.items.find((n) => n.id === action.payload);
        if (notif) notif.read = true;
      })
      .addCase(deleteNotificationBackend.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n.id !== action.payload);
      })
      .addCase(markAllReadBackend.fulfilled, (state) => {
        state.items.forEach((n) => (n.read = true));
      })
      .addCase(deleteAllNotificationsBackend.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const {
  markAsRead,
  markAllAsRead,
  addNotification,
  removeNotification,
  clearAll,
} = notificationSlice.actions;

// ── Helpers for dispatching real-action notifications ──────────
export function makeInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default notificationSlice.reducer;
