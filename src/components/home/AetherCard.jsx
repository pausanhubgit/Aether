"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { FaPlay, FaMusic, FaCircleInfo } from 'react-icons/fa6';
import Image from 'next/image';

const AetherCard = ({ item, type, butterflyImg }) => {
  const isVideo = type === 'video';
  const link = isVideo ? `/video/detail/${item._id}` : `/music/detail/${item._id}`;
  const mainImg = item.imageUrls?.[0] || item.image || item.thumbnail;
  const mainVideo = item.videoUrls?.[0] || item.mediaFileUrls?.[0] || (typeof item.media === 'string' && item.media.endsWith('.mp4') ? item.media : null);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log("Autoplay blocked or failed", err));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link 
      href={link}
      className="group bg-white dark:bg-[#0f021b] rounded-[2.5rem] p-4 border border-slate-200 dark:border-purple-900/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video mb-6 rounded-[2rem] overflow-hidden shadow-inner bg-slate-100 dark:bg-purple-950/20">
         {isVideo && mainVideo ? (
            <video 
              ref={videoRef}
              src={mainVideo}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              muted
              playsInline
              loop
              poster={mainImg || (butterflyImg?.src || butterflyImg)}
            />
         ) : (
            <img 
                src={mainImg || (butterflyImg?.src || butterflyImg)} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
         )}
         <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-4 bg-white text-primary rounded-full shadow-xl">
                {isVideo ? <FaPlay className="ml-1" /> : <FaMusic />}
            </div>
         </div>
         <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white">
            {isVideo ? <FaPlay size={10} /> : <FaMusic size={10} />}
         </div>
      </div>
      <div className="px-4 pb-4">
         {item.artist && (
           <span className="text-primary text-[10px] font-bold uppercase tracking-wider mb-2 block">{item.artist}</span>
         )}
         <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-50 group-hover:text-primary transition-colors line-clamp-1">
            {item.title}
         </h3>
         <p className="text-slate-500 dark:text-purple-300 text-sm leading-relaxed mb-6 font-medium line-clamp-2">
            {item.description || "Experience the highest quality content curated from our top tier creators worldwide."}
         </p>
         <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 dark:text-purple-400">
            <span className="flex items-center gap-1.5"><FaCircleInfo className="text-primary" /> Enhanced Quality</span>
            <span className="text-primary px-3 py-1 bg-primary/10 rounded-full">{Math.max(0, item.reactions || item.likes?.length || 0)} Likes</span>
         </div>
      </div>
    </Link>
  );
};

export default AetherCard;
