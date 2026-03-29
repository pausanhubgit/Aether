"use client";
import {
  DASHBOARD_ROUTE,
  ORDER_MANAGEMENT_ROUTE,
  ART_MANAGEMENT_ROUTE,
  PROFILE_ROUTE,
  USER_MANAGEMENT_ROUTE,
  MESSAGES_MANAGEMENT_ROUTE,
  SUBSCRIBERS_MANAGEMENT_ROUTE,
} from "@/constants/routes";
import { ADMIN_ROLE, MERCHANT_ROLE, USER_ROLE } from "@/constants/userRoles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaLuggageCart, FaShoppingBasket, FaUserCog, FaEnvelope, FaBell } from "react-icons/fa";
import { FaChartPie, FaUsers } from "react-icons/fa6";
import { useSelector } from "react-redux";

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

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const pathname = usePathname();

  return (
    <div className="hidden lg:block w-64 bg-white absolute top-0 left-0 h-full z-20 border-r border-gray-200 dark:bg-[#160327] dark:border-purple-900/50">
      <div className="p-4 flex flex-col gap-1">
        {adminMenu.map((menu) => {
          const isActive = pathname.startsWith(menu.route);

          if (!user?.roles?.some((role) => menu.allowedRoles.includes(role)))
            return null;

          return (
            <Link
              key={menu.route}
              className={`px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary !text-white shadow-lg shadow-primary/20"
                  : "bg-primary/5 text-gray-700 dark:text-purple-200 dark:bg-purple-950/40 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              }`}
              href={menu.route}
            >
              {menu.icon}
              {menu.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;