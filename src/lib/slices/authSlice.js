import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, signup, forgotPassword, resetPassword } from '@/api/auth';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await login({ email, password });
      const { user, token } = response.data;
      return { user, token };
    } catch (error) {
      console.log('Auth error details:', error); // Debug log
      const safeError =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (typeof error?.response?.data === 'string' && error.response.data) ||
        error?.message ||
        error?.error ||
        (!error?.response ? 'Network error. Please check your connection.' : 'Invalid email or password. Please try again.');
      return rejectWithValue(safeError);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await signup(userData);
      const { user, token } = response.data;
      return { user, token };
    } catch (error) {
      console.log('Registration error details:', error);
      const safeError =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (typeof error?.response?.data === 'string' && error.response.data) ||
        error?.message ||
        error?.error ||
        (!error?.response ? 'Network error. Please check your connection.' : 'Registration failed. Please try again.');
      return rejectWithValue(safeError);
    }
  }
);

export const forgotUserPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await forgotPassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, userId, data }, { rejectWithValue }) => {
    try {
      const response = await resetPassword(token, userId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      // Handled by redux-persist
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotUserPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(forgotUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  updateProfile,
  clearError,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;