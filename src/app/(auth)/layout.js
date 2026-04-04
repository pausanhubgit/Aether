"use client";
import { HOME_ROUTE } from "@/constants/routes";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Logo from "@/components/Logo";

function AuthLayout({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.push(HOME_ROUTE);
  }, [isAuthenticated, router]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#06010d] px-4 py-12 md:py-20 transition-colors duration-500">
      <div className="w-full max-w-5xl">
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full bg-white dark:bg-[#110221] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10">
            <div className="hidden md:flex bg-gradient-to-br from-primary via-purple-700 to-indigo-900 py-16 px-12 justify-center flex-col relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -ml-16 -mb-16 group-hover:scale-125 transition-transform duration-700"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-white text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">
                  Welcome to Aether
                </h2>
                <p className="text-purple-100/90 text-lg font-medium leading-relaxed">
                  Join the most vibrant creator community. Showcase your arts, music, and videos with the world.
                </p>
                <div className="mt-10 h-1 w-20 bg-white/30 mx-auto rounded-full"></div>
              </div>
            </div>
            <div className="p-4 sm:p-8 md:p-10 lg:p-12 overflow-y-auto max-h-[90vh] md:max-h-none">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}

export default AuthLayout;