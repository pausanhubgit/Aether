"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import MediaFeed from "@/components/MediaFeed";
import MediaSearch from "@/components/MediaSearch";
import ListGridView from "@/components/ListGridView";
import musicApi from "@/api/music";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const MusicContent = () => {
  const searchParams = useSearchParams();
  const searchName = searchParams.get("name") || "";
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    musicApi.getGenres().then(res => {
      setGenres(res.data || []);
    }).catch(err => console.error("Failed to fetch genres", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <header className="rounded-2xl border border-gray-200 bg-white dark:bg-[#160327] dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Music</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Browse music uploads or choose a genre to drill down.
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <MediaSearch placeholder="Search music..." />
            <ListGridView />
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white dark:bg-[#160327] dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-black dark:text-white">Genres</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/music"
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${!searchParams.get('genre') ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-purple-50 hover:text-purple-600'}`}
          >
            All Music
          </Link>
          {genres.map((genre) => (
            <Link
              key={genre}
              href={`/music?genre=${encodeURIComponent(genre)}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${searchParams.get('genre') === genre ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-purple-50 hover:text-purple-600'}`}
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>

      <div className="pb-6">
        <MediaFeed type="music" genre={searchParams.get('genre')} searchName={searchName} />
      </div>
    </div>
  );
};

const Music = () => (
  <Suspense fallback={<div>Loading music...</div>}>
    <MusicContent />
  </Suspense>
);

export default Music;

