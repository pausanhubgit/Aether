"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#160327] text-gray-700 dark:text-purple-200 rounded-xl border border-gray-200 dark:border-purple-900/40 hover:bg-gray-50 dark:hover:bg-purple-950/40 transition font-bold text-sm shadow-sm"
    >
      <FaArrowLeft className="text-xs" />
      Back
    </button>
  );
};

export default BackButton;
