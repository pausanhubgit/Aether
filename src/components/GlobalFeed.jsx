"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaHeart, FaShare, FaMusic } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getFeedItems, setFeedItems } from "@/lib/storage";
import { formatImageUrl } from "@/helpers/url";

const renderType = {
  art: "Art",
  photo: "Photo",
  video: "Video",
  music: "Music",
};

const getDetailLink = (item) => {
  if (item.type === "video") return `/video/detail/${item._id || item.id}`;
  if (item.type === "music") return `/music/detail/${item._id || item.id}`;
  if (item.type === "art" || item.type === "photo")
    return `/arts/${item._id || item.id}`;
  return null;
};

export default function GlobalFeed({ limit = 25 }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const items = getFeedItems();
      setFeed(items);
    } catch (err) {
      setError("Unable to load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  const persistFeed = (items) => {
    setFeed(items);
    setFeedItems(items);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("feedUpdated"));
    }
  };

  const handleLike = (itemId) => {
    const updated = feed.map((item) => {
      if (item.id === itemId) {
        return { ...item, likes: (item.likes || 0) + 1 };
      }
      return item;
    });
    persistFeed(updated);
  };

  const handleShare = (item) => {
    const shareItem = {
      ...item,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    persistFeed([shareItem, ...feed]);
    alert("Shared to home feed!");
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <p className="text-lg font-semibold text-[var(--foreground)]/80">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <p className="text-lg font-semibold text-[var(--foreground)]/80">
          Error loading feed
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">{error}</p>
      </div>
    );
  }

  if (!feed.length) {
    return null;
  }

  return (
    <div className="container-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feed.slice(0, limit).map((item) => {
          // Handle both 'url' and 'image' properties
          const mediaUrl = item.url || item.image;

          return (
            <div
              key={item.id}
              onClick={() => {
                const link = getDetailLink(item);
                if (link) router.push(link);
              }}
              className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
                getDetailLink(item) ? "cursor-pointer hover:-translate-y-1" : ""
              }`}
            >
              {/* Media Content */}
              {mediaUrl ? (
                <div className="relative">
                  {item.type === "video" ? (
                    <video
                      controls
                      playsInline
                      crossOrigin="anonymous"
                      preload="metadata"
                      src={formatImageUrl(mediaUrl)}
                      className="w-full h-48 object-cover"
                    />
                  ) : item.type === "music" ? (
                    <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      {item.videoUrl ||
                      (mediaUrl &&
                        (mediaUrl
                          .toLowerCase()
                          .match(/\.(mp4|webm|ogg|mov)$/i) ||
                          mediaUrl.includes("/video/"))) ? (
                        <video
                          controls
                          playsInline
                          crossOrigin="anonymous"
                          preload="metadata"
                          src={formatImageUrl(item.videoUrl || mediaUrl)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-white">
                          <FaMusic size={48} className="mx-auto mb-2" />
                          <p className="text-sm">Audio Content</p>
                        </div>
                      )}
                    </div>
                  ) : item.type === "photo" || item.type === "art" ? (
                    <Image
                      src={mediaUrl || "/assets/images/placeholder.jpg"}
                      alt={item.title || "Uploaded content preview"}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/images/placeholder.jpg";
                      }}
                    />
                  ) : null}
                </div>
              ) : (
                <div className="w-full h-48 bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-purple-300/60">
                    No media
                  </p>
                </div>
              )}

              {/* Content Details */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center rounded-full bg-[rgba(124,58,237,0.18)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                    {renderType[item.type] ?? item.type}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {new Date(item.createdAt || Date.now()).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 line-clamp-2">
                  {item.title || "Untitled"}
                </h3>
                {item.description ? (
                  <p className="text-sm text-[var(--muted)] mb-3 line-clamp-3">
                    {item.description}
                  </p>
                ) : null}

                {/* Like and Share buttons */}
                <div
                  className="flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleLike(item.id)}
                    className="flex items-center gap-2 text-[var(--muted)] hover:text-red-500 transition"
                  >
                    <FaHeart size={16} />
                    <span className="text-sm">{item.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => handleShare(item)}
                    className="flex items-center gap-2 text-[var(--muted)] hover:text-blue-500 transition"
                  >
                    <FaShare size={16} />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
