import MusicTable from "./_components/Table";
import Link from "next/link";
import { DASHBOARD_ROUTE } from "@/constants/routes";
import { FaArrowLeft, FaPlus } from "react-icons/fa";

const MusicManagementPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#160327]/50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-black dark:text-white tracking-tight">Audio Repository</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Surgical management of your musical assets.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/Music-management/add" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 !text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none">
               <FaPlus className="text-xs !text-white" /> <span className="!text-white">Add Music</span>
            </Link>
            <Link href={DASHBOARD_ROUTE} className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-[#160327] border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm">
              <FaArrowLeft className="text-xs" /> Hub
            </Link>
          </div>
        </div>
        <MusicTable />
      </div>
    </div>
  );
};

export default MusicManagementPage;
