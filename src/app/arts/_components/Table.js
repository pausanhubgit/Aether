"use client";

import { useSelector } from "react-redux";
import ArtCard from "./Card";
import { GRID_VIEW } from "@/constants/artView";

const Table = ({ arts }) => {
  const { artView } = useSelector((state) => state.userPreferences);

  return (
    <div
      className={
        artView == GRID_VIEW
          ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`
          : `grid grid-cols-1 gap-5`
      }
    >
      {arts.map((art, index) => (
        <ArtCard key={index} art={art} artView={artView} />
      ))}
    </div>
  );
};

export default Table;