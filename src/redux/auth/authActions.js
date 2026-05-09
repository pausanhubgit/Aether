import authAPI from "@/api/auth";
const { login, signup, googleLogin } = authAPI;
import usersApi from "@/api/users";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginWithGoogle = createAsyncThunk(
  "auth/googleLogin",
  async (token, { rejectWithValue }) => {
    try {
      const response = await googleLogin(token);
      console.log("[GOOGLE LOGIN] Full response.data:", response.data);
      return response.data;
    } catch (error) {
      const safeError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Google login failed";
      return rejectWithValue(safeError);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await login(data);
      // DEBUG: Log exact backend response shape to find the token key
      console.log("[LOGIN] Full response.data:", response.data);
      return response.data;
    } catch (error) {
      const safeError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Invalid email or password";
      return rejectWithValue(safeError);
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await signup(data);
      console.log("[REGISTER] Full response.data:", response.data);
      return response.data;
    } catch (error) {
      const safeError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";
      return rejectWithValue(safeError);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "auth/update/user",
  async (data, { rejectWithValue }) => {
    try {
      const response = await usersApi.updateUser(data.id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);
