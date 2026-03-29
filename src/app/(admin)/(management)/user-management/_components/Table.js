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
  {
    label: "User",
    key: "user",
  },
  {
    label: "Email",
    key: "email",
  },
  {
    label: "Phone",
    key: "phone",
  },
  {
    label: "Roles",
    key: "roles",
  },
  {
    label: "Created at",
    key: "createdAt",
  },
];


const UsersTable = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    setLoading(true);
    usersApi.getAllUsers()
      .then((response) => {
        setUsers(response.data);
        if (response.data.length === 0) {
          toast.info("No registered users found.");
        }
      })
      .catch((error) => {
        toast.error(error.response?.data || "Failed to fetch users", { autoClose: 1500 });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="relative overflow-hidden bg-white shadow-md dark:bg-[#160327] sm:rounded-lg border border-gray-300 dark:border-gray-700 ">
      <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
        <div className="flex items-center flex-1 space-x-4">
          <h5 className="flex items-center gap-2">
            <span className="text-gray-500 font-bold">COMMUNITY RECORDS: </span>
            <span className="dark:text-white bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
              {users?.length || 0} Registered Users
            </span>
          </h5>
        </div>
        <button 
          onClick={fetchUsers}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold uppercase tracking-widest rounded-xl transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? 'Refreshing...' : 'Refresh Records'}
        </button>
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
                >
                  <div className="flex items-center gap-2">{column.label}</div>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 flex justify-center">
                <FaCog />
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
                <td className="px-4 py-2">{user.phone}</td>
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
                  {user.createdAt ? format(new Date(user.createdAt), "dd MMM, yyyy") : "N/A"}
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