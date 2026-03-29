"use client";

import { GRID_VIEW } from "@/constants/artView";
import { toggleArtView } from "@/redux/userPreferences/userPreferenceSlice";
import { MdFormatListBulleted, MdOutlineGridView } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const ListGridView = () => {
  const dispatch = useDispatch();
  const { productView } = useSelector((state) => state.userPreferences);

  return (
    <button
      className="bg-gray-100 dark:bg-[#160327] text-gray-600 dark:text-gray-300 p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      onClick={() => dispatch(toggleArtView())}
      title={productView === GRID_VIEW ? "Switch to List View" : "Switch to Grid View"}
    >
      {productView === GRID_VIEW ? (
        <MdFormatListBulleted className="w-5 h-5" />
      ) : (
        <MdOutlineGridView className="w-5 h-5" />
      )}
    </button>
  );
};

export default ListGridView;
