"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { getFeedItems } from "@/lib/storage";
import { formatImageUrl } from "@/helpers/url";

const renderType = {
  art: "Art",
  photo: "Photo",
  profile: "Profile",
  video: "Video",
  music: "Music",
};

export default function Feed({ limit = 25 }) {
  const [items] = useState(() => {
    if (typeof window === "undefined") return [];
    return getFeedItems();
  });

  const sorted = useMemo(() => {
    return [...items].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [items]);

  if (!sorted.length) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <p className="text-lg font-semibold text-white/80">
          Your feed is empty.
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Upload something from Dashboard to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.slice(0, limit).map((item) => {
        // Handle both 'url' and 'image' properties
        const mediaUrl = item.url || item.image;

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-[rgba(124,58,237,0.18)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                    {renderType[item.type] ?? item.type}
                  </span>
                  <span className="text-sm text-[var(--muted)]">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {item.title || "Untitled"}
                </h3>
                {item.description ? (
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {item.description}
                  </p>
                ) : null}
              </div>

              {mediaUrl ? (
                <div className="flex items-center gap-2">
                  {item.type === "video" ? (
                    <video
                      controls
                      playsInline
                      crossOrigin="anonymous"
                      preload="metadata"
                      src={formatImageUrl(mediaUrl)}
                      className="max-h-36 rounded-lg border border-[var(--border)]"
                    />
                  ) : item.type === "music" ? (
                    <audio
                      controls
                      crossOrigin="anonymous"
                      src={formatImageUrl(mediaUrl)}
                      className="w-full max-w-xs"
                    />
                  ) : item.type === "photo" || item.type === "art" ? (
                    <Image
                      src={mediaUrl}
                      alt={item.title || "Uploaded content"}
                      width={300}
                      height={160}
                      className="max-h-40 rounded-lg border border-[var(--border)] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/images/placeholder.jpg";
                      }}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
