"use client";

import { useState } from "react";
import { MdOutlineFilterAlt } from "react-icons/md";
import FilterDrawer from "./FilterDrawer";

const FilterButton = ({ brands, categories }) => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all font-semibold"
      >
        <MdOutlineFilterAlt size={18} />
        Filter
      </button>
      <FilterDrawer
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        categories={categories}
      />
    </>
  );
};

export default FilterButton;