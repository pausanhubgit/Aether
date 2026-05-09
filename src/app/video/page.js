"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import MediaFeed from "@/components/MediaFeed";
import MediaSearch from "@/components/MediaSearch";
import ListGridView from "@/components/ListGridView";
import videoApi from "@/api/video";
import { useSearchParams } from "next/navigation";

const VideoContent = () => {
  const searchParams = useSearchParams();
  const searchName = searchParams.get("name") || "";
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    videoApi
      .getGenres()
      .then((res) => {
        setGenres(res.data || []);
      })
      .catch((err) => console.error("Failed to fetch genres", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 sm:py-6 gap-4 border-b border-gray-100 dark:border-gray-800 mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight dark:text-white">
          Popular Videos
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <div className="flex-grow lg:w-80">
            <MediaSearch placeholder="Search videos by title..." />
          </div>
          <div className="flex items-center gap-3">
            <ListGridView />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
          Genres
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/video"
            className={`px-4 py-2 rounded-full text-xs font-bold transition shadow-sm ${!searchParams.get("genre") ? "bg-purple-600 !text-white" : "bg-purple-400 !text-white hover:bg-purple-500"}`}
          >
            All
          </Link>
          {genres.map((genre) => (
            <Link
              key={genre}
              href={`/video?genre=${encodeURIComponent(genre)}`}
              className={`px-4 py-2 rounded-full text-xs font-bold transition shadow-sm ${searchParams.get("genre") === genre ? "bg-purple-600 !text-white" : "bg-purple-400 !text-white hover:bg-purple-500"}`}
            >
              {genre}
            </Link>
          ))}
        </div>
      </div>

      <div className="pb-8">
        <MediaFeed
          type="video"
          genre={searchParams.get("genre")}
          searchName={searchName}
        />
      </div>
    </div>
  );
};

const Video = () => (
  <Suspense fallback={<div>Loading videos...</div>}>
    <VideoContent />
  </Suspense>
);

export default Video;
