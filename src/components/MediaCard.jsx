"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaHeart,
  FaShare,
  FaRegHeart,
  FaComment,
  FaEdit,
  FaTrash,
  FaPlay,
  FaMusic,
  FaFilm,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { toast } from "react-toastify";
import CommentsSection from "./CommentsSection";
import musicApi from "@/api/music";
import videoApi from "@/api/video";
import artsAPI from "@/api/arts";
import cartApi from "@/api/cart";
import { addToCart } from "@/redux/cart/cartSlice";
import { addNotification } from "@/redux/notifications/notificationSlice";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { LIST_VIEW, GRID_VIEW } from "@/constants/artView";
import { formatImageUrl } from "@/helpers/url";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
  } catch {
    return "N/A";
  }
};

const makeInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const MediaContent = ({ className = "", isOwner, type, item, isVideo, mediaRef, handleMediaPlay, handleMediaEnded, mediaUrl, handleDelete }) => (
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
    {isVideo || (type === "music" && item.videoUrls?.length > 0) ? (
      <video
        ref={mediaRef}
        controls
        playsInline
        crossOrigin="anonymous"
        preload="metadata"
        poster={formatImageUrl(
          item.imageUrls?.[0] || item.thumbnail || item.image,
        )}
        src={formatImageUrl(item.videoUrls?.[0] || mediaUrl)}
        className="w-full h-full object-cover bg-black"
        onPlay={handleMediaPlay}
        onEnded={handleMediaEnded}
      />
    ) : type === "music" ? (
      <div className="w-full h-full bg-gradient-to-br from-[#1a0533] to-[#3b0764] flex flex-col items-center justify-center p-5 gap-3 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-32 h-32 rounded-full border-2 border-purple-500/20 animate-ping"
            style={{ animationDuration: "2.5s" }}
          />
          <div
            className="absolute w-20 h-20 rounded-full border-2 border-purple-500/30 animate-ping"
            style={{ animationDuration: "1.8s" }}
          />
        </div>
        <div className="text-5xl text-purple-300 drop-shadow-lg relative z-10 select-none">
          ♫
        </div>
        <p className="text-purple-200 text-xs font-semibold truncate max-w-full relative z-10 text-center px-2">
          {item.title}
        </p>
        <audio
          ref={mediaRef}
          controls
          src={item.audioUrls?.[0] || mediaUrl}
          className="w-full h-10 relative z-10"
          style={{ filter: "invert(1) hue-rotate(280deg)" }}
          onPlay={handleMediaPlay}
          onEnded={handleMediaEnded}
        />
      </div>
    ) : (
      <Image
        src={
          mediaUrl && typeof mediaUrl === "string" && mediaUrl.trim() !== ""
            ? mediaUrl
            : "/assets/images/placeholder.jpg"
        }
        alt={item.title || item.name || "Media gallery preview"}
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

export default function MediaCard({ item, type, view }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const initialLikesCount = Array.isArray(item.likes)
    ? item.likes.length
    : item.reactions || 0;
  const [likes, setLikes] = useState(Math.max(0, initialLikesCount));
  const [liked, setLiked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(
    Array.isArray(item.comments)
      ? item.comments.length
      : item.commentsCount || 0,
  );
  const [showComments, setShowComments] = useState(false);
  const isListView = view === LIST_VIEW;

  // Ref for the primary media element in this card
  const mediaRef = useRef(null);

  // Pause all other video/audio elements when this one starts playing
  const handleMediaPlay = useCallback(() => {
    const allMedia = document.querySelectorAll("video, audio");
    allMedia.forEach((el) => {
      if (el !== mediaRef.current && !el.paused) {
        el.pause();
      }
    });
  }, []);

  // When this media ends, auto-play the next media element in DOM order
  const handleMediaEnded = useCallback(() => {
    const allMedia = Array.from(document.querySelectorAll("video, audio"));
    const currentIndex = allMedia.indexOf(mediaRef.current);
    if (currentIndex !== -1 && currentIndex < allMedia.length - 1) {
      const next = allMedia[currentIndex + 1];
      next
        .closest("[data-media-card]")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        next.play().catch(() => {});
      }, 600);
    }
  }, []);

  // ── IntersectionObserver: auto-play when ≥60% visible, pause when not ──
  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Pause every other media first, then play this one
          document.querySelectorAll("video, audio").forEach((m) => {
            if (m !== el && !m.paused) m.pause();
          });
          el.play().catch(() => {}); // browser may block without user gesture
        } else {
          el.pause();
        }
      },
      { threshold: 0.6 }, // 60% of the element must be visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const detailHref =
    type === "art"
      ? `/arts/${item._id || item.id}`
      : `/${type}/detail/${item._id || item.id}`;

  const handleCardClick = (e) => {
    // Don't navigate if clicking on interactive elements
    if (e.target.closest("button, a, audio, video, input")) return;
    router.push(detailHref);
  };

  React.useEffect(() => {
    if (user && item.likes && Array.isArray(item.likes)) {
      const uId = String(user._id || user.id);
      const isLiked = item.likes.some((like) => {
        const likeId =
          typeof like === "string" ? like : String(like._id || like.id || like);
        return likeId === uId;
      });
      setLiked(isLiked);
      setLikes(item.likes.length);
    } else if (item.reactions !== undefined) {
      setLikes(item.reactions);
    }
  }, [user, item.likes, item.reactions]);


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
      const response = await (type === "music"
        ? api.likeMusic(item._id)
        : type === "video"
          ? api.likeVideo(item._id)
          : api.likeArt(item._id));
      const { liked: backendLiked } = response.data;

      const isNowLiked = backendLiked !== undefined ? backendLiked : !liked;
      const newLikesCount = isNowLiked ? likes + 1 : Math.max(0, likes - 1);

      setLiked(isNowLiked);
      setLikes(newLikesCount);

      toast.success(isNowLiked ? "Liked!" : "Reaction removed!", {
        autoClose: 1500,
      });
    } catch (error) {
      console.error("Like failed:", error);
      toast.error("Failed to react.", { autoClose: 1500 });
    }
  };

  const handleShare = () => {
    try {
      const url = `${window.location.origin}/${type === "art" ? `arts/${item._id}` : `${type}/detail/${item._id}`}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!", { autoClose: 1500 });
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (type === "art") {
        dispatch(addToCart(item));
        if (user) {
          try {
            await cartApi.addToCart(item._id || item.id);
          } catch (err) {
            console.warn(
              "Cart sync failed:",
              err?.response?.data || err.message,
            );
          }
        }
        toast.success(`${item.title || item.name || "Item"} added to cart!`, {
          autoClose: 2000,
        });
      } else {
        toast.info("Only Arts can be added to cart for now.", {
          autoClose: 2000,
        });
      }
    } catch {
      toast.error("Failed to add to cart.");
    }
  };

  const mediaUrl =
    item.audioUrls?.[0] ||
    item.videoUrls?.[0] ||
    item.imageUrls?.[0] ||
    item.url ||
    item.image;
  const isVideo =
    type === "video" ||
    (type === "music" &&
      mediaUrl &&
      (mediaUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov|mkv)$/i) ||
        mediaUrl.includes("/video/")));
  const isOwner =
    user &&
    item.createdBy &&
    (user._id === (item.createdBy._id || item.createdBy) ||
      user.id === (item.createdBy._id || item.createdBy));

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;
    const api = getApi();
    if (!api) return;
    try {
      if (type === "music") await api.deleteMusic(item._id);
      else if (type === "video") await api.deleteVideo(item._id);
      else if (type === "art") await api.deleteArt(item._id);
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`,
      );
      window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete item.");
    }
  };

  // ─────────────────────────────────────────────────────────
  // MUSIC CARD (Grid) — Premium glassmorphic player card
  // ─────────────────────────────────────────────────────────
  if (!isListView && type === "music") {
    return (
      <div
        data-media-card
        onClick={handleCardClick}
        className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-[#12002a] via-[#1e0540] to-[#0a001a] border border-purple-800/30 flex flex-col cursor-pointer"
      >
        {/* Animated background rings or Video */}
        <div className="relative h-56 flex items-center justify-center overflow-hidden bg-black">
          {item.videoUrls?.length > 0 ||
          item.videoUrl ||
          (mediaUrl &&
            (mediaUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/i) ||
              mediaUrl.includes("/video/"))) ? (
            <video
              ref={mediaRef}
              controls
              playsInline
              crossOrigin="anonymous"
              muted
              src={formatImageUrl(
                item.videoUrls?.[0] || item.videoUrl || mediaUrl,
              )}
              className="w-full h-full object-cover"
              onPlay={handleMediaPlay}
              onEnded={handleMediaEnded}
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-indigo-900/80" />
              {/* Decorative rings */}
              <div
                className="absolute w-40 h-40 rounded-full border border-purple-500/20 animate-ping"
                style={{ animationDuration: "3s" }}
              />
              <div
                className="absolute w-28 h-28 rounded-full border border-purple-400/30 animate-ping"
                style={{ animationDuration: "2s" }}
              />
              <div
                className="absolute w-16 h-16 rounded-full border border-purple-300/40 animate-ping"
                style={{ animationDuration: "1.5s" }}
              />

              {/* Vinyl record visual */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-700 to-indigo-900 border-4 border-purple-500/50 flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-700">
                  <div className="w-8 h-8 rounded-full bg-[#12002a] border-2 border-purple-400/60 flex items-center justify-center">
                    <FaMusic className="text-purple-300 text-sm" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Owner actions */}
          {isOwner && (
            <div
              className="absolute top-3 right-3 z-20 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href={`/dashboard/${type}/edit/${item._id}`}
                className="p-2 bg-black/40 backdrop-blur-sm rounded-full text-blue-400 hover:text-blue-300 hover:bg-black/60 transition-all pointer-events-auto"
                title="Edit"
              >
                <FaEdit size={13} />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 bg-black/40 backdrop-blur-sm rounded-full text-red-400 hover:text-red-300 hover:bg-black/60 transition-all pointer-events-auto"
                title="Delete"
              >
                <FaTrash size={13} />
              </button>
            </div>
          )}

          {/* Genre badge */}
          <div className="absolute top-3 left-3 z-20 pointer-events-auto">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
              {item.genre || item.category || "Music"}
            </span>
          </div>
        </div>

        {/* Info + Player */}
        <div className="flex flex-col gap-3 p-4 flex-1">
          <div>
            <Link
              href={`/music/detail/${item._id}`}
              className="block text-white font-bold text-base leading-snug hover:text-purple-300 transition-colors line-clamp-1"
            >
              {item.title || item.name}
            </Link>
            {item.createdBy && (
              <Link
                href={`/profile/${item.createdBy._id}`}
                className="text-purple-400 text-xs hover:text-purple-200 transition-colors"
              >
                by {item.createdBy.name || item.createdBy.username}
              </Link>
            )}
          </div>

          {/* Audio player */}
          {!(
            item.videoUrls?.length > 0 ||
            item.videoUrl ||
            (mediaUrl &&
              (mediaUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/i) ||
                mediaUrl.includes("/video/")))
          ) && (
            <audio
              ref={mediaRef}
              controls
              src={item.audioUrls?.[0] || mediaUrl}
              className="w-full h-9 rounded-lg"
              style={{ filter: "invert(1) hue-rotate(240deg) brightness(0.9)" }}
              onPlay={handleMediaPlay}
              onEnded={handleMediaEnded}
            />
          )}

          {/* Actions */}
          <div
            className="flex items-center justify-between pt-1 border-t border-purple-800/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${liked ? "text-red-400" : "text-purple-400 hover:text-red-400"}`}
              >
                {liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                <span>{likes}</span>
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-white transition-colors"
                title="Comment"
              >
                <FaComment size={13} />
                <span>{commentsCount}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-1.5 rounded-full text-purple-400 hover:text-white transition-colors"
                title="Share"
              >
                <FaShare size={12} />
              </button>
              <Link
                href={`/music/detail/${item._id}`}
                className="bg-purple-600 hover:bg-purple-500 !text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
              >
                <FaPlay size={10} className="!text-white" />{" "}
                <span className="!text-white">Listen</span>
              </Link>
            </div>
          </div>
        </div>

        {showComments && (
          <div className="border-t border-purple-800/40 bg-black/20 p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-sm text-white">Comments</h4>
              <button
                onClick={() => setShowComments(false)}
                className="text-purple-400 hover:text-red-400 text-xs font-bold transition-colors"
              >
                Hide
              </button>
            </div>
            <CommentsSection
              itemId={item._id}
              itemType={type}
              item={item}
              initialComments={item.comments}
              onCommentPosted={() => setShowComments(false)}
            />
          </div>
        )}
      </div>
    );
  }

 
  // VIDEO CARD (Grid) — Cinematic thumbnail with play overlay
  // ─────────────────────────────────────────────────────────
  if (!isListView && type === "video") {
    const thumbnail = item.thumbnail || item.imageUrls?.[0] || item.image;
    return (
      <div
        data-media-card
        onClick={handleCardClick}
        className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1 bg-[#00080f] border border-blue-900/30 flex flex-col cursor-pointer"
      >
        {/* Thumbnail / Video preview area */}
        <div className="relative aspect-video sm:min-h-[220px] overflow-hidden bg-black flex items-center justify-center group">
          <video
            ref={mediaRef}
            controls
            playsInline
            crossOrigin="anonymous"
            muted
            src={formatImageUrl(mediaUrl)}
            className="w-full h-full object-cover z-0 relative"
            preload="metadata"
            onPlay={handleMediaPlay}
            onEnded={handleMediaEnded}
          />

          {/* Duration / genre badge */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="bg-black/60 backdrop-blur-sm border border-white/10 text-blue-200 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest pointer-events-auto">
              {item.genre || item.category || "Video"}
            </span>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div
              className="absolute top-3 right-3 z-10 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href={`/dashboard/${type}/edit/${item._id}`}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-blue-400 hover:text-blue-200 transition-all"
                title="Edit"
              >
                <FaEdit size={13} />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-red-400 hover:text-red-200 transition-all"
                title="Delete"
              >
                <FaTrash size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 p-4 flex-1">
          <div>
            <Link
              href={`/video/detail/${item._id}`}
              className="block text-white font-bold text-sm leading-snug hover:text-blue-300 transition-colors line-clamp-2"
            >
              {item.title || item.name}
            </Link>
            {item.createdBy && (
              <Link
                href={`/profile/${item.createdBy._id}`}
                className="text-blue-400 text-xs hover:text-blue-200 transition-colors line-clamp-1"
              >
                by {item.createdBy.name || item.createdBy.username}
              </Link>
            )}
          </div>
          {item.description && (
            <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Actions */}
          <div
            className="flex items-center justify-between pt-2 border-t border-blue-900/40 mt-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${liked ? "text-red-400" : "text-slate-400 hover:text-red-400"}`}
              >
                {liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                <span>{likes}</span>
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                <FaComment size={13} />
                <span>{item.comments?.length || 0}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors"
                title="Share"
              >
                <FaShare size={12} />
              </button>
              <Link
                href={`/video/detail/${item._id}`}
                className="bg-blue-600 hover:bg-blue-500 !text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
              >
                <FaPlay size={10} className="!text-white" />{" "}
                <span className="!text-white">Watch</span>
              </Link>
            </div>
          </div>
        </div>

        {showComments && (
          <div className="border-t border-blue-900/40 bg-black/20 p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-sm text-white">Comments</h4>
              <button
                onClick={() => setShowComments(false)}
                className="text-slate-400 hover:text-red-400 text-xs font-bold transition-colors"
              >
                Hide
              </button>
            </div>
            <CommentsSection
              itemId={item._id}
              itemType={type}
              item={item}
              initialComments={item.comments}
              onCommentPosted={() => setShowComments(false)}
            />
          </div>
        )}
      </div>
    );
  }




  // LIST VIEW (all types)
  // ─────────────────────────────────────────────────────────
  if (isListView) {
    const viewLabel =
      type === "art" ? "Art" : type === "music" ? "Music" : "Video";
    return (
      <div
        data-media-card
        className="group bg-white dark:bg-[#0f021b] border border-slate-200 dark:border-purple-900/40 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col md:flex-row"
        style={{ minHeight: "220px" }}
      >
        <div className="w-full md:w-[300px] lg:w-[340px] relative h-52 md:h-auto flex-shrink-0 overflow-hidden">
          <MediaContent className="w-full h-full" isOwner={isOwner} type={type} item={item} isVideo={isVideo} mediaRef={mediaRef} handleMediaPlay={handleMediaPlay} handleMediaEnded={handleMediaEnded} mediaUrl={mediaUrl} handleDelete={handleDelete} />
        </div>
        <div className="p-6 flex flex-col flex-grow justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="bg-primary !text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm">
                {item.subcategory || item.genre || item.category || type}
              </span>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 transition ${liked ? "text-red-500" : "text-slate-400 hover:text-red-500"}`}
                  title="Like"
                >
                  {liked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                  <span className="text-xs font-bold font-mono">{likes}</span>
                </button>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition"
                  title="Comment"
                >
                  <FaComment size={18} />
                  <span className="text-xs font-bold font-mono">
                    {commentsCount}
                  </span>
                </button>
                <button
                  onClick={handleShare}
                  className="text-slate-400 hover:text-primary transition"
                  title="Share"
                >
                  <FaShare size={18} />
                </button>
                {type === "art" && (
                  <button
                    onClick={handleAddToCart}
                    className="text-slate-400 hover:text-primary transition"
                    title="Add to Cart"
                  >
                    <MdOutlineAddShoppingCart size={22} />
                  </button>
                )}
              </div>
            </div>
            <Link
              href={`/${type}/detail/${item._id}`}
              className="block text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2 truncate"
            >
              {item.title || item.name}
            </Link>
            {type === "art" && (
              <div className="text-primary font-bold text-lg mb-3">
                Rs. {item.price?.toLocaleString()}
              </div>
            )}
            <p className="text-slate-500 dark:text-purple-300/60 text-sm line-clamp-2 max-w-2xl mb-4">
              {item.description ||
                "Experience exceptional quality content curated from our top tier creators."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 dark:border-purple-900/20 gap-3">
            {item.createdBy && (
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0">
                  Artist
                </span>
                <Link
                  href={`/profile/${item.createdBy._id}`}
                  className="text-sm font-bold text-primary hover:underline truncate max-w-[160px]"
                >
                  {item.createdBy.name || item.createdBy.username}
                </Link>
              </div>
            )}
            <div className="flex items-center gap-3 shrink-0 ml-auto">
              <Link
                href={
                  type === "art"
                    ? `/arts/${item._id}`
                    : `/${type}/detail/${item._id}`
                }
                className="bg-primary !text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 whitespace-nowrap"
              >
                View {viewLabel}
              </Link>
            </div>
          </div>
        </div>
        {showComments && (
          <div className="border-t border-slate-100 dark:border-purple-900/20 bg-slate-50/50 dark:bg-purple-950/10 p-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg">Comments</h4>
              <button
                onClick={() => setShowComments(false)}
                className="text-slate-400 hover:text-red-500 font-bold text-sm"
              >
                Hide Comments
              </button>
            </div>
            <CommentsSection
              itemId={item._id}
              itemType={type}
              item={item}
              initialComments={item.comments}
              onCommentPosted={() => setShowComments(false)}
            />
          </div>
        )}
      </div>
    );
  }

  // ART GRID VIEW — Full c─────over hover card

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer group relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-slate-900 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30 h-full min-h-[260px] sm:min-h-[320px]"
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <MediaContent className="w-full h-full" isOwner={isOwner} type={type} item={item} isVideo={isVideo} mediaRef={mediaRef} handleMediaPlay={handleMediaPlay} handleMediaEnded={handleMediaEnded} mediaUrl={mediaUrl} handleDelete={handleDelete} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0118]/80 via-[#0d0118]/10 to-transparent transition-opacity duration-500 group-hover:opacity-90 pointer-events-none" />
      </div>

      {/* Overlay Content (pointer-events-none so touches pass to video, re-enabled on inner parts) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-6 pointer-events-none">
        {/* Top Badge & Action Icons */}
        <div className="flex justify-between items-start pointer-events-auto">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest shadow-lg">
            {item.subcategory || item.genre || item.category || type}
          </span>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full backdrop-blur-md border transition-all flex items-center justify-center gap-1 ${liked ? "bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-black/40 border-white/10 text-white hover:bg-black/60 hover:text-red-400"}`}
              title="Like"
            >
              {liked ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
              {likes > 0 && (
                <span className="text-[10px] font-bold">{likes}</span>
              )}
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 rounded-full backdrop-blur-md border border-white/10 bg-black/40 text-white hover:bg-black/60 hover:text-primary transition-all flex items-center justify-center gap-1"
              title="Comment"
            >
              <FaComment size={13} />
              {commentsCount > 0 && (
                <span className="text-[10px] font-bold">{commentsCount}</span>
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full backdrop-blur-md border border-white/10 bg-black/40 text-white hover:bg-black/60 transition-all"
              title="Share"
            >
              <FaShare size={13} />
            </button>
            {type === "art" && (
              <button
                onClick={handleAddToCart}
                className="p-2 rounded-full backdrop-blur-md border border-white/10 bg-black/40 text-white hover:bg-black/60 transition-all"
                title="Add to Cart"
              >
                <MdOutlineAddShoppingCart size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Info — always visible */}
        <div className="pointer-events-auto">
          <div className="mb-2">
            <Link
              href={
                type === "art"
                  ? `/arts/${item._id}`
                  : `/${type}/detail/${item._id}`
              }
              className="block text-lg sm:text-xl font-bold text-white mb-0.5 hover:text-primary transition-colors line-clamp-2"
            >
              {item.title || item.name}
            </Link>
            {item.createdBy && (
              <Link
                href={`/profile/${item.createdBy._id}`}
                className="text-white/60 text-xs font-medium hover:text-white transition-colors"
              >
                by{" "}
                <span className="font-bold">
                  {item.createdBy.name || item.createdBy.username}
                </span>
              </Link>
            )}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              {type === "art" ? (
                <div className="text-lg font-bold text-white tracking-tight">
                  Rs. {item.price?.toLocaleString()}
                </div>
              ) : (
                <div className="text-xs font-bold text-white/50 uppercase tracking-widest">
                  {type}
                </div>
              )}
            </div>
            <Link
              href={
                type === "art"
                  ? `/arts/${item._id}`
                  : `/${type}/detail/${item._id}`
              }
              className="bg-primary !text-white px-4 py-1.5 rounded-2xl hover:bg-primary/90 transition-all shadow-xl active:scale-95 flex items-center gap-1.5 font-bold text-sm whitespace-nowrap"
            >
              <span className="!text-white">View</span>
              <FaShare className="rotate-45" size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm p-4 flex flex-col overflow-y-auto rounded-[2rem] sm:rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-sm text-white">Comments</h4>
            <button
              onClick={() => setShowComments(false)}
              className="text-white/60 hover:text-red-400 text-xs font-bold transition-colors"
            >
              ✕ Close
            </button>
          </div>
          <CommentsSection
            itemId={item._id}
            itemType={type}
            item={item}
            initialComments={item.comments}
            onCommentPosted={(newArr) => {
              if (newArr) setCommentsCount(newArr.length);
            }}
          />
        </div>
      )}
    </div>
  );
}
