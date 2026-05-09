"use client";

import React, { useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

function AdvancedFilter({ categories, onFilter }) {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const handleFilter = () => {
    onFilter({
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      category: selectedCategory,
      sortBy: sortBy,
    });
  };

  const handleReset = () => {
    setPriceRange([0, 10000]);
    setSelectedCategory("");
    setSortBy("name");
    onFilter({
      priceMin: 0,
      priceMax: 10000,
      category: "",
      sortBy: "name",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
      >
        <FaFilter /> Filter
      </button>

      {showFilters && (
        <div className="absolute right-0 top-12 bg-white dark:bg-[#160327] border border-gray-300 dark:border-gray-600 rounded-lg p-6 w-80 shadow-lg z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-red-500"
            >
              <FaTimes />
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#160327] dark:text-white"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#160327] dark:text-white"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Category Filter */}
          {categories && categories.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#160327] dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat} value={cat.id || cat}>
                    {typeof cat === "string" ? cat : cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#160327] dark:text-white"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleFilter}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
            >
              Apply Filter
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedFilter;
