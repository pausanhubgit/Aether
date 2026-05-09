"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

const AuthMenu = () => {
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (isLoggedIn) {
    return (
      <button
        onClick={handleLogout}
        className="text-sm font-semibold bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
      >
        <FaSignOutAlt />
        Logout
      </button>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm font-semibold bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
    >
      <FaSignInAlt />
      Login
    </Link>
  );
};

export default AuthMenu;
