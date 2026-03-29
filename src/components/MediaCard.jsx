"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaHeart, FaShare, FaRegHeart, FaComment } from 'react-icons/fa';
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

export default function MediaCard({ item, type, view }) {
  const { user } = useSelector((state) => state.auth);
  const [likes, setLikes] = useState(item.reactions || 0);
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
    const url = `${window.location.origin}/${type === 'art' ? `arts/${item._id}` : `${type}/detail/${item._id}`}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleAddToCart = async () => {
    if (!user) {
      dispatch(addToCart(item));
      toast.success("Added to local cart!");
      return;
    }

    try {
      if (type === 'art') {
        await cartApi.addToCart(item._id);
        dispatch(addToCart(item));
        toast.success("Added to cart!");
      } else {
        toast.info("Only Arts can be added to cart for now.");
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Failed to add to cart.");
    }
  };

  // Determine media URL and type
  const mediaUrl = item.audioUrls?.[0] || item.videoUrls?.[0] || item.imageUrls?.[0] || item.url || item.image;
  const isVideo = type === "video" || (type === "music" && mediaUrl?.endsWith(".mp4"));

  const MediaContent = () => (
    <div className={`relative overflow-hidden shrink-0 ${isListView ? 'w-full sm:w-[320px] aspect-video rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none' : 'w-full aspect-video rounded-t-2xl'}`}>
      {isVideo ? (
        <video
          controls
          src={mediaUrl}
          className="w-full h-full object-cover bg-black"
        />
      ) : type === "music" ? (
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex flex-col items-center justify-center p-4">
          <div className="text-4xl text-white mb-2">♫</div>
          <audio controls src={mediaUrl} className="w-full h-8" />
          <p className="text-xs text-white/80 mt-2 truncate max-w-full">{item.title}</p>
        </div>
      ) : (
        <Image
          src={(mediaUrl && mediaUrl.trim() !== "") ? mediaUrl : "/assets/images/placeholder.jpg"}
          alt={item.title || "Media preview"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/assets/images/placeholder.jpg";
          }}
        />
      )}
    </div>
  );

  return (
    <div className={`bg-white dark:bg-[#160327] border border-gray-200 dark:border-purple-900/40 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${isListView ? 'flex min-h-[12rem] flex-col md:flex-row mb-4' : 'flex flex-col'}`}>
      <div className={`flex ${isListView ? 'flex-col md:flex-row' : 'flex-col'}`}>
        <MediaContent />

        <div className={`p-4 flex flex-col justify-between flex-grow ${isListView ? 'min-w-0' : ''}`}>
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                {item.subcategory || item.genre || item.category || type}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 transition ${liked ? 'text-red-500' : 'text-gray-400 dark:text-purple-400/60 hover:text-red-500'}`}
                >
                  {liked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                  <span className="text-sm font-medium">{likes}</span>
                </button>
                
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className={`flex items-center gap-1 transition ${showComments ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-purple-400/60 hover:text-purple-600 dark:hover:text-purple-400'}`}
                  title="Toggle Comments"
                >
                  <FaComment size={18} />
                  <span className="text-sm font-medium">{item.comments?.length || 0}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="text-gray-400 dark:text-purple-400/60 hover:text-blue-500 dark:hover:text-blue-400 transition"
                  title="Share Link"
                >
                  <FaShare size={18} />
                </button>
                {type === 'art' && (
                  <button
                    onClick={handleAddToCart}
                    className="text-gray-400 dark:text-purple-400/60 hover:text-purple-600 dark:hover:text-purple-400 transition"
                    title="Add to Cart"
                  >
                    <MdOutlineAddShoppingCart size={22} />
                  </button>
                )}
              </div>
            </div>

            <Link
              href={type === 'art' ? `/arts/${item._id}` : `/${type}/detail/${item._id}`}
              className="block text-lg font-bold text-black dark:text-purple-100 mb-1 truncate hover:text-purple-600 dark:hover:text-purple-400 transition"
            >
              {item.title}
            </Link>
            
            {type === 'art' && (
              <div className="text-purple-600 font-bold text-sm mb-2">
                Rs. {item.price?.toLocaleString() || "0"}
              </div>
            )}
            
            {item.createdBy && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-gray-400 dark:text-purple-400/60">By</span>
                <Link 
                  href={`/profile/${item.createdBy._id}`}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-all"
                >
                  {item.createdBy.name || item.createdBy.username || "Unknown Artist"}
                </Link>
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-purple-300/60 mb-2 line-clamp-2">
              {item.description || "No description provided."}
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-purple-900/30">
              <Link
                href={type === 'art' ? `/arts/${item._id}` : `/${type}/detail/${item._id}`}
                className="text-purple-600 hover:text-purple-700 text-sm font-bold"
              >
                View Details
              </Link>
              <button 
                onClick={() => setShowComments(!showComments)}
                className="text-gray-500 dark:text-purple-400/60 hover:text-gray-700 dark:hover:text-purple-300 text-sm font-medium flex items-center gap-1"
              >
                <FaComment size={14} />
                {item.comments?.length || 0} Comments
              </button>
            </div>
            
            <div className="mt-2 text-[10px] text-gray-400 font-medium">
              Uploaded: {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-gray-100 dark:border-purple-900/30 bg-gray-50/50 dark:bg-purple-950/20 p-4 rounded-b-2xl">
           <CommentsSection 
             itemId={item._id} 
             itemType={type} 
             initialComments={item.comments}
             autoFocus={true}
           />
        </div>
      )}
    </div>
  );
}
