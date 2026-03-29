import React from "react";
import MediaFeed from "@/components/MediaFeed";

const GenreVideo = ({ params }) => {
  const genre = decodeURIComponent(params.genre || "");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-3xl font-semibold text-black">{genre} Videos</h1>
        <p className="mt-2 text-sm text-gray-600">
          Videos tagged with {genre}.
        </p>
      </header>

      <section>
        <MediaFeed type="video" genre={genre} />
      </section>
    </div>
  );
};

export default GenreVideo;