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
    videoApi.getGenres().then(res => {
      setGenres(res.data || []);
    }).catch(err => console.error("Failed to fetch genres", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <header className="rounded-2xl border border-gray-200 bg-white dark:bg-[#160327] dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Video</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Discover and share video content from creators.
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <MediaSearch placeholder="Search videos..." />
            <ListGridView />
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white dark:bg-[#160327] dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-black dark:text-white">Genres</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/video"
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${!searchParams.get('genre') ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-purple-50 hover:text-purple-600'}`}
          >
            All Videos
          </Link>
          {genres.map((genre) => (
            <Link
              key={genre}
              href={`/video?genre=${encodeURIComponent(genre)}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${searchParams.get('genre') === genre ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-purple-50 hover:text-purple-600'}`}
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>

      <div className="pb-6">
        <MediaFeed type="video" genre={searchParams.get('genre')} searchName={searchName} />
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

