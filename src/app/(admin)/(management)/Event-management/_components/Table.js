"use client";
import {
  FaAngleLeft,
  FaAngleRight,
  FaPencil,
  FaPlus,
  FaUpload,
} from "react-icons/fa6";
import { format } from "date-fns";
import { FaCog, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import DeleteEventButton from "./DeleteButton";
import { useEffect, useState } from "react";
import eventsAPI from "@/api/events";
import { useDispatch, useSelector } from "react-redux";
import { refreshList } from "@/redux/events/eventSlice";
import {
  HiArrowSmallDown,
  HiArrowSmallUp,
  HiMiniArrowsUpDown,
} from "react-icons/hi2";
import Pagination from "./Pagination";
import { toast } from "react-toastify";

const columns = [
  {
    label: "S.N",
    key: "id",
    sortable: false,
  },
  {
    label: "Event Title",
    key: "title",
    sortable: true,
  },
  {
    label: "Type",
    key: "eventType",
    sortable: true,
  },
  {
    label: "Prize",
    key: "prizePool",
    sortable: true,
  },
  {
    label: "Status",
    key: "status",
    sortable: true,
  },
  {
    label: "Created At",
    key: "createdAt",
    sortable: true,
  },
];

const PAGE_LIMIT = 10;

const EventTable = () => {
  const [events, setEvents] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState(-1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { refresh } = useSelector((state) => state.events);
  const dispatch = useDispatch();

  async function getAllEvents() {
    try {
      const response = await eventsAPI.getEvents();
      setEvents(response?.data || []);
      
      try {
        const countRes = await eventsAPI.getEventsCount();
        setTotal(countRes?.data || response?.data?.length || 0);
      } catch (err) {
        setTotal(response?.data?.length || 0);
      }
    } catch (error) {
      toast.error(error?.response?.data || "Failed to fetch events", { autoClose: 1500 });
    } finally {
      dispatch(refreshList(false));
    }
  }

  useEffect(() => {
    getAllEvents();
  }, [refresh, dispatch]);

  return (
    <div className="relative overflow-hidden bg-white shadow-md dark:bg-[#160327] border border-gray-300 dark:border-gray-700 sm:rounded-lg">
      <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
        <div className="flex items-center flex-1 space-x-4">
          <h5>
            <span className="text-gray-500">All Events: </span>
            <span className="dark:text-white">{events?.length || 0}</span>
          </h5>
        </div>
        <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
          <Link
            href={`/Event-management/add`}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary/90"
          >
            <FaPlus className="h-3.5 w-3.5 mr-2" />
            Create Event
          </Link>
          <button
            type="button"
            className="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-[#160327] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <FaUpload className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
          <thead className="text-xs text-gray-700 font-medium uppercase bg-gray-50 dark:bg-[#160327] dark:text-gray-300">
            <tr>
              {columns.map((column, index) => (
                <th
                  scope="col"
                  className="px-4 py-3 cursor-pointer"
                  key={index}
                  onClick={() => {
                    if (!column.sortable) return;
                    setSortBy(column.key);
                    setSortOrder(sortOrder == 1 ? -1 : 1);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable ? (
                      column.key == sortBy ? (
                        sortOrder == 1 ? <HiArrowSmallUp /> : <HiArrowSmallDown />
                      ) : <HiMiniArrowsUpDown />
                    ) : null}
                  </div>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 flex justify-center">
                <FaCog />
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2">
                  <div className="flex items-center">{index + 1}.</div>
                </td>
                <th
                  scope="row"
                  className="flex items-center px-4 py-2 font-medium whitespace-nowrap"
                >
                  <div className="h-8 w-8 mr-3 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="text-indigo-500" />
                  </div>
                  {event.title}
                </th>
                <td className="px-4 py-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    event.eventType === 'Art' ? 'bg-purple-100 text-purple-800' :
                    event.eventType === 'Music' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {event.eventType}
                  </span>
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap">
                  <div className="flex items-center">{event.prizePool || "None"}</div>
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`inline-block w-3 h-3 mr-2 rounded-full ${
                      event.status === 'Active' ? 'bg-green-500' : 
                      event.status === 'Completed' ? 'bg-gray-500' : 'bg-yellow-500'
                    }`} />
                    {event.status}
                  </div>
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap">
                  {event.createdAt ? format(new Date(event.createdAt), "dd MMM, yyyy") : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-4 justify-center">
                    <DeleteEventButton id={event._id} />
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} setPage={setPage} total={total} />
    </div>
  );
};

export default EventTable;