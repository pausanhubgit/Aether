"use client";
import {
  FaAngleLeft,
  FaAngleRight,
  FaPencil,
  FaPlus,
  FaUpload,
} from "react-icons/fa6";
import { format } from "date-fns";
import { FaCog, FaMusic } from "react-icons/fa";
import Link from "next/link";
import DeleteMusicButton from "./DeleteButton";
import { useEffect, useState } from "react";
import musicAPI from "@/api/music";
import { useDispatch, useSelector } from "react-redux";
import { refreshList } from "@/redux/music/musicSlice";
import {
  HiArrowSmallDown,
  HiArrowSmallUp,
  HiMiniArrowsUpDown,
} from "react-icons/hi2";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import { ADMIN_ROLE } from "@/constants/userRoles";
import { MUSIC_MANAGEMENT_ROUTE } from "@/constants/routes";

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
    label: "Artist",
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

const MusicTable = () => {
  const [musicList, setMusicList] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState(-1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const { refresh } = useSelector((state) => state.music);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  async function getAllMusic(query) {
    setLoading(true);
    try {
      const isAdmin = user?.roles?.includes(ADMIN_ROLE);
      const apiQuery = isAdmin ? query : { ...query, createdBy: user._id };
      
      const response = await musicAPI.getMusic(apiQuery);
      setMusicList(Array.isArray(response?.data) ? response.data : []);
      
      const countRes = await musicAPI.getMusicCount(isAdmin ? { name: query.name } : { createdBy: user._id });
      setTotal(typeof countRes?.data === 'number' ? countRes.data : 0);
    } catch (error) {
       toast.error(error?.response?.data?.error || "Failed to fetch music", { autoClose: 1500 });
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
    getAllMusic(query);
  }, [refresh, sortBy, sortOrder, page]);

  return (
    <div className="relative overflow-hidden backdrop-blur-md bg-white/80 dark:bg-[#160327]/80 shadow-2xl border border-white/20 dark:border-gray-700/30 sm:rounded-2xl transition-all duration-300">
      <div className="flex flex-col px-6 py-6 space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center flex-1 space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-xl animate-pulse-slow">
            <FaMusic className="text-blue-500 text-xl" />
          </div>
          <div>
            <h5 className="text-xl font-bold text-black dark:text-white">Music Collection</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">Organize and publish your audio tracks</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`${MUSIC_MANAGEMENT_ROUTE}/add`}
            className="flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 hover:scale-105 transition-transform shadow-lg shadow-blue-500/25"
          >
            <FaPlus className="h-3.5 w-3.5 mr-2" />
            Upload Music
          </Link>
          <button
            type="button"
            className="p-2.5 text-gray-500 hover:text-blue-500 bg-gray-50 dark:bg-[#160327] rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
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
                  className="px-6 py-4 cursor-pointer hover:text-blue-500 transition-colors"
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
                          sortOrder == 1 ? <HiArrowSmallUp className="text-blue-500" /> : <HiArrowSmallDown className="text-blue-500" />
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
            ) : musicList.map((music, index) => (
              <tr
                key={music._id || index}
                className="group hover:bg-blue-500/[0.02] dark:hover:bg-blue-500/[0.01] transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-400">
                  {((page - 1) * PAGE_LIMIT) + index + 1}
                </td>
                <th
                  scope="row"
                  className="px-6 py-4"
                >
                  <div className="flex items-center font-semibold text-black dark:text-gray-100 group-hover:text-blue-500 transition-colors">
                    <div className="h-10 w-10 mr-4 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <FaMusic className="text-blue-500" />
                    </div>
                    <div>
                      <span className="block truncate max-w-[200px]">{music.title || "Untitled Track"}</span>
                      <span className="text-[10px] text-gray-400 font-normal uppercase tracking-widest">{music.genre || "Instrumental"}</span>
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {music.artist || "Anonymous"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-semibold rounded-lg uppercase">
                    {music.genre || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                    <span className="font-bold">{music.likes || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">
                  {music.createdAt ? format(new Date(music.createdAt), "dd MMM yyyy") : "---"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 justify-center text-lg">
                    <Link
                      href={`${MUSIC_MANAGEMENT_ROUTE}/edit/${music._id || music.id}`}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                    >
                      <FaPencil className="w-4 h-4" />
                    </Link>
                    <DeleteMusicButton id={music._id || music.id} />
                  </div>
                </td>
              </tr>
            ))}
            {!loading && musicList.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-[#160327] rounded-full flex items-center justify-center mb-6">
                      <FaMusic className="text-blue-200 text-4xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-black dark:text-white uppercase tracking-tighter">Silence is Golden</h3>
                    <p className="text-gray-500 max-w-[250px] mx-auto mt-2 text-sm leading-relaxed">Break the silence by uploading your first musical masterpiece today.</p>
                    <Link href={`${MUSIC_MANAGEMENT_ROUTE}/add`} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                      Get Started
                    </Link>
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

export default MusicTable;