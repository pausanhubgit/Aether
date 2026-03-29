"use client";

import React, { useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Logo from './Logo';
import NavMenu from './NavMenu';
import { useAuth } from '@/lib/authContext';
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { CiLogin } from "react-icons/ci";
import { toast } from 'react-toastify';
import { DARK_THEME, LIGHT_THEME } from '@/constants/theme';
import { toggleTheme } from '@/redux/userPreferences/userPreferenceSlice';
import { formatImageUrl } from '../helpers/url';

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.userPreferences);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!', {
      position: 'top-right',
      autoClose: 2000,
    });
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b shadow-sm transition-colors duration-300" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <Logo />
          <NavMenu />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-1.5 text-primary hover:text-primary/70 dark:hover:text-primary/90 transition-all active:scale-90 outline-none focus:outline-none border-none focus:ring-0"
              aria-label="Toggle Theme"
            >
              {theme === DARK_THEME ? <IoSunnyOutline size={22} /> : <IoMoonOutline size={22} />}
            </button>
          )}

          <Link href="/arts/cart">
            <div className="p-1.5 text-primary hover:text-primary/70 dark:hover:text-primary/90 transition-all cursor-pointer active:scale-90" aria-label="Cart">
              <MdOutlineAddShoppingCart size={22} />
            </div>
          </Link>

          {mounted && (
            isAuthenticated ? (
              <div className="flex items-center gap-3">

                <Link
                  href="/profile"
                  className="text-gray-700 dark:text-purple-200 hover:text-purple-700 transition p-1 rounded-full bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 flex items-center justify-center overflow-hidden h-9 w-9"
                  aria-label="Profile"
                >
                  {user?.profileImageUrl ? (
                    <img
                      src={formatImageUrl(user.profileImageUrl)}
                      alt="Profile"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <FaUserCircle size={22} />
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition flex items-center gap-1.5"
                >
                  <FaSignOutAlt className="text-red-600" size={18} /> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="text-sm font-bold px-4 py-2 rounded-lg bg-purple-600 !text-white hover:bg-purple-700 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <CiLogin size={20} /> Login
              </button>
            )
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
