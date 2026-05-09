import React from "react";

const LoadingCard = () => {
  return (
    <div className="border border-gray-100 shadow-md py-3 px-4 rounded-xl animate-pulse">
      {/* Dummy image placeholder */}
      <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 relative overflow-hidden flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading image...</div>
      </div>

      <div className="w-full h-6 bg-gray-300 rounded mb-2"></div>

      <div className="flex items-center gap-2 text-sm mb-2">
        <div className="w-20 h-4 bg-gray-300 rounded"></div>
      </div>

      <div className="w-16 h-6 bg-gray-300 rounded mb-2"></div>

      <div className="w-full h-8 bg-gray-300 rounded"></div>
    </div>
  );
};

const ArtLoader = () => {
  return (
    <div className="container mx-auto py-5 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    </div>
  );
};

export default ArtLoader;
