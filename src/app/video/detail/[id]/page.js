"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaHeart, FaRegHeart, FaShare, FaArrowLeft,
  FaVideo, FaPlay, FaUser, FaCalendarAlt, FaComment,
  FaCheckCircle
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import videoApi from "@/api/video";
import MediaFeed from "@/components/MediaFeed";
import ReviewsSection from "@/components/ReviewsSection";
import Spinner from "@/components/Spinner";

const VideoDetail = ({ params }) => {
  const { id } = React.use(params);
  const { user } = useSelector((state) => state.auth);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const res = await videoApi.getVideoById(id);
        const item = res.data;
        setVideo(item);
        setLikes(item.reactions || 0);
      } catch (err) {
        console.error("Failed to fetch video:", err);
        toast.error("Could not load this video.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    if (!user) { toast.info("Please login to like this video."); return; }
    if (isLiking) return;
    setIsLiking(true);
    try {
      await videoApi.likeVideo(id);
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));
      toast.success(liked ? "Like removed!" : "Video liked!");
    } catch (err) {
      toast.error("Failed to update like.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/video/detail/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (loading) return <Spinner />;
  if (!video)
    return (
      <div style={{ textAlign: "center", padding: "5rem 1rem", color: "#94a3b8", fontSize: "1.1rem" }}>
        Video not found.
      </div>
    );

  const allUrls = [];
  if (video.videoUrls && Array.isArray(video.videoUrls)) allUrls.push(...video.videoUrls);
  if (video.url) allUrls.push(video.url);
  if (video.videoUrl) allUrls.push(video.videoUrl);
  
  const videoRegex = /\.(mp4|webm|mov|m4v|ogv|mkv)(\?.*)?$/i;
  const videoUrl = allUrls.find(url => videoRegex.test(url)) || allUrls[0] || null;
  const genreLabel = video.subcategory || video.genre || video.category || "Video";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .vi-root {
          min-height: 100vh;
          background: var(--background);
          font-family: 'Inter', sans-serif;
          color: var(--foreground);
        }
        .vi-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1rem 4rem;
        }
        /* Overrides for better contrast on white bg */
        .vi-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary);
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          margin-bottom: 1.5rem;
          transition: gap 0.2s;
        }
        .vi-back:hover { gap: 0.75rem; }

        /* Main card */
        .vi-card {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
          margin-bottom: 1.5rem;
        }

        /* Player Wrapper */
        .vi-player-wrap {
          background: #000;
          width: 100%;
          aspect-ratio: 16 / 9;
          position: relative;
        }
        .vi-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .vi-no-video {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.2);
          font-size: 4rem;
          background: #0f172a;
        }

        /* Body */
        .vi-body { padding: 1.75rem 2rem; }
        .vi-top-row {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .vi-top-row { flex-direction: row; justify-content: space-between; align-items: flex-start; }
        }
        .vi-genre-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          color: var(--primary);
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .vi-title {
          font-size: 1.9rem;
          font-weight: 800;
          color: var(--foreground);
          margin: 0.75rem 0 0.3rem;
          line-height: 1.2;
        }
        .vi-creator {
          font-size: 0.9rem;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .vi-creator a { color: var(--primary); font-weight: 600; text-decoration: none; }
        .vi-creator a:hover { text-decoration: underline; }

        /* Actions */
        .vi-actions { display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap; }
        .vi-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 700;
          border: 1.5px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          background: var(--surface);
          color: var(--foreground);
        }
        .vi-action-btn:hover { border-color: var(--primary); color: var(--primary); background: rgba(124,58,237,0.05); transform: translateY(-1px); }
        .vi-action-btn.liked { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.2); color: #ef4444; }
        .vi-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Description */
        .vi-desc {
          margin-top: 1.25rem;
          color: var(--foreground);
          opacity: 0.8;
          font-size: 0.95rem;
          line-height: 1.7;
          padding-top: 1rem;
          border-top: 1.5px solid var(--border);
        }

        /* Footer */
        .vi-meta-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1.5px solid var(--border);
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .vi-meta-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: var(--muted); }
        .vi-toggle-comments {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0.4rem 0.85rem;
          border-radius: 0.6rem;
          transition: background 0.2s;
        }
        .vi-toggle-comments:hover { background: rgba(124,58,237,0.08); }

        /* Reviews Block */
        .vi-reviews-block {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 1.25rem;
          padding: 1.5rem 2rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          margin-bottom: 2rem;
        }

        /* Related */
        .vi-related-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .vi-related-title { font-size: 1.35rem; font-weight: 800; color: var(--foreground); }
        .vi-related-line { flex: 1; height: 2px; background: linear-gradient(to right, var(--primary), transparent); border-radius: 999px; }
      `}</style>

      <div className="vi-root">
        <div className="vi-container">
          {/* Back */}
          <Link href="/video" className="vi-back">
            <FaArrowLeft size={13} />
            Back to Videos
          </Link>

          {/* Main Card */}
          <div className="vi-card">
            {/* Player */}
            <div className="vi-player-wrap">
              {videoUrl ? (
                <video
                  key={videoUrl}
                  controls
                  src={videoUrl}
                  className="vi-video"
                  poster={video.thumbnailUrl || video.imageUrls?.[0] || undefined}
                />
              ) : (
                <div className="vi-no-video">
                  <FaVideo />
                </div>
              )}
            </div>

            {/* Body */}
            <div className="vi-body">
              <div className="vi-top-row">
                <div style={{ flex: 1 }}>
                  <span className="vi-genre-tag">
                    <FaPlay size={9} />
                    {genreLabel}
                  </span>
                  <h1 className="vi-title">{video.title}</h1>
                  {video.createdBy && (
                    <p className="vi-creator">
                      <FaUser size={11} />
                      By{" "}
                      <Link href={`/profile/${video.createdBy._id}`}>
                        {video.createdBy.name || video.createdBy.username || "Unknown Creator"}
                      </Link>
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="vi-actions">
                  <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`vi-action-btn ${liked ? "liked" : ""}`}
                  >
                    {liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                    {likes}
                  </button>
                  <button onClick={handleShare} className="vi-action-btn">
                    <FaShare size={13} />
                    Share
                  </button>
                </div>
              </div>

              {video.description && (
                <p className="vi-desc">{video.description}</p>
              )}

              {/* Meta footer */}
              <div className="vi-meta-footer">
                <span className="vi-meta-item">
                  <FaCalendarAlt size={11} />
                  Uploaded:{" "}
                  {video.createdAt
                    ? new Date(video.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })
                    : "—"}
                </span>
                <button
                  onClick={() => setShowComments((p) => !p)}
                  className="vi-toggle-comments"
                >
                  <FaComment size={12} />
                  {showComments ? "Hide" : "View"} {video.comments?.length || 0} Comment(s)
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="vi-reviews-block">
            <ReviewsSection
              itemId={video._id}
              itemType="video"
              initialComments={video.comments || []}
            />
          </div>

          {/* Related Videos */}
          <div>
            <div className="vi-related-header">
              <h2 className="vi-related-title">More Like This</h2>
              <div className="vi-related-line" />
            </div>
            <MediaFeed type="video" genre={video.subcategory || video.genre || video.category} excludeId={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoDetail;