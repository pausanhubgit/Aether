import artsAPI from "@/api/arts";
import React from "react";
import ArtCard from "@/components/ArtCard";
import { FaFire } from "react-icons/fa6";

const Populararts = async () => {
  let products = [];
  try {
    // Fetch top 4 most reacted arts
    const response = await artsAPI.getArt({ limit: 8 });
    products = (response.data || [])
      .sort((a, b) => {
        const aLikes = Math.max(0, a.reactions || a.likes?.length || 0);
        const bLikes = Math.max(0, b.reactions || b.likes?.length || 0);
        return bLikes - aLikes;
      })
      .slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch popular arts:", error.message);
  }

  return (
    <section id="popular-arts" className="py-24 bg-white dark:bg-[#0d0118] overflow-hidden relative">
      <div className="container-7xl">
        <div className="flex flex-col mb-16 space-y-4">
             <div className="inline-flex items-center w-fit gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em]">
                <FaFire /> <span>Trending Collection</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-semibold text-slate-800 dark:text-purple-100 leading-[1.1]">
                Popular <span className="text-primary">Masterpieces</span>
             </h2>
             <p className="text-slate-600 dark:text-purple-300/70 max-w-2xl font-medium leading-relaxed text-lg">
                Explore the most-liked artworks from our community, handpicked for their exceptional creativity and style.
             </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 px-4 sm:px-0">
          {products?.map((arts, index) => (
            <ArtCard key={arts._id || index} art={arts} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Populararts;