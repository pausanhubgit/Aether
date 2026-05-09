"use client";

import { LOGIN_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "@/components/Spinner";

export default function ManagementLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHasMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    // Only block unauthenticated users — role-based filtering is handled inside each table component
    if (!user) {
      router.push(LOGIN_ROUTE);
    }
  }, [hasMounted, user, router]);

  if (!hasMounted) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="w-12 h-12 fill-primary" />
      </div>
    );
  }

  return <div>{children}</div>;
}
