import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import artsAPI from '@/api/arts';

export const fetchArts = createAsyncThunk(
  'arts/fetchArts',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await artsAPI.getArt(searchParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchArtById = createAsyncThunk(
  'arts/fetchArtById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await artsAPI.getArtsById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createArt = createAsyncThunk(
  'arts/createArt',
  async (data, { rejectWithValue }) => {
    try {
      const response = await artsAPI.createArts(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateArtAsync = createAsyncThunk(
  'arts/updateArt',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await artsAPI.updateArt(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteArtAsync = createAsyncThunk(
  'arts/deleteArt',
  async (id, { rejectWithValue }) => {
    try {
      await artsAPI.deleteArts(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'arts/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await artsAPI.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const likeArtAsync = createAsyncThunk(
  'arts/likeArt',
  async ({ artId, userId }, { rejectWithValue }) => {
    try {
      const response = await artsAPI.likeArt(artId, userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unlikeArtAsync = createAsyncThunk(
  'arts/unlikeArt',
  async ({ artId, userId }, { rejectWithValue }) => {
    try {
      const response = await artsAPI.unlikeArt(artId, userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCommentAsync = createAsyncThunk(
  'arts/addComment',
  async ({ artId, data }, { rejectWithValue }) => {
    try {
      const response = await artsAPI.addComment(artId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCommentsAsync = createAsyncThunk(
  'arts/fetchComments',
  async (artId, { rejectWithValue }) => {
    try {
      const response = await artsAPI.getComments(artId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCommentAsync = createAsyncThunk(
  'arts/deleteComment',
  async ({ artId, commentId }, { rejectWithValue }) => {
    try {
      await artsAPI.deleteComment(artId, commentId);
      return { artId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchLikesAnalyticsAsync = createAsyncThunk(
  'arts/fetchLikesAnalytics',
  async (merchantId, { rejectWithValue }) => {
    try {
      const response = await artsAPI.getLikesAnalytics(merchantId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  arts: [],
  categories: [],
  currentArt: null,
  comments: [],
  likesAnalytics: [],
  loading: false,
  error: null,
};

const artsSlice = createSlice({
  name: 'arts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentArt: (state, action) => {
      state.currentArt = action.payload;
    },
    addArt: (state, action) => {
      state.arts.push(action.payload);
    },
    updateArt: (state, action) => {
      const index = state.arts.findIndex(art => art.id === action.payload.id);
      if (index !== -1) {
        state.arts[index] = action.payload;
      }
    },
    deleteArt: (state, action) => {
      state.arts = state.arts.filter(art => art.id !== action.payload);
    },
    likeArt: (state, action) => {
      const art = state.arts.find(a => a.id === action.payload);
      if (art) {
        art.likes += 1;
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
      .addCase(fetchArts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArts.fulfilled, (state, action) => {
        state.loading = false;
        state.arts = action.payload;
      })
      .addCase(fetchArts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchArtById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArt = action.payload;
      })
      .addCase(fetchArtById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createArt.fulfilled, (state, action) => {
        state.arts.push(action.payload);
      })
      .addCase(updateArtAsync.fulfilled, (state, action) => {
        const index = state.arts.findIndex(art => art.id === action.payload.id);
        if (index !== -1) {
          state.arts[index] = action.payload;
        }
      })
      .addCase(deleteArtAsync.fulfilled, (state, action) => {
        state.arts = state.arts.filter(art => art.id !== action.payload);
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(likeArtAsync.fulfilled, (state, action) => {
        if (state.currentArt) {
          state.currentArt.likes = action.payload.likes;
        }
      })
      .addCase(unlikeArtAsync.fulfilled, (state, action) => {
        if (state.currentArt) {
          state.currentArt.likes = action.payload.likes;
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
  setCurrentArt,
  addArt,
  updateArt,
  deleteArt,
  likeArt,
  addComment,
  removeComment,
} = artsSlice.actions;

export default artsSlice.reducer;