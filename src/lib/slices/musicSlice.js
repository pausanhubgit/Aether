import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import musicAPI from "@/api/music";

export const fetchMusic = createAsyncThunk(
  "music/fetchMusic",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await musicAPI.getMusic(searchParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchMusicById = createAsyncThunk(
  "music/fetchMusicById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await musicAPI.getMusicById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createMusic = createAsyncThunk(
  "music/createMusic",
  async (data, { rejectWithValue }) => {
    try {
      const response = await musicAPI.createMusic(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateMusicAsync = createAsyncThunk(
  "music/updateMusic",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await musicAPI.updateMusic(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteMusicAsync = createAsyncThunk(
  "music/deleteMusic",
  async (id, { rejectWithValue }) => {
    try {
      await musicAPI.deleteMusic(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchGenres = createAsyncThunk(
  "music/fetchGenres",
  async (_, { rejectWithValue }) => {
    try {
      const response = await musicAPI.getGenres();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const likeMusicAsync = createAsyncThunk(
  "music/likeMusic",
  async ({ musicId, userId }, { rejectWithValue }) => {
    try {
      const response = await musicAPI.likeMusic(musicId, userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const unlikeMusicAsync = createAsyncThunk(
  "music/unlikeMusic",
  async ({ musicId, userId }, { rejectWithValue }) => {
    try {
      const response = await musicAPI.unlikeMusic(musicId, userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addCommentAsync = createAsyncThunk(
  "music/addComment",
  async ({ musicId, data }, { rejectWithValue }) => {
    try {
      const response = await musicAPI.addComment(musicId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchCommentsAsync = createAsyncThunk(
  "music/fetchComments",
  async (musicId, { rejectWithValue }) => {
    try {
      const response = await musicAPI.getComments(musicId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteCommentAsync = createAsyncThunk(
  "music/deleteComment",
  async ({ musicId, commentId }, { rejectWithValue }) => {
    try {
      await musicAPI.deleteComment(musicId, commentId);
      return { musicId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchLikesAnalyticsAsync = createAsyncThunk(
  "music/fetchLikesAnalytics",
  async (merchantId, { rejectWithValue }) => {
    try {
      const response = await musicAPI.getLikesAnalytics(merchantId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  music: [],
  genres: [],
  currentMusic: null,
  comments: [],
  likesAnalytics: [],
  loading: false,
  error: null,
};

const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentMusic: (state, action) => {
      state.currentMusic = action.payload;
    },
    addMusicLocal: (state, action) => {
      state.music.push(action.payload);
    },
    updateMusicLocal: (state, action) => {
      const index = state.music.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.music[index] = action.payload;
      }
    },
    deleteMusicLocal: (state, action) => {
      state.music = state.music.filter((m) => m.id !== action.payload);
    },
    likeMusic: (state, action) => {
      const m = state.music.find((mu) => mu.id === action.payload);
      if (m) {
        m.likes += 1;
      }
    },
    addComment: (state, action) => {
      state.comments.push(action.payload);
    },
    removeComment: (state, action) => {
      state.comments = state.comments.filter((c) => c.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMusic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMusic.fulfilled, (state, action) => {
        state.loading = false;
        state.music = action.payload;
      })
      .addCase(fetchMusic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMusicById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMusicById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMusic = action.payload;
      })
      .addCase(fetchMusicById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMusic.fulfilled, (state, action) => {
        state.music.push(action.payload);
      })
      .addCase(updateMusicAsync.fulfilled, (state, action) => {
        const index = state.music.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.music[index] = action.payload;
        }
      })
      .addCase(deleteMusicAsync.fulfilled, (state, action) => {
        state.music = state.music.filter((m) => m.id !== action.payload);
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      })
      .addCase(likeMusicAsync.fulfilled, (state, action) => {
        if (state.currentMusic) {
          state.currentMusic.likes = action.payload.likes;
        }
      })
      .addCase(unlikeMusicAsync.fulfilled, (state, action) => {
        if (state.currentMusic) {
          state.currentMusic.likes = action.payload.likes;
        }
      })
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(fetchCommentsAsync.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (c) => c.id !== action.payload.commentId,
        );
      })
      .addCase(fetchLikesAnalyticsAsync.fulfilled, (state, action) => {
        state.likesAnalytics = action.payload;
      });
  },
});

export const {
  clearError,
  setCurrentMusic,
  addMusicLocal,
  updateMusicLocal,
  deleteMusicLocal,
  likeMusic,
  addComment,
  removeComment,
} = musicSlice.actions;

export default musicSlice.reducer;
