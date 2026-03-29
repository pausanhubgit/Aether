"use client";

import { LOGIN_ROUTE } from "@/constants/routes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Spinner from "@/components/Spinner";
import Sidebar from "./_components/Slidebar";

const AdminLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
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

  return (
    <div className="relative lg:pl-64">
      <Sidebar />
      <section className="bg-gray-50 dark:bg-[#0d0118] min-h-screen py-4 sm:py-8">
        {children}
      </section>
    </div>
  );
};

export default AdminLayout;