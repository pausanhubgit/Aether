"use client";

import { LOGIN_ROUTE } from "@/constants/routes";
import { ADMIN_ROLE } from "@/constants/userRoles";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Spinner from "@/components/Spinner";
import Sidebar from "./_components/Slidebar";

const AdminLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !user) {
      router.push(LOGIN_ROUTE);
    }
  }, [hasMounted, user, router]);

  // During SSR and initial hydration, show spinner to prevent flash-redirect
  if (!hasMounted || !user)
    return (
      <div className="flex justify-center py-20">
        <Spinner className="w-12 h-12 fill-primary" />
      </div>
    );

  const isAdmin = user?.roles?.some(role => role.toLowerCase() === ADMIN_ROLE.toLowerCase()) || user?.role?.toLowerCase() === ADMIN_ROLE.toLowerCase() || user?.roles?.includes(ADMIN_ROLE);
  const isNoSidebarPage = pathname === "/profile" || pathname.includes("/profile/") || pathname === "/dashboard";
  const showSidebar = !isNoSidebarPage && isAdmin;

  return (
    <div className={`relative ${showSidebar ? 'lg:pl-64' : ''}`}>
      {showSidebar && <Sidebar />}
      <section className={`bg-gray-50 dark:bg-[#0d0118] min-h-screen py-4 sm:py-8`}>
        {children}
      </section>
    </div>
  );
};

export default AdminLayout;