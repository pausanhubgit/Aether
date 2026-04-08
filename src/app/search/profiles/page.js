"use client";

import React, { useState, useEffect } from "react";
import userApi from "@/api/users";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUser, FaCheckCircle, FaUsers } from "react-icons/fa";
import { formatImageUrl } from "@/helpers/url";

export default function ProfileSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response.data || []);
        setFilteredUsers([]);
        setIsUnauthorized(false);
      } catch (error) {
        if (error.response?.status === 401) {
          setIsUnauthorized(true);
        }
        console.error("[Search] Failed to fetch users:", error);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      // Show top 4 users as suggestions when empty
      setFilteredUsers(users.slice(0, 4));
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--background)] pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">Find Creators & Merchants</h1>
          <p className="text-[var(--muted)] max-w-lg mx-auto">Discover and connect with extraordinary artists and sellers in the Aether community.</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-purple-400/50" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted)] focus:ring-2 focus:ring-purple-500/50 outline-none transition-all shadow-xl shadow-purple-500/5"
            placeholder="Search by name, username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-600 dark:text-purple-400">
              Found {filteredUsers.length} results
            </div>
          )}
        </div>

        {/* Unauthorized Hint */}
        {isUnauthorized && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FaUser className="text-purple-400" size={14} />
              </div>
              <p className="text-xs font-bold text-purple-300">You are browsing as a guest. Login to see live community statistics.</p>
            </div>
            <Link href="/login" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition shadow-lg shadow-purple-500/20">
              Login Now
            </Link>
          </div>
        )}

        {/* Results Grid */}
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest px-2">
              {!searchTerm ? "Suggested Creators" : `Search Results (${filteredUsers.length})`}
           </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 pb-20">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <Link
                  key={u._id}
                  href={`/profile/${u._id}`}
                  className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 hover:bg-purple-800/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden"
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-[var(--border)] shadow-lg relative shrink-0">
                      {u.profileImageUrl ? (
                        <Image
                          src={formatImageUrl(u.profileImageUrl)}
                          alt={u.name || u.username || "User avatar"}
                          fill
                          sizes="(max-width: 768px) 64px, 64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700" aria-hidden="true">
                          <FaUser className="text-2xl text-white/80" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-[var(--foreground)] font-bold truncate group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                          {u.name || u.username}
                        </h3>
                        {u.roles?.includes("MERCHANT") && (
                          <FaCheckCircle className="text-blue-500 dark:text-blue-400 text-xs shadow-sm" title="Verified Merchant" />
                        )}
                      </div>
                      <p className="text-[var(--muted)] text-xs mb-2">@{u.username || "artist"}</p>
                      <div className="flex items-center gap-3">
                         <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--muted)] uppercase tracking-tighter">
                            <FaUsers size={10}/> {u.followers?.length || 0} followers
                         </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-purple-500/10 transition-all" />
                </Link>
              ))
            ) : !searchTerm ? (
              <div className="col-span-full text-center py-24 bg-purple-500/[0.02] rounded-[3rem] border border-dashed border-purple-500/10 flex flex-col items-center justify-center gap-4">
                 <div className="p-5 bg-purple-500/5 rounded-full">
                    <FaUser size={40} className="text-purple-500/20" />
                 </div>
                 <div>
                    <h3 className="text-[var(--foreground)] font-bold text-lg mb-1">Discover Creators</h3>
                    <p className="text-[var(--muted)] text-sm">Start typing above to search by name, username or email.</p>
                 </div>
              </div>
            ) : (
              <div className="col-span-full text-center py-20 bg-red-500/[0.02] rounded-3xl border border-dashed border-red-500/10">
                <p className="text-red-400/40 text-sm font-medium">No users found matching &quot;{searchTerm}&quot;</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
