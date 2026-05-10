"use client";
import navLinks from "@/constants/navlinks";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NavMenu = ({ onClose }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on route change
  useEffect(() => {
    onClose?.();
  }, [pathname]);

  const handleLinkClick = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Hamburger — visible below lg (< 1024px) */}
      <button
        className="lg:hidden flex flex-col justify-center items-center w-9 h-9 space-y-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        <span
          className={`block w-5 h-0.5 bg-gray-600 dark:bg-purple-300 transition-all duration-300 origin-center ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-gray-600 dark:bg-purple-300 transition-all duration-300 ${
            isOpen ? "opacity-0 scale-x-0" : ""
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-gray-600 dark:bg-purple-300 transition-all duration-300 origin-center ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Desktop nav — visible at lg+ */}
      <nav className="hidden lg:flex items-center gap-0.5">
        {navLinks.map((link) => {
          const isActive =
            pathname === link.route ||
            (link.route !== "/" && pathname.startsWith(link.route));
          return (
            <Link
              key={link.route}
              href={link.route}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400"
                  : "text-slate-600 dark:text-purple-300/80 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile dropdown — visible below lg */}
      {isOpen && (
        <div
          className="lg:hidden absolute top-full left-0 mt-2 w-52 rounded-xl shadow-xl border z-50 overflow-hidden"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <nav className="flex flex-col py-2">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.route ||
                (link.route !== "/" && pathname.startsWith(link.route));
              return (
                <Link
                  key={link.route}
                  href={link.route}
                  onClick={handleLinkClick}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-l-2 border-purple-600 dark:border-purple-400"
                      : "text-slate-600 dark:text-purple-300/80 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};

export default NavMenu;
