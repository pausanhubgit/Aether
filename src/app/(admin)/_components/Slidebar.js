"use client";
import {
  DASHBOARD_ROUTE,
  ORDER_MANAGEMENT_ROUTE,
  ART_MANAGEMENT_ROUTE,
  MUSIC_MANAGEMENT_ROUTE,
  VIDEO_MANAGEMENT_ROUTE,
  PROFILE_ROUTE,
  USER_MANAGEMENT_ROUTE,
  MESSAGES_MANAGEMENT_ROUTE,
  SUBSCRIBERS_MANAGEMENT_ROUTE,
} from "@/constants/routes";
import { ADMIN_ROLE, MERCHANT_ROLE, USER_ROLE } from "@/constants/userRoles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaLuggageCart,
  FaShoppingBasket,
  FaUserCog,
  FaEnvelope,
  FaBell,
  FaTimes,
  FaBars,
  FaMusic,
  FaVideo,
} from "react-icons/fa";
import { FaChartPie, FaUsers } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useState } from "react";

const adminMenu = [
  {
    route: DASHBOARD_ROUTE,
    label: "Dashboard",
    icon: <FaChartPie />,
    allowedRoles: [ADMIN_ROLE, MERCHANT_ROLE, USER_ROLE],
  },
  {
    route: ART_MANAGEMENT_ROUTE,
    label: "Art Management",
    icon: <FaShoppingBasket />,
    allowedRoles: [ADMIN_ROLE, MERCHANT_ROLE],
  },
  {
    route: MUSIC_MANAGEMENT_ROUTE,
    label: "Music Management",
    icon: <FaMusic />,
    allowedRoles: [ADMIN_ROLE, MERCHANT_ROLE],
  },
  {
    route: VIDEO_MANAGEMENT_ROUTE,
    label: "Video Management",
    icon: <FaVideo />,
    allowedRoles: [ADMIN_ROLE, MERCHANT_ROLE],
  },
  {
    route: ORDER_MANAGEMENT_ROUTE,
    label: "Order Management",
    icon: <FaLuggageCart />,
    allowedRoles: [ADMIN_ROLE, MERCHANT_ROLE],
  },
  {
    route: USER_MANAGEMENT_ROUTE,
    label: "User Management",
    icon: <FaUsers />,
    allowedRoles: [ADMIN_ROLE],
  },
  {
    route: MESSAGES_MANAGEMENT_ROUTE,
    label: "Messages",
    icon: <FaEnvelope />,
    allowedRoles: [ADMIN_ROLE],
  },
  {
    route: SUBSCRIBERS_MANAGEMENT_ROUTE,
    label: "Subscribers",
    icon: <FaBell />,
    allowedRoles: [ADMIN_ROLE],
  },
  {
    route: PROFILE_ROUTE,
    label: "Profile",
    icon: <FaUserCog />,
    allowedRoles: [ADMIN_ROLE, MERCHANT_ROLE, USER_ROLE],
  },
];

const NavLinks = ({ user, pathname, setIsOpen }) => (
  <div className="p-4 flex flex-col gap-1">
    {adminMenu.map((menu) => {
      const isActive = pathname.startsWith(menu.route);
      if (!user?.roles?.some((role) => menu.allowedRoles.includes(role)))
        return null;
      return (
        <Link
          key={menu.route}
          className={`px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all duration-200 text-sm ${
            isActive
              ? "bg-purple-600 !text-white shadow-lg shadow-purple-600/20"
              : "bg-primary/5 text-gray-700 dark:text-purple-200 dark:bg-purple-950/40 hover:bg-purple-50 dark:hover:bg-purple-900/30"
          }`}
          href={menu.route}
          onClick={() => setIsOpen(false)}
        >
          {menu.icon}
          {menu.label}
        </Link>
      );
    })}
  </div>
);

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 left-4 z-[70] lg:hidden p-3 bg-white dark:bg-[#160327] rounded-2xl shadow-lg border border-gray-100 dark:border-purple-900/50 text-gray-700 dark:text-purple-200 hover:scale-110 transition-transform"
        aria-label="Open sidebar"
      >
        <FaBars className="text-lg" />
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar — always shown on lg, drawer on sm/md */}
      <div
        className={`fixed lg:top-16 top-0 left-0 lg:h-[calc(100vh-4rem)] h-full w-64 bg-white dark:bg-[#160327] z-[90] lg:z-50 border-r border-gray-200 dark:border-purple-900/50 transition-transform duration-300 ease-in-out overflow-y-auto
          lg:translate-x-0 ${
            isOpen
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-purple-900/30">
          <span className="font-bold text-purple-700 dark:text-purple-300 tracking-tight text-sm uppercase">
            Navigation
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Sidebar Links */}
        <NavLinks user={user} pathname={pathname} setIsOpen={setIsOpen} />
      </div>
    </>
  );
};

export default Sidebar;
