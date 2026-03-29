"use client";

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaChartLine, FaHeart, FaShoppingCart, FaComment } from 'react-icons/fa';
import { fetchLikesAnalyticsAsync } from '@/lib/slices/artsSlice';

function AnalyticsDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { likesAnalytics } = useSelector(state => state.arts);
  const [stats, setStats] = useState({
    totalLikes: 0,
    totalArts: 0,
    totalSales: 0,
    totalComments: 0,
  });

  useEffect(() => {
    if (!user || !['MERCHANT', 'ADMIN'].includes(user.role)) {
      router.push('/');
      return;
    }
    dispatch(fetchLikesAnalyticsAsync(user.id));
  }, [user, dispatch, router]);

  useEffect(() => {
    if (likesAnalytics && Array.isArray(likesAnalytics)) {
      const total = likesAnalytics.reduce((sum, item) => sum + (item.likes || 0), 0);
      setStats(prev => ({
        ...prev,
        totalLikes: total,
      }));
    }
  }, [likesAnalytics]);

  const chartData = likesAnalytics && Array.isArray(likesAnalytics) 
    ? likesAnalytics.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        likes: item.likes || 0,
      }))
    : [];

  const maxLikes = Math.max(...chartData.map(d => d.likes), 1);

  return (
    <div className="py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
        <FaChartLine /> Analytics Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Likes</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {stats.totalLikes}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <FaHeart className="text-2xl text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Arts</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {stats.totalArts}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <FaShoppingCart className="text-2xl text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Sales</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                Rs. {stats.totalSales}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <FaShoppingCart className="text-2xl text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Comments</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {stats.totalComments}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <FaComment className="text-2xl text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Likes Analytics</h2>

        {chartData.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No data available yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-full h-96 flex items-flex-end gap-2 p-4 bg-gray-50 dark:bg-[#160327] rounded-lg">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end">
                  <div className="w-full flex items-end justify-center">
                    <div
                      className="w-6 bg-gradient-to-t from-primary to-purple-500 rounded-t-lg transition-all hover:shadow-lg"
                      style={{
                        height: `${(data.likes / maxLikes) * 320}px`,
                      }}
                      title={`${data.likes} likes`}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {data.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-[#160327] rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Daily Statistics</h2>

        {chartData.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No data available yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-[#160327] border-b border-gray-300 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Likes</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">Growth</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((data, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                    <td className="px-6 py-4 text-gray-800 dark:text-white font-medium">
                      {data.date}
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-white font-semibold">
                      {data.likes}
                    </td>
                    <td className="px-6 py-4">
                      {index === 0 ? (
                        <span className="text-gray-500 dark:text-gray-400">-</span>
                      ) : (
                        <span className={`font-semibold ${
                          data.likes >= chartData[index - 1].likes
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {data.likes >= chartData[index - 1].likes ? '+' : '-'}
                          {Math.abs(data.likes - chartData[index - 1].likes)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
