"use client";

import { ART_ROUTE } from "@/constants/routes";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { set } from "react-hook-form";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

const SearchBar = () => {
  const [ArtName, setArtName] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  function searchart(e) {
    if (e.key != "Enter") return;

    const params = new URLSearchParams(searchParams.toString());

    params.set("name", ArtName);
    router.push(`?${params.toString()}`);
  }

  function clearSearch() {
    setArtName("");
    router.push(ART_ROUTE);
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <FaMagnifyingGlass className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>
      <input
        type="text"
        id="search"
        className="block w-full p-2 ps-10 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 dark:bg-[#160327] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
        placeholder="Search for products ..."
        onChange={(e) => setArtName(e.target.value)}
        onKeyDown={searchart}
        value={ArtName}
      />
      <div className="absolute top-0 right-3">
        {ArtName != "" && (
          <button className="text-red-500 w-4 h-4 p-1" onClick={clearSearch}>
            <MdClose />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;