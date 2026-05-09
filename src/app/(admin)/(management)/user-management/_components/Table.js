"use client";
import { format } from "date-fns";
import { FaCog } from "react-icons/fa";
import { useEffect, useState } from "react";
import usersApi from "@/api/users";
import Action from "./Action";
import Image from "next/image";
import { FaUser } from "react-icons/fa6";
import { toast } from "react-toastify";

const columns = [
  { label: "User", key: "user" },
  { label: "Email", key: "email" },
  { label: "Roles", key: "roles" },
  { label: "Created at", key: "createdAt" },
];

const UsersTable = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    setLoading(true);
    usersApi
      .getAllUsers()
      .then((response) => {
        setUsers(response.data);
        if (response.data.length === 0)
          toast.info("No registered users found.");
      })
      .catch((error) => {
        toast.error(error.response?.data || "Failed to fetch users", {
          autoClose: 1500,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="relative overflow-hidden bg-white shadow-md dark:bg-[#160327] sm:rounded-lg border border-gray-300 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col px-4 py-3 space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
        <h5 className="flex items-center gap-2">
          <span className="text-gray-500 font-bold text-sm">
            COMMUNITY RECORDS:
          </span>
          <span className="dark:text-white bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            {users?.length || 0} Registered Users
          </span>
        </h5>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold uppercase tracking-widest rounded-xl transition disabled:opacity-50 flex items-center gap-2 self-start sm:self-auto"
        >
          {loading ? "Refreshing..." : "Refresh Records"}
        </button>
      </div>

      {/* ── Mobile card layout (sm only) ── */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
        {users.map((user, index) => (
          <div key={index} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt=""
                    height={40}
                    width={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold text-sm">
                    {user.name?.charAt(0) || "?"}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                    {user.email}
                  </p>
                </div>
              </div>
              {/* Edit & Delete always visible on mobile */}
              <Action id={user._id} userRoles={user.roles} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded border border-primary/30 font-semibold uppercase"
                  >
                    {role}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                {user.createdAt
                  ? format(new Date(user.createdAt), "dd MMM yyyy")
                  : "N/A"}
              </span>
            </div>
          </div>
        ))}
        {users.length === 0 && !loading && (
          <p className="text-center py-10 text-gray-400 font-medium">
            No users found.
          </p>
        )}
      </div>

      {/* ── Desktop table layout (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
          <thead className="text-xs text-gray-700 font-medium uppercase bg-gray-50 dark:bg-[#160327] dark:text-gray-300">
            <tr>
              {columns.map((column, index) => (
                <th
                  scope="col"
                  className="px-4 py-3 cursor-pointer"
                  key={index}
                >
                  <div className="flex items-center gap-2">{column.label}</div>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-center">
                <FaCog className="mx-auto" />
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 font-medium">
                  <div className="flex items-center gap-2">
                    {user.profileImageUrl ? (
                      <Image
                        src={user.profileImageUrl}
                        alt=""
                        height={64}
                        width={64}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="h-10 w-10 rounded-full p-2 bg-gray-200" />
                    )}
                    <h3>{user.name}</h3>
                  </div>
                </td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="px-1 mx-0.5 text-xs bg-primary/10 text-primary rounded border-primary/30 border"
                    >
                      {role}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap">
                  {user.createdAt
                    ? format(new Date(user.createdAt), "dd MMM, yyyy")
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <Action id={user._id} userRoles={user.roles} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
