"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaHeart, FaRegHeart, FaShare, FaArrowLeft,
  FaMusic, FaHeadphones, FaPlayCircle, FaUser,
  FaCalendarAlt, FaComment,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import musicApi from "@/api/music";
import MediaFeed from "@/components/MediaFeed";
import ReviewsSection from "@/components/ReviewsSection";
import Spinner from "@/components/Spinner";

const MusicDetail = ({ params }) => {
  const { id } = React.use(params);
  const { user } = useSelector((state) => state.auth);

  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchMusic = async () => {
      setLoading(true);
      try {
        const res = await musicApi.getMusicById(id);
        const item = res.data;
        setMusic(item);
        setLikes(item.reactions || 0);
      } catch (err) {
        console.error("Failed to fetch music:", err);
        toast.error("Could not load this track.");
      } finally {
        setLoading(false);
      }
    };
    fetchMusic();
  }, [id]);

  const handleLike = async () => {
    if (!user) { toast.info("Please login to like this track."); return; }
    if (isLiking) return;
    setIsLiking(true);
    try {
      await musicApi.likeMusic(id);
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));
      toast.success(liked ? "Like removed!" : "Track liked!");
    } catch (err) {
      toast.error("Failed to update like.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/music/detail/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (loading) return <Spinner />;
  if (!music)
    return (
      <div style={{ textAlign: "center", padding: "5rem 1rem", color: "#94a3b8", fontSize: "1.1rem" }}>
        Music track not found.
      </div>
    );

  const getAllMedia = () => {
    const urls = [];
    if (music.audioUrls) urls.push(...music.audioUrls);
    if (music.videoUrls) urls.push(...music.videoUrls);
    if (music.url) urls.push(music.url);
    return urls;
  };

  const mediaUrl = getAllMedia().find(url => 
    url?.toLowerCase().endsWith(".mp4") || 
    url?.toLowerCase().endsWith(".mov") || 
    url?.toLowerCase().endsWith(".webm")
  ) || music.audioUrls?.[0] || music.url || null;

  const isVideoMusic = mediaUrl?.toLowerCase().endsWith(".mp4") || 
                       mediaUrl?.toLowerCase().endsWith(".mov") || 
                       mediaUrl?.toLowerCase().endsWith(".webm") ||
                       (music.videoUrls && music.videoUrls.length > 0);

  const videoUrl = isVideoMusic ? mediaUrl : null;
  const audioUrl = !isVideoMusic ? mediaUrl : null;
  const genreLabel = music.subcategory || music.genre || "Music";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .mu-root {
          min-height: 100vh;
          background: var(--background);
          font-family: 'Inter', sans-serif;
          color: var(--foreground);
        }
        .mu-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1rem 4rem;
        }
        /* Back link */
        .mu-back {
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
        .mu-back:hover { gap: 0.75rem; }

        /* Main card */
        .mu-card {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
          margin-bottom: 1.5rem;
        }

        /* Banner */
        .mu-banner {
          background: ${isVideoMusic ? "#000" : "linear-gradient(135deg, var(--primary) 0%, #8b5cf6 50%, #a78bfa 100%)"};
          padding: ${isVideoMusic ? "0" : "2.5rem 2rem"};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          position: relative;
          overflow: hidden;
          aspect-ratio: ${isVideoMusic ? "16/9" : "auto"};
        }
        .mu-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${isVideoMusic ? "none" : "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"};
        }
        .mu-note-icon {
          width: 5rem;
          height: 5rem;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          border-radius: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.2);
          position: relative;
          z-index: 1;
        }
        .mu-audio-player {
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 1;
        }
        .mu-audio-player audio {
          width: 100%;
          height: 44px;
          border-radius: 0.75rem;
          outline: none;
        }
        .mu-video-player {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Body */
        .mu-body { padding: 1.75rem 2rem; }
        .mu-top-row {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .mu-top-row { flex-direction: row; justify-content: space-between; align-items: flex-start; }
        }
        .mu-genre-tag {
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
        .mu-title {
          font-size: 1.9rem;
          font-weight: 800;
          color: var(--foreground);
          margin: 0.75rem 0 0.3rem;
          line-height: 1.2;
        }
        .mu-artist {
          font-size: 0.9rem;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .mu-artist a { color: var(--primary); font-weight: 600; text-decoration: none; }
        .mu-artist a:hover { text-decoration: underline; }

        /* Action buttons */
        .mu-actions { display: flex; gap: 0.6rem; align-items: center; flex-shrink: 0; flex-wrap: wrap; }
        .mu-action-btn {
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
        .mu-action-btn:hover { border-color: var(--primary); color: var(--primary); background: rgba(124,58,237,0.05); transform: translateY(-1px); }
        .mu-action-btn.liked { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.2); color: #ef4444; }
        .mu-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Description */
        .mu-desc {
          margin-top: 1rem;
          color: var(--foreground);
          opacity: 0.8;
          font-size: 0.95rem;
          line-height: 1.7;
          padding-top: 1rem;
          border-top: 1.5px solid var(--border);
        }

        /* Meta footer */
        .mu-meta-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1.5px solid var(--border);
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .mu-meta-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: var(--muted); }
        .mu-toggle-comments {
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
        .mu-toggle-comments:hover { background: rgba(124,58,237,0.08); }

        /* Reviews / comments section wrapper */
        .mu-reviews-block {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 1.25rem;
          padding: 1.5rem 2rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          margin-bottom: 2rem;
        }

        /* Related */
        .mu-related-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .mu-related-title { font-size: 1.35rem; font-weight: 800; color: var(--foreground); }
        .mu-related-line { flex: 1; height: 2px; background: linear-gradient(to right, var(--primary), transparent); border-radius: 999px; }
      `}</style>

      <div className="mu-root">
        <div className="mu-container">
          {/* Back */}
          <Link href="/music" className="mu-back">
            <FaArrowLeft size={13} />
            Back to Music
          </Link>

          {/* Main card */}
          <div className="mu-card">
            {/* Banner */}
            <div className="mu-banner">
              {isVideoMusic ? (
                <video 
                  controls 
                  src={videoUrl} 
                  className="mu-video-player"
                  poster={music.thumbnailUrl || undefined}
                />
              ) : (
                <>
                  <div className="mu-note-icon">
                    <FaMusic />
                  </div>
                  {audioUrl && (
                    <div className="mu-audio-player">
                      <audio controls src={audioUrl} />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Body */}
            <div className="mu-body">
              <div className="mu-top-row">
                <div style={{ flex: 1 }}>
                  <span className="mu-genre-tag">
                    <FaHeadphones size={10} />
                    {genreLabel}
                  </span>
                  <h1 className="mu-title">{music.title}</h1>
                  {music.createdBy && (
                    <p className="mu-artist">
                      <FaUser size={11} />
                      By{" "}
                      <Link href={`/profile/${music.createdBy._id}`}>
                        {music.createdBy.name || music.createdBy.username || "Unknown Artist"}
                      </Link>
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mu-actions">
                  <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`mu-action-btn ${liked ? "liked" : ""}`}
                  >
                    {liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                    {likes}
                  </button>
                  <button onClick={handleShare} className="mu-action-btn">
                    <FaShare size={13} />
                    Share
                  </button>
                </div>
              </div>

              {music.description && (
                <p className="mu-desc">{music.description}</p>
              )}

              {/* Meta footer */}
              <div className="mu-meta-footer">
                <span className="mu-meta-item">
                  <FaCalendarAlt size={11} />
                  Uploaded:{" "}
                  {music.createdAt
                    ? new Date(music.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })
                    : "—"}
                </span>
                <button
                  onClick={() => setShowComments((p) => !p)}
                  className="mu-toggle-comments"
                >
                  <FaComment size={12} />
                  {showComments ? "Hide" : "View"} {music.comments?.length || 0} Comment(s)
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="mu-reviews-block">
            <ReviewsSection
              itemId={music._id}
              itemType="music"
              initialComments={music.comments || []}
            />
          </div>

          {/* Related Music */}
          <div>
            <div className="mu-related-header">
              <h2 className="mu-related-title">More Like This</h2>
              <div className="mu-related-line" />
            </div>
            <MediaFeed type="music" genre={music.subcategory || music.genre} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicDetail;