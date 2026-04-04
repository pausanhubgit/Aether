"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaHeart, FaShare, FaRegHeart, FaComment, FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toast } from 'react-toastify';
import CommentsSection from "./CommentsSection";
import musicApi from "@/api/music";
import videoApi from "@/api/video";
import artsAPI from "@/api/arts";
import cartApi from "@/api/cart";
import { addToCart } from "@/redux/cart/cartSlice";
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { LIST_VIEW, GRID_VIEW } from "@/constants/artView";

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  } catch {
    return 'N/A';
  }
};

export default function MediaCard({ item, type, view }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [likes, setLikes] = useState(Math.max(0, item.reactions || item.likes?.length || 0));
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const isListView = view === LIST_VIEW;

  const getApi = () => {
    if (type === "music") return musicApi;
    if (type === "video") return videoApi;
    if (type === "art") return artsAPI;
    return null;
  };

  const handleLike = async () => {
    if (!user) {
      toast.info("Please login to like this content.");
      return;
    }
    const api = getApi();
    if (!api) return;

    try {
      const response = await (type === "music" ? api.likeMusic(item._id) : 
                              type === "video" ? api.likeVideo(item._id) : 
                              api.likeArt(item._id));
      const isNowLiked = !liked;
      setLiked(isNowLiked);
      setLikes(prev => isNowLiked ? prev + 1 : prev - 1);
      toast.success(isNowLiked ? "Liked!" : "Reaction removed!", { autoClose: 1500 });
    } catch (error) {
       console.error("Like failed:", error);
       toast.error("Failed to react.", { autoClose: 1500 });
    }
  };

  const handleShare = () => {
    try {
      const url = `${window.location.origin}/${type === 'art' ? `arts/${item._id}` : `${type}/detail/${item._id}`}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!", { autoClose: 1500 });
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (type === 'art') {
        dispatch(addToCart(item));
        // Sync to backend if authenticated
        if (user) {
          const artId = item._id || item.id;
          try {
            await cartApi.addToCart(artId);
          } catch (err) {
            console.warn("Cart sync failed:", err?.response?.data || err.message);
          }
        }
        toast.success(`${item.title || item.name || "Item"} added to cart!`, { autoClose: 2000 });
      } else {
        toast.info("Only Arts can be added to cart for now.", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Failed to add to cart.");
    }
  };

  // Determine media URL and type
  const mediaUrl = item.audioUrls?.[0] || item.videoUrls?.[0] || item.imageUrls?.[0] || item.url || item.image;
  const isVideo = type === "video" || (type === "music" && (mediaUrl?.toLowerCase().endsWith(".mp4") || mediaUrl?.toLowerCase().endsWith(".webm") || mediaUrl?.toLowerCase().endsWith(".ogg") || mediaUrl?.toLowerCase().endsWith(".mov")));

  const isOwner = user && item.createdBy && (
    user._id === (item.createdBy._id || item.createdBy) || 
    user.id === (item.createdBy._id || item.createdBy)
  );

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    const api = getApi();
    if (!api) return;

    try {
      if (type === "music") await api.deleteMusic(item._id);
      else if (type === "video") await api.deleteVideo(item._id);
      else if (type === "art") await api.deleteArt(item._id);
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
      window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete item.");
    }
  };

  const MediaContent = ({ className = "" }) => (
    <div className={`relative overflow-hidden shrink-0 ${className}`}>
      {isOwner && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Link 
            href={`/dashboard/${type}/edit/${item._id}`}
            className="p-2 bg-white/90 dark:bg-[#160327]/90 backdrop-blur-sm rounded-full text-blue-600 shadow-lg hover:scale-110 transition-transform"
            title="Edit"
          >
            <FaEdit size={14} />
          </Link>
          <button 
            onClick={handleDelete}
            className="p-2 bg-white/90 dark:bg-[#160327]/90 backdrop-blur-sm rounded-full text-red-600 shadow-lg hover:scale-110 transition-transform"
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
        </div>
      )}
      {(isVideo || (type === "music" && item.videoUrls?.length > 0)) ? (
        <video
          controls
          poster={item.imageUrls?.[0] || item.thumbnail || item.image}
          src={item.videoUrls?.[0] || mediaUrl}
          className="w-full h-full object-cover bg-black"
        />
      ) : type === "music" ? (
        // Music: show clean audio player with no cover image, just stylish gradient + waveform
        <div className="w-full h-full bg-gradient-to-br from-[#1a0533] to-[#3b0764] flex flex-col items-center justify-center p-5 gap-3 relative overflow-hidden">
          {/* Decorative animated rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 rounded-full border-2 border-purple-500/20 animate-ping" style={{animationDuration: '2.5s'}} />
            <div className="absolute w-20 h-20 rounded-full border-2 border-purple-500/30 animate-ping" style={{animationDuration: '1.8s'}} />
          </div>
          {/* Music note icon */}
          <div className="text-5xl text-purple-300 drop-shadow-lg relative z-10 select-none">♫</div>
          <p className="text-purple-200 text-xs font-semibold truncate max-w-full relative z-10 text-center px-2">{item.title}</p>
          {/* Actual audio player — NO cover image */}
          <audio
            controls
            src={item.audioUrls?.[0] || mediaUrl}
            className="w-full h-10 relative z-10"
            style={{ filter: 'invert(1) hue-rotate(280deg)' }}
          />
        </div>
      ) : (
        <Image
          src={(mediaUrl && typeof mediaUrl === 'string' && mediaUrl.trim() !== "") ? mediaUrl : "/assets/images/placeholder.jpg"}
          alt={item.title || item.name || "Media preview"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = "/assets/images/placeholder.jpg";
          }}
        />
      )}
    </div>
  );

  if (isListView) {
    return (
      <div className="group bg-white dark:bg-[#0f021b] border border-slate-200 dark:border-purple-900/40 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col md:flex-row min-h-[220px]">
        <div className="w-full md:w-[380px] relative aspect-video md:aspect-auto overflow-hidden">
          <MediaContent className="w-full h-full" />
        </div>
        <div className="p-6 flex flex-col flex-grow justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="bg-primary !text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm">
                {item.subcategory || item.genre || item.category || type}
              </span>
              <div className="flex gap-4">
                <button onClick={handleLike} className={`flex items-center gap-1.5 transition ${liked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}>
                  {liked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                  <span className="text-xs font-bold font-mono">{likes}</span>
                </button>
                <button onClick={handleShare} className="text-slate-400 hover:text-primary transition" title="Share">
                  <FaShare size={18} />
                </button>
                {type === 'art' && (
                  <button onClick={handleAddToCart} className="text-slate-400 hover:text-primary transition" title="Add to Cart">
                    <MdOutlineAddShoppingCart size={22} />
                  </button>
                )}
              </div>
            </div>
            <Link href={type === 'art' ? `/arts/${item._id}` : `/${type}/detail/${item._id}`} className="block text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2 truncate">
              {item.title || item.name}
            </Link>
            {type === 'art' && (
              <div className="text-primary font-bold text-lg mb-3">Rs. {item.price?.toLocaleString()}</div>
            )}
            <p className="text-slate-500 dark:text-purple-300/60 text-sm line-clamp-2 max-w-2xl mb-4">
              {item.description || "Experience exceptional quality content curated from our top tier creators."}
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-purple-900/20">
             {item.createdBy && (
               <div className="flex items-center gap-2">
                 <span className="text-[10px] text-slate-400 uppercase font-bold">Artist</span>
                 <Link href={`/profile/${item.createdBy._id}`} className="text-sm font-bold text-primary hover:underline truncate max-w-[150px]">
                   {item.createdBy.name || item.createdBy.username}
                 </Link>
               </div>
             )}
             <div className="flex items-center gap-6">
                <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition">
                  <FaComment className="opacity-70" /> {item.comments?.length || 0} Comments
                </button>
                <Link href={type === 'art' ? `/arts/${item._id}` : `/${type}/detail/${item._id}`} className="bg-primary !text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 whitespace-nowrap">
                  View {type === 'art' ? 'Art' : type.charAt(0).toUpperCase() + type.slice(1)}
                </Link>
             </div>
          </div>
        </div>
        {showComments && (
          <div className="border-t border-slate-100 dark:border-purple-900/20 bg-slate-50/50 dark:bg-purple-950/10 p-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg">Comments</h4>
                <button onClick={() => setShowComments(false)} className="text-slate-400 hover:text-red-500 font-bold text-sm">Hide Comments</button>
            </div>
            <CommentsSection itemId={item._id} itemType={type} initialComments={item.comments} onCommentPosted={() => setShowComments(false)} />
          </div>
        )}
      </div>
    );
  }

  // GRID VIEW - FULL COVER STYLE
  return (
    <div className="group relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30 h-full min-h-[350px]">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <MediaContent className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0118] via-[#0d0118]/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
        {/* Top Actions */}
        <div className="flex justify-between items-start translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
            {item.subcategory || item.genre || item.category || type}
          </span>
          <div className="flex flex-col gap-2">
            <button onClick={handleLike} className={`p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all ${liked ? 'bg-red-500 text-white border-red-500' : 'bg-white/10 text-white hover:bg-red-500 hover:border-red-500'}`}>
              <FaHeart size={14} />
            </button>
            <button onClick={handleShare} className="p-2.5 rounded-full backdrop-blur-md border border-white/20 bg-white/10 text-white hover:bg-primary hover:border-primary transition-all">
              <FaShare size={14} />
            </button>
            {type === 'art' && (
              <button onClick={handleAddToCart} className="p-2.5 rounded-full backdrop-blur-md border border-white/20 bg-white/10 text-white hover:bg-primary hover:border-primary transition-all">
                <MdOutlineAddShoppingCart size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="mb-4">
             <Link href={type === 'art' ? `/arts/${item._id}` : `/${type}/detail/${item._id}`} className="block text-2xl font-bold text-white mb-1 hover:text-primary transition-colors line-clamp-2">
               {item.title || item.name}
             </Link>
             {item.createdBy && (
               <Link href={`/profile/${item.createdBy._id}`} className="text-white/60 text-xs font-medium hover:text-white transition-colors">
                 by <span className="font-bold">{item.createdBy.name || item.createdBy.username}</span>
               </Link>
             )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
               {type === 'art' ? (
                 <div className="text-lg font-bold text-white">Rs. {item.price?.toLocaleString()}</div>
               ) : (
                 <div className="text-xs font-bold text-white/50 uppercase tracking-widest">{type} content</div>
               )}
            </div>
            <Link 
              href={type === 'art' ? `/arts/${item._id}` : `/${type}/detail/${item._id}`}
              className="bg-primary !text-white px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-xl active:scale-90 flex items-center gap-2 font-bold text-sm"
            >
              <span className="!text-white">View</span>
              <FaShare className="rotate-45" size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Action Link */}
      <Link 
        href={type === 'art' ? `/arts/${item._id}` : `/${type}/detail/${item._id}`}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
      >
          <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center animate-pulse hover:scale-110 transition-transform">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl">
                <FaShare className="rotate-45" />
            </div>
          </div>
      </Link>
    </div>
  );
}
