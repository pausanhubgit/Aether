import Link from "next/link";
import React from "react";
import { FiHome, FiCompass, FiMusic } from "react-icons/fi";
import { FaPalette, FaVideo } from "react-icons/fa6";

const NotFoundPage = () => {
  return (
    <div className="relative min-h-[90vh] bg-slate-50 dark:bg-[#0d0118] flex flex-col items-center justify-center overflow-hidden transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none" />

      {/* Floating Icons Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-20 overflow-hidden">
        <FaPalette className="absolute top-20 left-[15%] text-6xl animate-float" />
        <FiMusic className="absolute bottom-32 left-[25%] text-7xl animate-float delay-700" />
        <FaVideo className="absolute top-40 right-[20%] text-6xl animate-float delay-300" />
        <FiCompass className="absolute bottom-20 right-[15%] text-8xl animate-float delay-500" />
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="inline-block relative mb-8">
          <h1 className="text-[12rem] md:text-[18rem] font-black leading-none bg-gradient-to-br from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent opacity-80 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 dark:bg-[#160327]/80 backdrop-blur-xl border border-white/20 dark:border-purple-900/40 px-10 py-4 rounded-3xl shadow-2xl rotate-[-2deg]">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter">
                Dimension Lost
              </h2>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-xl md:text-2xl text-slate-600 dark:text-purple-200/70 font-medium leading-relaxed">
            The masterpiece you&apos;re looking for has drifted into another
            realm. Let&apos;s guide you back to the hub.
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-10">
            <Link href="/">
              <span className="group inline-flex items-center gap-3 bg-primary hover:bg-primary/90 !text-white px-10 py-4 rounded-[2rem] font-bold text-lg shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                <FiHome className="text-xl group-hover:rotate-12 transition-transform" />
                Return to Hub
              </span>
            </Link>

            <Link
              href="/dashboard-home"
              className="flex items-center gap-3 bg-white dark:bg-[#160327] border border-slate-200 dark:border-purple-900/40 text-gray-700 dark:text-white px-10 py-4 rounded-[2rem] font-bold text-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FiCompass className="text-xl transition-transform" />
              Explore Arts
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-3 gap-8 opacity-40 hover:opacity-80 transition-opacity duration-500">
            <Link
              href="/arts"
              className="flex flex-col items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
            >
              <span className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
                <FaPalette />
              </span>
              Arts
            </Link>
            <Link
              href="/music"
              className="flex flex-col items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
            >
              <span className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
                <FiMusic />
              </span>
              Music
            </Link>
            <Link
              href="/video"
              className="flex flex-col items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
            >
              <span className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
                <FaVideo />
              </span>
              Video
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
