"use client";
import { FaAngleLeft, FaPencil, FaPlus, FaUpload } from "react-icons/fa6";
import { format } from "date-fns";
import { FaCog } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { ART_MANAGEMENT_ROUTE } from "@/constants/routes";
import DeleteArtButton from "./DeleteButton";
import { useEffect, useState } from "react";
import artsAPI from "@/api/arts";
import { useDispatch, useSelector } from "react-redux";
import { refreshList } from "@/redux/art/artSlice";
import {
  HiArrowSmallDown,
  HiArrowSmallUp,
  HiMiniArrowsUpDown,
} from "react-icons/hi2";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import { ADMIN_ROLE } from "@/constants/userRoles";
import butterflyImg from "@/assets/images/Background/butterfly.jpg";

const columns = [
  {
    label: "S.N",
    key: "id",
    sortable: false,
  },
  {
    label: "Art Piece",
    key: "name",
    sortable: true,
  },

  {
    label: "Category",
    key: "category",
    sortable: true,
  },
  {
    label: "Price",
    key: "price",
    sortable: true,
  },
  {
    label: "Stock",
    key: "stock",
    sortable: true,
  },
  {
    label: "Created At",
    key: "createdAt",
    sortable: true,
  },
];

const PAGE_LIMIT = 10;

const ArtsTable = () => {
  const [artsList, setArtsList] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState(-1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const { refresh } = useSelector((state) => state.art);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  async function getAllArts(query) {
    setLoading(true);
    try {
      const isAdmin = user?.roles?.some(
        (r) => r.toUpperCase() === ADMIN_ROLE.toUpperCase(),
      );
      const apiQuery = isAdmin ? query : { ...query, createdBy: user._id };

      const response = await artsAPI.getArt(apiQuery);
      setArtsList(Array.isArray(response?.data) ? response.data : []);

      const countRes = await artsAPI.getArtsCount(
        isAdmin ? { name: query.name } : { createdBy: user._id },
      );
      setTotal(typeof countRes?.data === "number" ? countRes.data : 0);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to fetch arts", {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
      dispatch(refreshList(false));
    }
  }

  useEffect(() => {
    const query = {
      limit: PAGE_LIMIT,
      offset: PAGE_LIMIT * (page - 1),
      sort: JSON.stringify({ [sortBy]: sortOrder }),
    };
    getAllArts(query);
  }, [refresh, sortBy, sortOrder, page]);

  return (
    <div className="relative backdrop-blur-md bg-white/80 dark:bg-[#160327]/80 shadow-2xl border border-white/20 dark:border-gray-700/30 sm:rounded-2xl transition-all duration-300">
      <div className="flex flex-col px-6 py-6 space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center flex-1 space-x-4">
          <div className="p-1 bg-primary/10 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
            <Image
              src={butterflyImg}
              width={36}
              height={36}
              alt="Arts"
              className="object-cover transition-transform hover:scale-110"
            />
          </div>
          <div>
            <h5 className="text-xl font-bold text-black dark:text-white">
              Arts Gallery
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Curate and manage your artistic collection
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`${ART_MANAGEMENT_ROUTE}/add`}
            className="flex items-center justify-center px-5 py-2.5 text-sm font-semibold !text-white rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform shadow-lg shadow-primary/25"
          >
            <FaPlus className="h-3.5 w-3.5 mr-2 !text-white" />
            <span className="!text-white">Add Art</span>
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
                          sortOrder == 1 ? (
                            <HiArrowSmallUp className="text-primary" />
                          ) : (
                            <HiArrowSmallDown className="text-primary" />
                          )
                        ) : (
                          <HiMiniArrowsUpDown />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th
                scope="col"
                className="px-6 py-4 text-center sticky right-0 bg-gray-50/50 dark:bg-[#160327]/50 shadow-[-5px_0_10px_rgba(0,0,0,0.02)]"
              >
                <FaCog className="mx-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 dark:bg-[#160327] rounded-full w-full"></div>
                    </td>
                  </tr>
                ))
              : artsList.map((art, index) => (
                  <tr
                    key={art._id || index}
                    className="group hover:bg-primary/[0.02] dark:hover:bg-primary/[0.01] transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-400">
                      {(page - 1) * PAGE_LIMIT + index + 1}
                    </td>
                    <th scope="row" className="px-6 py-4">
                      <div className="flex items-center font-semibold text-black dark:text-gray-100 group-hover:text-primary transition-colors">
                        <div className="h-12 w-12 mr-4 bg-gray-100 dark:bg-[#160327] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group-hover:scale-110 transition-transform">
                          <Image
                            height={48}
                            width={48}
                            src={art.imageUrls?.[0] || "/placeholder.jpg"}
                            alt={art.name || "Art Thumbnail"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="block">
                            {art.title || "Untitled Art"}
                          </span>
                          <span className="text-[11px] text-gray-400 font-normal">
                            {art.brand || "Original Series"}
                          </span>
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-lg uppercase tracking-tight">
                        {art.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-black dark:text-gray-100 font-bold text-sm">
                        Rs. {art.price?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${art.stock > 10 ? "bg-green-500" : art.stock > 0 ? "bg-yellow-500" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`}
                        ></div>
                        <span
                          className={`text-xs font-semibold ${art.stock === 0 ? "text-red-500" : "text-gray-600 dark:text-gray-400"}`}
                        >
                          {art.stock ?? 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs font-medium">
                      {art.createdAt
                        ? format(new Date(art.createdAt), "MMM dd, yyyy")
                        : "---"}
                    </td>
                    <td className="px-6 py-4 sticky right-0 bg-white dark:bg-[#160327] shadow-[-5px_0_10px_rgba(0,0,0,0.02)] group-hover:bg-primary/[0.02] dark:group-hover:bg-[#1c0433] transition-colors">
                      <div className="flex items-center gap-3 justify-center">
                        <Link
                          href={`${ART_MANAGEMENT_ROUTE}/edit/${art._id}`}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        >
                          <FaPencil />{" "}
                          <span className="text-xs font-semibold text-blue-500">
                            Edit
                          </span>
                        </Link>
                        <DeleteArtButton id={art._id} />
                      </div>
                    </td>
                  </tr>
                ))}
            {!loading && artsList.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-[#160327] rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
                      <Image
                        src="/logo.png"
                        width={40}
                        height={40}
                        alt="Empty"
                        className="grayscale opacity-20"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-black dark:text-white">
                      No Art Found
                    </h3>
                    <p className="text-gray-500 max-w-[200px] mx-auto mt-1 text-sm italic">
                      &ldquo;Every artist was first an amateur.&rdquo;
                    </p>
                    <Link
                      href={`${ART_MANAGEMENT_ROUTE}/add`}
                      className="mt-4 text-primary font-semibold text-sm hover:underline"
                    >
                      Create your first piece →
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

export default ArtsTable;
