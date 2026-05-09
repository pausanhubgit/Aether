"use client";

import { LOGIN_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function OrderLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!user) {
      router.push(LOGIN_ROUTE);
    }
  }, [user, router]);

  // Don't render protected layout content on the server to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-slate-100 dark:bg-[#160327]">
      <div className="container mx-auto px-4 pb-16">
        <div className="min-h-screen">{children}</div>
      </div>
    </div>
  );
}
