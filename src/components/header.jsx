"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Logo from "./Logo";
import NavMenu from "./NavMenu";
import { useAuth } from "@/lib/authContext";
import Image from "next/image";
import {
  IoSunnyOutline,
  IoMoonOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { toast } from "react-toastify";
import { DARK_THEME, LIGHT_THEME } from "@/constants/theme";
import { toggleTheme } from "@/redux/userPreferences/userPreferenceSlice";
import { formatImageUrl } from "../helpers/url";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.userPreferences);
  const cart = useSelector((state) => state.cart);
  const cartItemsCount =
    cart?.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
    router.push("/");
  };

  return (
    <header
      className="fixed top-0 left-0 z-[60] w-full border-b shadow-sm transition-colors duration-300"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="container-7xl flex items-center justify-between py-4 md:py-5">
        {/* LEFT: Logo + Nav */}
        <div className="flex items-center gap-6 min-w-0">
          <Logo />
          <div className="hidden lg:block h-6 w-px bg-gray-200 dark:bg-purple-900/30"></div>
          <NavMenu />
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-1.5 text-primary hover:text-primary/70 transition-all active:scale-90 outline-none border-none focus:outline-none focus:ring-0 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/30"
              aria-label="Toggle Theme"
            >
              {theme === DARK_THEME ? (
                <IoSunnyOutline size={22} />
              ) : (
                <IoMoonOutline size={22} />
              )}
            </button>
          )}

          {/* Search Icon */}
          <Link href="/search/profiles">
            <div
              className="p-1.5 text-primary hover:text-primary/70 transition-all cursor-pointer active:scale-90 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/30"
              aria-label="Search User Profiles"
            >
              <IoSearchOutline size={22} />
            </div>
          </Link>

          {/* Cart */}
          <Link href="/arts/cart">
            <div
              className="p-1.5 text-primary hover:text-primary/70 transition-all cursor-pointer active:scale-90 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/30 relative"
              aria-label="Cart"
            >
              <MdOutlineAddShoppingCart size={22} />
              {mounted && cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </div>
          </Link>

          {/* Auth Buttons */}
          {mounted &&
            (isAuthenticated ? (
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Notification Bell */}
                <NotificationBell />

                {/* Profile Avatar */}
                <Link
                  href="/profile"
                  className="relative text-gray-700 dark:text-purple-200 hover:text-purple-700 transition p-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 flex items-center justify-center overflow-hidden h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
                  aria-label="Profile"
                >
                  {user?.profileImageUrl ? (
                    <Image
                      src={formatImageUrl(user.profileImageUrl)}
                      alt="Profile"
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <FaUserCircle size={20} />
                  )}
                </Link>

                {/* Logout — icon only on sm/md/lg, icon+text on xl+ */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 p-1.5 xl:px-3 xl:py-1.5 rounded-lg border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-all active:scale-95 flex-shrink-0"
                  aria-label="Logout"
                >
                  <FaSignOutAlt
                    size={16}
                    className="text-red-600 flex-shrink-0"
                  />
                  <span className="hidden xl:inline text-sm font-bold whitespace-nowrap">
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-purple-600 !text-white hover:bg-purple-700 transition text-sm font-bold shadow-sm flex-shrink-0"
              >
                <CiLogin size={18} />
                <span className="hidden sm:inline">Login</span>
              </button>
            ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
