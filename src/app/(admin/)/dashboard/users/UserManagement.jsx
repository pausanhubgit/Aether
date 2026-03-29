"use client";

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaUsers, FaEdit, FaTrash, FaSearch, FaBan, FaCheck } from 'react-icons/fa';
import usersAPI from '@/api/users';
import { ToastContainer, toast } from 'react-toastify';

function UserManagement() {
  const router = useRouter();
  const { user: currentUser } = useSelector(state => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchUsers();
  }, [currentUser, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await usersAPI.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await usersAPI.updateUser(userId, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleBanUser = async (userId, isBanned) => {
    try {
      await usersAPI.updateUser(userId, { isBanned: !isBanned });
      setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !isBanned } : u));
      toast.success(`User ${!isBanned ? 'banned' : 'unbanned'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === '' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  if (loading) {
    return (
      <div className="py-10 px-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
        <FaUsers /> User Management
      </h1>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6 flex-col md:flex-row">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="MERCHANT">Merchant</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white dark:bg-[#160327] rounded-lg shadow-lg">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-[#160327] border-b border-gray-300 dark:border-gray-600">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">User Info</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Role</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Email</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Phone</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {(user.firstName?.[0] || 'U').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {user.id?.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#160327] dark:text-white text-sm"
                    >
                      <option value="USER">User</option>
                      <option value="MERCHANT">Merchant</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-sm">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-sm">
                    {user.phone || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleBanUser(user.id, user.isBanned)}
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium flex items-center gap-2 ${
                        user.isBanned
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      } transition`}
                    >
                      {user.isBanned ? (
                        <>
                          <FaBan /> Banned
                        </>
                      ) : (
                        <>
                          <FaCheck /> Active
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Users</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{users.length}</p>
        </div>

        <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Merchants</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
            {users.filter(u => u.role === 'MERCHANT').length}
          </p>
        </div>

        <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Banned Users</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
            {users.filter(u => u.isBanned).length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
