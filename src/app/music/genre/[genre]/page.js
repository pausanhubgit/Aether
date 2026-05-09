import React from "react";
import MediaFeed from "@/components/MediaFeed";

const GenreMusic = ({ params }) => {
  const genre = decodeURIComponent(params.genre || "");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-3xl font-semibold text-black">{genre} Music</h1>
        <p className="mt-2 text-sm text-gray-600">
          Music uploads tagged with {genre}.
        </p>
      </header>

      <section>
        <MediaFeed type="music" genre={genre} />
      </section>
    </div>
  );
};

export default GenreMusic;
