"use client";
import {
  FaAngleLeft,
  FaAngleRight,
  FaPencil,
  FaPlus,
  FaUpload,
} from "react-icons/fa6";
import { format } from "date-fns";
import { FaCog, FaVideo } from "react-icons/fa";
import Link from "next/link";
import DeleteVideoButton from "./DeleteButton";
import { useEffect, useState } from "react";
import videoAPI from "@/api/video";
import { useDispatch, useSelector } from "react-redux";
import { refreshList } from "@/redux/video/videoSlice";
import {
  HiArrowSmallDown,
  HiArrowSmallUp,
  HiMiniArrowsUpDown,
} from "react-icons/hi2";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import { ADMIN_ROLE } from "@/constants/userRoles";
import { VIDEO_MANAGEMENT_ROUTE } from "@/constants/routes";

const columns = [
  {
    label: "S.N",
    key: "id",
    sortable: false,
  },
  {
    label: "Title",
    key: "title",
    sortable: true,
  },

  {
    label: "Artist / Creator",
    key: "artist",
    sortable: true,
  },
  {
    label: "Genre",
    key: "genre",
    sortable: true,
  },
  {
    label: "Likes",
    key: "likes",
    sortable: true,
  },
  {
    label: "Created At",
    key: "createdAt",
    sortable: true,
  },
];

const PAGE_LIMIT = 10;

const VideoTable = () => {
  const [videoList, setVideoList] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState(-1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const { refresh } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  async function getAllVideo(query) {
    setLoading(true);
    try {
      const isAdmin = user?.roles?.includes(ADMIN_ROLE);
      const apiQuery = isAdmin ? query : { ...query, createdBy: user._id };
      
      const response = await videoAPI.getVideo(apiQuery);
      // Backend returns array directly
      setVideoList(Array.isArray(response?.data) ? response.data : []);
      
      const countRes = await videoAPI.getVideoCount(isAdmin ? { name: query.name } : { createdBy: user._id });
      setTotal(typeof countRes?.data === 'number' ? countRes.data : 0);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to fetch videos", { autoClose: 1500 });
    } finally {
      setLoading(false);
      dispatch(refreshList(false));
    }
  }

  useEffect(() => {
    const query = {
      limit: PAGE_LIMIT,
      offset: PAGE_LIMIT * (page - 1),
      sort: JSON.stringify({ [sortBy]: sortOrder })
    };
    getAllVideo(query);
  }, [refresh, sortBy, sortOrder, page]);

  return (
    <div className="relative overflow-hidden backdrop-blur-md bg-white/80 dark:bg-[#160327]/80 shadow-2xl border border-white/20 dark:border-gray-700/30 sm:rounded-2xl transition-all duration-300">
      <div className="flex flex-col px-6 py-6 space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center flex-1 space-x-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <FaVideo className="text-primary text-xl" />
          </div>
          <div>
            <h5 className="text-xl font-bold text-black dark:text-white">Video Library</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage and oversee your video content</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`${VIDEO_MANAGEMENT_ROUTE}/add`}
            className="flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform shadow-lg shadow-primary/25"
          >
            <FaPlus className="h-3.5 w-3.5 mr-2" />
            Add Video
          </Link>
          <button
            type="button"
            className="p-2.5 text-gray-500 hover:text-primary bg-gray-50 dark:bg-[#160327] rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <FaUpload className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
          <thead className="text-xs text-gray-400 font-semibold uppercase bg-gray-50/50 dark:bg-[#160327]/50">
            <tr>
              {columns.map((column, index) => (
                <th
                  scope="col"
                  className="px-6 py-4 cursor-pointer hover:text-primary transition-colors"
                  key={index}
                  onClick={() => {
                    if (!column.sortable) return;
                    setSortBy(column.key);
                    setSortOrder(sortOrder == 1 ? -1 : 1);
                  }}
                >
                  <div className="flex items-center gap-2 text-[11px] tracking-wider">
                    {column.label}
                    {column.sortable && (
                      <div className="text-gray-300 dark:text-gray-600">
                        {column.key == sortBy ? (
                          sortOrder == 1 ? <HiArrowSmallUp className="text-primary" /> : <HiArrowSmallDown className="text-primary" />
                        ) : (
                          <HiMiniArrowsUpDown />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th scope="col" className="px-6 py-4 text-center">
                <FaCog className="mx-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-6 py-4">
                    <div className="h-4 bg-gray-100 dark:bg-[#160327] rounded-full w-full"></div>
                  </td>
                </tr>
              ))
            ) : videoList.map((video, index) => (
              <tr
                key={video._id || index}
                className="group hover:bg-primary/[0.02] dark:hover:bg-primary/[0.01] transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-400">
                  {((page - 1) * PAGE_LIMIT) + index + 1}
                </td>
                <th
                  scope="row"
                  className="px-6 py-4"
                >
                  <div className="flex items-center font-semibold text-black dark:text-gray-100 group-hover:text-primary transition-colors">
                    <div className="h-10 w-10 mr-4 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaVideo className="text-primary" />
                    </div>
                    <div>
                      <span className="block">{video.title || "Untitled"}</span>
                      <span className="text-[11px] text-gray-400 font-normal">ID: {video._id?.slice(-6) || "N/A"}</span>
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-[#160327] rounded-full text-[11px] font-medium">
                    {video.artist || "System Admin"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold rounded-lg uppercase">
                    {video.genre || "General"}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    {video.likes || 0}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium">
                  {video.createdAt ? format(new Date(video.createdAt), "MMM dd, yyyy") : "---"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 justify-center">
                    <Link
                      href={`${VIDEO_MANAGEMENT_ROUTE}/edit/${video._id || video.id}`}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                    >
                      <FaPencil />
                    </Link>
                    <DeleteVideoButton id={video._id || video.id} />
                  </div>
                </td>
              </tr>
            ))}
            {!loading && videoList.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-[#160327] rounded-full flex items-center justify-center mb-4">
                      <FaVideo className="text-gray-300 text-3xl" />
                    </div>
                    <h3 className="text-lg font-bold text-black dark:text-white">No videos yet</h3>
                    <p className="text-gray-500 max-w-[200px] mx-auto mt-1">Start by adding your first masterpiece to the collection.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#160327]/30">
        <Pagination page={page} setPage={setPage} total={total} />
      </div>
    </div>
  );
};

export default VideoTable;