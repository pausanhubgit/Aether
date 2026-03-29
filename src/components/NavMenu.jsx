"use client";
import navLinks from "@/constants/navlinks";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

const NavMenu = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Menu Button for Small Screens */}
      <button
        className="sm:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`block w-6 h-0.5 bg-gray-600 dark:bg-purple-300 transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-gray-600 dark:bg-purple-300 transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-gray-600 dark:bg-purple-300 transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Navigation Menu */}
      <nav style={isOpen ? { backgroundColor: 'var(--surface)', borderColor: 'var(--border)' } : {}} className={`sm:flex items-center gap-1 px-2 py-2 ${isOpen ? 'flex flex-col absolute top-16 left-0 right-0 border-b z-50' : 'hidden'}`}>
        {navLinks.map((link) => {
          const isActive =
            pathname === link.route ||
            (link.route !== "/" && pathname.startsWith(link.route));
          return (
            <Link
              key={link.route}
              href={link.route}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400"
                  : "text-slate-600 dark:text-purple-300/80 hover:text-purple-600 dark:hover:text-purple-400"
              } ${isOpen ? 'w-full text-center' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default NavMenu;