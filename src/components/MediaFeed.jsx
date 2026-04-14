"use client";

import React, { useEffect, useMemo, useState } from "react";
import musicApi from "@/api/music";
import videoApi from "@/api/video";
import artsAPI from "@/api/arts";
import MediaCard from "./MediaCard";
import Spinner from "./Spinner";

import { useSelector } from "react-redux";
import { GRID_VIEW } from "@/constants/artView";

export default function MediaFeed({ type, genre, searchName, minPrice, maxPrice, sort, limit, excludeId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { productView } = useSelector((state) => state.userPreferences);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        const apiParams = {
          name: searchName,
          title: searchName,
          minPrice,
          maxPrice,
          sort,
          limit,
        };

        if (type === "music") {
          // backend stores genres in `category` field — send as `category`
          response = await musicApi.getMusic({ category: genre, ...apiParams });
        } else if (type === "video") {
          // backend stores genres in `category` field — send as `category`
          response = await videoApi.getVideo({ category: genre, ...apiParams });
        } else if (type === "art") {
          response = await artsAPI.getArt({ category: genre, ...apiParams });
        }

        setItems(response.data || []);
      } catch (error) {
        console.error(`Failed to fetch ${type}:`, error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, genre, searchName, minPrice, maxPrice, sort, limit]);

  const sortedItems = useMemo(() => {
    let result = [...items];
    if (excludeId) {
      result = result.filter(item => {
        const itemId = String(item._id || item.id || "");
        const excludeVal = String(excludeId || "");
        return itemId !== excludeVal;
      });
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [items, excludeId]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Spinner />
      </div>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <div className={`w-full min-w-0 ${productView === GRID_VIEW
        ? `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5`
        : 'flex flex-col gap-5'
      }`}>
      {sortedItems.map((item) => (
        <MediaCard key={item._id} item={item} type={type} view={productView} />
      ))}
    </div>
  );
}

