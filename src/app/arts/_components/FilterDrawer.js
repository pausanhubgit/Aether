"use client";

import { ART_ROUTE } from "@/constants/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const DEFAULT_LIMIT = 10;
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000000000000;
const DEFAULT_SORT = JSON.stringify({ createdAt: -1 });
const DEFAULT_BRANDS_FILTER = [];
const DEFAULT_CATEGORY_FILTER = "";

const FilterDrawer = ({ showFilter, setShowFilter, brands, categories }) => {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [minPrice, setMinPrice] = useState(DEFAULT_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [brandsFilter, setBrandsFilter] = useState(DEFAULT_BRANDS_FILTER);
  const [categoryFilter, setCategoryFilter] = useState(DEFAULT_CATEGORY_FILTER);

  const router = useRouter();
  const searchParams = useSearchParams();

  function setFilter() {
    const params = new URLSearchParams(searchParams.toString());

    params.set("limit", limit);
    params.set("sort", sort);
    params.set("min", minPrice < 0 ? 0 : minPrice);
    params.set("max", maxPrice);
    params.set("brands", brandsFilter.join(","));
    params.set("category", categoryFilter);

    router.push(`?${params.toString()}`);

    setShowFilter(false);
  }

  function resetFilter() {
    setLimit(DEFAULT_LIMIT);
    setMinPrice(DEFAULT_MIN_PRICE);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setSort(DEFAULT_SORT);
    setBrandsFilter(DEFAULT_BRANDS_FILTER);
    setCategoryFilter(DEFAULT_CATEGORY_FILTER);

    router.push(ART_ROUTE);

    setShowFilter(false);
  }



  return (
    <div className={showFilter ? "block" : "hidden"}>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setShowFilter(false)}
      ></div>
      <div className="fixed top-0 left-0 z-[60] h-full w-80 bg-white shadow-2xl p-6 flex flex-col transition-transform">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-bold text-slate-900">Filters</h4>
          <button 
            onClick={() => setShowFilter(false)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
          {/* Limit */}
          <div>
            <label htmlFor="limit" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Items Per Page
            </label>
            <select
              id="limit"
              value={limit}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 p-2.5 outline-none transition-all"
              onChange={(e) => setLimit(e.target.value)}
            >
              <option value="12">12 Items</option>
              <option value="24">24 Items</option>
              <option value="48">48 Items</option>
              <option value="96">96 Items</option>
            </select>
          </div>

          {/* Order By */}
          <div>
            <label htmlFor="orderBy" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Sort By
            </label>
            <select
              id="orderBy"
              value={sort}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 p-2.5 outline-none transition-all"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value={JSON.stringify({ createdAt: -1 })}>Newest First</option>
              <option value={JSON.stringify({ createdAt: 1 })}>Oldest First</option>
              <option value={JSON.stringify({ price: 1 })}>Price: Low to High</option>
              <option value={JSON.stringify({ price: -1 })}>Price: High to Low</option>
              <option value={JSON.stringify({ name: 1 })}>Name: A - Z</option>
              <option value={JSON.stringify({ name: -1 })}>Name: Z - A</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 mb-1 block font-medium">MIN (Rs)</span>
                <input
                  type="number"
                  id="min"
                  value={minPrice}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 p-2.5 outline-none transition-all"
                  placeholder="0"
                  onChange={(e) => setMinPrice(e.target.value)}
                  min={0}
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 mb-1 block font-medium">MAX (Rs)</span>
                <input
                  type="number"
                  id="max"
                  value={maxPrice === DEFAULT_MAX_PRICE ? "" : maxPrice}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 p-2.5 outline-none transition-all"
                  placeholder="No limit"
                  onChange={(e) => setMaxPrice(e.target.value || DEFAULT_MAX_PRICE)}
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 p-2.5 outline-none transition-all"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => {
                const val = typeof cat === 'object' ? cat.id || cat.name : cat;
                const lab = typeof cat === 'object' ? cat.name : cat;
                return (
                  <option key={index} value={val}>
                    {lab}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex gap-3">
          <button
            type="button"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-95"
            onClick={setFilter}
          >
            Apply
          </button>
          <button
            type="button"
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
            onClick={resetFilter}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;