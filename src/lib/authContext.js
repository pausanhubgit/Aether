"use client";

import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth, logoutUser } from "@/redux/auth/authSlice";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Redux-persist automatically hydrates the `auth` slice.
    // No manual localStorage initialization needed.
  }, [dispatch]);

  const login = (token) => {
    dispatch(initializeAuth());
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const value = {
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
