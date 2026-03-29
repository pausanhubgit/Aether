"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

const MediaSearch = ({ placeholder = "Search..." }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("name") || "");

  useEffect(() => {
    setSearchTerm(searchParams.get("name") || "");
  }, [searchParams]);

  function handleSearch(e) {
    if (e.key !== "Enter" && e.type !== "click") return;

    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("name", searchTerm);
    } else {
      params.delete("name");
    }
    // Maintain genre/category if present, but usually search is global for the page
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearSearch() {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("name");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none transition-colors group-focus-within:text-purple-500">
        <FaMagnifyingGlass className="w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm py-2.5 ps-11 pe-10 text-sm text-black focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-gray-600 dark:bg-[#160327] dark:text-white transition-all shadow-sm"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearch}
      />
      {searchTerm && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <MdClose className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default MediaSearch;
