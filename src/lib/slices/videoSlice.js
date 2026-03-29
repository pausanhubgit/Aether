import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import videoAPI from '@/api/video';

export const fetchVideo = createAsyncThunk(
  'video/fetchVideo',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getVideo(searchParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  'video/fetchVideoById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getVideoById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createVideo = createAsyncThunk(
  'video/createVideo',
  async (data, { rejectWithValue }) => {
    try {
      const response = await videoAPI.createVideo(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateVideoAsync = createAsyncThunk(
  'video/updateVideo',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.updateVideo(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteVideoAsync = createAsyncThunk(
  'video/deleteVideo',
  async (id, { rejectWithValue }) => {
    try {
      await videoAPI.deleteVideo(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchGenres = createAsyncThunk(
  'video/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getGenres();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const likeVideoAsync = createAsyncThunk(
  'video/likeVideo',
  async ({ videoId, userId }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.likeVideo(videoId, userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unlikeVideoAsync = createAsyncThunk(
  'video/unlikeVideo',
  async ({ videoId, userId }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.unlikeVideo(videoId, userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCommentAsync = createAsyncThunk(
  'video/addComment',
  async ({ videoId, data }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.addComment(videoId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCommentsAsync = createAsyncThunk(
  'video/fetchComments',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getComments(videoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCommentAsync = createAsyncThunk(
  'video/deleteComment',
  async ({ videoId, commentId }, { rejectWithValue }) => {
    try {
      await videoAPI.deleteComment(videoId, commentId);
      return { videoId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchLikesAnalyticsAsync = createAsyncThunk(
  'video/fetchLikesAnalytics',
  async (merchantId, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getLikesAnalytics(merchantId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  videos: [],
  genres: [],
  currentVideo: null,
  comments: [],
  likesAnalytics: [],
  loading: false,
  error: null,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    addVideoLocal: (state, action) => {
      state.videos.push(action.payload);
    },
    updateVideoLocal: (state, action) => {
      const index = state.videos.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.videos[index] = action.payload;
      }
    },
    deleteVideoLocal: (state, action) => {
      state.videos = state.videos.filter(v => v.id !== action.payload);
    },
    likeVideo: (state, action) => {
      const v = state.videos.find(vi => vi.id === action.payload);
      if (v) {
        v.likes += 1;
      }
    },
    addComment: (state, action) => {
      state.comments.push(action.payload);
    },
    removeComment: (state, action) => {
      state.comments = state.comments.filter(c => c.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.videos.push(action.payload);
      })
      .addCase(updateVideoAsync.fulfilled, (state, action) => {
        const index = state.videos.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.videos[index] = action.payload;
        }
      })
      .addCase(deleteVideoAsync.fulfilled, (state, action) => {
        state.videos = state.videos.filter(v => v.id !== action.payload);
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      })
      .addCase(likeVideoAsync.fulfilled, (state, action) => {
        if (state.currentVideo) {
          state.currentVideo.likes = action.payload.likes;
        }
      })
      .addCase(unlikeVideoAsync.fulfilled, (state, action) => {
        if (state.currentVideo) {
          state.currentVideo.likes = action.payload.likes;
        }
      })
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(fetchCommentsAsync.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c.id !== action.payload.commentId);
      })
      .addCase(fetchLikesAnalyticsAsync.fulfilled, (state, action) => {
        state.likesAnalytics = action.payload;
      });
  },
});

export const {
  clearError,
  setCurrentVideo,
  addVideoLocal,
  updateVideoLocal,
  deleteVideoLocal,
  likeVideo,
  addComment,
  removeComment,
} = videoSlice.actions;

export default videoSlice.reducer;