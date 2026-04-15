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
        const apiParams = {
          name: searchName,
          title: searchName,
          minPrice,
          maxPrice,
          sort,
          limit: limit || 12,
        };

        let primaryResults = [];
        if (type === "music") {
          const res = await musicApi.getMusic({ category: genre, ...apiParams });
          primaryResults = res.data || [];
        } else if (type === "video") {
          const res = await videoApi.getVideo({ category: genre, ...apiParams });
          primaryResults = res.data || [];
        } else if (type === "art") {
          const res = await artsAPI.getArt({ category: genre, ...apiParams });
          primaryResults = res.data || [];
        }

        let finalResults = [...primaryResults];

        // Fallback: If results are too few, fetch general items of the same type
        if (finalResults.length < 4) {
          let secondaryResults = [];
          if (type === "music") {
            const res = await musicApi.getMusic({ ...apiParams, limit: 12 });
            secondaryResults = res.data || [];
          } else if (type === "video") {
            const res = await videoApi.getVideo({ ...apiParams, limit: 12 });
            secondaryResults = res.data || [];
          } else if (type === "art") {
            const res = await artsAPI.getArt({ ...apiParams, limit: 12 });
            secondaryResults = res.data || [];
          }

          // Merge and de-duplicate
          const existingIds = new Set(finalResults.map(item => String(item._id || item.id)));
          secondaryResults.forEach(item => {
            const id = String(item._id || item.id);
            if (!existingIds.has(id)) {
              finalResults.push(item);
              existingIds.add(id);
            }
          });
        }

        setItems(finalResults);
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
      const excludeVal = String(excludeId || "");
      result = result.filter(item => String(item._id || item.id || "") !== excludeVal);
    }
    // Return early if we have enough items, or just return the sorted list
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit || 8);
  }, [items, excludeId, limit]);

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

