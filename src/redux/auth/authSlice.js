import { loginUser, registerUser, updateUserProfile, loginWithGoogle } from "./authActions";

const { createSlice } = require("@reduxjs/toolkit");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null, // Explicitly store token
    isAuthenticated: false,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    initializeAuth: (state) => {
      // redux-persist handles hydration automatically
    },

    logoutUser: (state) => {
      state.user = null;
      state.token = null; // Clear token on logout
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("authtoken");
      }
    },

    resetSuccess: (state) => {
      state.success = false;
    },

    updateUser: (state, action) => {
      // Accept either a full user object or a plain URL string (legacy)
      if (typeof action.payload === 'string') {
        state.user = { ...state.user, profileImageUrl: action.payload };
      } else {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        const result = action.payload;
        let userObj = result?.user ?? result;
        
        // Ensure MERCHANT role is added as requested by user
        if (userObj && userObj.roles) {
          if (!userObj.roles.includes("MERCHANT")) {
            userObj.roles = [...userObj.roles, "MERCHANT"];
          }
        } else if (userObj) {
          userObj.roles = ["USER", "MERCHANT"];
        }

        state.user = userObj;
        state.token = result?.authtoken ?? result?.token ?? result?.authToken ?? 
                      userObj?.authtoken ?? userObj?.token;
        state.isAuthenticated = true;

        // Persist token for plain localStorage fallback (Axios interceptors)
        if (typeof window !== "undefined" && state.token) {
          localStorage.setItem("authtoken", state.token);
        }
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const result = action.payload;
        // The backend returns a flat object: { authtoken, _id, username, email, roles }
        // or sometimes a nested { user, token } structure in other parts of the app.
        let userObj = result?.user ?? result;
        
        // Ensure MERCHANT role is added as requested by user
        if (userObj && userObj.roles) {
          if (!userObj.roles.includes("MERCHANT")) {
            userObj.roles = [...userObj.roles, "MERCHANT"];
          }
        } else if (userObj) {
          userObj.roles = ["USER", "MERCHANT"];
        }

        state.user = userObj;
        
        // Comprehensive token extraction including the specific 'authtoken' key
        state.token = result?.authtoken ?? result?.token ?? result?.authToken ?? 
                      userObj?.authtoken ?? userObj?.token;
        
        state.isAuthenticated = true;

        // Persist token for plain localStorage fallback (Axios interceptors)
        if (typeof window !== "undefined" && state.token) {
          localStorage.setItem("authtoken", state.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        const result = action.payload;
        let userObj = result?.user ?? result;

        // Ensure MERCHANT role is added as requested by user
        if (userObj && userObj.roles) {
          if (!userObj.roles.includes("MERCHANT")) {
            userObj.roles = [...userObj.roles, "MERCHANT"];
          }
        } else if (userObj) {
          userObj.roles = ["USER", "MERCHANT"];
        }

        state.user = userObj;
        
        // Comprehensive token extraction
        state.token = result?.authtoken ?? result?.token ?? result?.authToken ?? 
                      userObj?.authtoken ?? userObj?.token;
                      
        state.isAuthenticated = true;

        // Persist token for plain localStorage fallback (Axios interceptors)
        if (typeof window !== "undefined" && state.token) {
          localStorage.setItem("authtoken", state.token);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Merge the updated user data into the existing user object
        const updatedData = action.payload?.user ?? action.payload;
        if (state.user) {
          state.user = { ...state.user, ...updatedData };
        } else {
          state.user = updatedData;
        }
        // IMPORTANT: Ensure the token is NOT lost during profile updates. 
        // If the update response doesn't include a token, keep the current one.
        const newToken = action.payload?.authtoken ?? action.payload?.token;
        if (newToken) {
            state.token = newToken;
            if (typeof window !== "undefined") {
              localStorage.setItem("authtoken", newToken);
            }
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { initializeAuth, logoutUser, resetSuccess, updateUser } = authSlice.actions;

export default authSlice.reducer;

/**
 * Thunk actions => async process
 * 3 states:
 * 1. Pending -> loading
 * 2. Fulfilled -> success
 * 3. Rejected -> error
 *
 * used in extraReducers
 *
 */