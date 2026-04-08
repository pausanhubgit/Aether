import React from 'react';
import videoAPI from "@/api/video";
import musicAPI from "@/api/music";
import { FaPlay, FaCircleInfo, FaArrowTrendUp, FaMusic } from 'react-icons/fa6';
import Link from 'next/link';
import butterflyImg from "@/assets/images/Background/butterfly.jpg";

import AetherCard from './AetherCard';

const WhyChooseAether = async () => {
  let topVideos = [];
  let topMusic = [];
  try {
     const [vResponse, mResponse] = await Promise.all([
        videoAPI.getVideo({ limit: 10 }),
        musicAPI.getMusic({ limit: 10 })
     ]);
     
     topVideos = (vResponse?.data || [])
        .sort((a, b) => {
           const aLikes = Math.max(0, a.reactions || a.likes?.length || 0);
           const bLikes = Math.max(0, b.reactions || b.likes?.length || 0);
           return bLikes - aLikes;
        })
        .slice(0, 3);
        
     topMusic = (mResponse?.data || [])
        .sort((a, b) => {
           const aLikes = Math.max(0, a.reactions || a.likes?.length || 0);
           const bLikes = Math.max(0, b.reactions || b.likes?.length || 0);
           return bLikes - aLikes;
        })
        .slice(0, 3);
  } catch (error) {
     console.error("Failed to fetch top featured content:", error.message);
  }

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#0d0118] relative overflow-hidden">
      <div className="container-7xl relative z-10">
        <div className="flex flex-col mb-16 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center w-fit gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mx-auto md:mx-0">
                <FaArrowTrendUp /> <span>Community Favorites</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 leading-[1.1]">
                Why Choose <span className="text-primary italic text-6xl">Aether?</span>
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto md:mx-0" />
        </div>

        {/* Stunning Videos Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-slate-800 dark:text-purple-100 flex items-center gap-3">
             <FaPlay className="text-primary" /> Stunning Videos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {topVideos.length > 0 ? topVideos.map(v => (
              <AetherCard key={v._id} item={v} type="video" butterflyImg={butterflyImg} />
            )) : (
                [1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-slate-200 dark:bg-purple-950/30 h-64 rounded-[2.5rem]" />)
            )}
          </div>
        </div>

        {/* Melodious Music Section */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-slate-800 dark:text-purple-100 flex items-center gap-3">
             <FaMusic className="text-primary" /> Melodious Music
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {topMusic.length > 0 ? topMusic.map(m => (
              <AetherCard key={m._id} item={m} type="music" butterflyImg={butterflyImg} />
            )) : (
                [1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-slate-200 dark:bg-purple-950/30 h-64 rounded-[2.5rem]" />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseAether;