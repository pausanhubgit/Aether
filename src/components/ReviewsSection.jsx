"use client";

import React, { useState, useEffect } from "react";
import { FaStar, FaEdit, FaCheck, FaTrash, FaPen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import musicApi from "@/api/music";
import videoApi from "@/api/video";
import artsAPI from "@/api/arts";

function getApi(itemType) {
  if (itemType === "music") return musicApi;
  if (itemType === "video") return videoApi;
  if (itemType === "art") return artsAPI;
  return null;
}

export default function ReviewsSection({
  itemId,
  itemType,
  initialComments = [],
}) {
  const auth = useSelector((state) => state.auth);
  const user = auth?.user;
  const isAuthenticated = auth?.isAuthenticated || !!auth?.token;

  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Sync state if initialComments change (prop update)
  useEffect(() => {
    if (initialComments) setComments(initialComments);
  }, [initialComments]);

  // Compute aggregate rating
  const ratedComments = comments.filter(
    (c) => (c.rating && c.rating > 0) || (c.starRating && c.starRating > 0),
  );
  const avgRating =
    ratedComments.length > 0
      ? ratedComments.reduce(
          (acc, curr) => acc + (curr.rating || curr.starRating || 0),
          0,
        ) / ratedComments.length
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !rating) {
      toast.warn("Please add a comment or rating.");
      return;
    }

    setSubmitting(true);
    const payload = {
      text: text.trim(),
      comment: text.trim(),
      content: text.trim(),
      rating: Number(rating) || 0,
      starRating: Number(rating) || 0,
    };

    try {
      const api = getApi(itemType);
      const response = await api.addComment(itemId, payload);

      const data = response.data;
      if (data.comments && Array.isArray(data.comments)) {
        setComments(data.comments);
      } else if (Array.isArray(data)) {
        setComments(data);
      } else if (data && typeof data === "object") {
        const newComment = {
          ...data,
          username: data.username || user?.name || user?.username || "You",
          userId: data.userId || user?._id || user?.id,
          createdAt: data.createdAt || new Date().toISOString(),
        };
        setComments((prev) => [...prev, newComment]);
      }

      setText("");
      setRating(0);
      toast.success("Review posted!");
    } catch (err) {
      console.error("[Reviews] Post error:", err);
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to post review.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const api = getApi(itemType);
      await api.deleteComment(itemId, commentId);
      setComments((prev) => prev.filter((c) => (c._id || c.id) !== commentId));
      toast.success("Review deleted.");
    } catch (err) {
      console.error("[Reviews] Delete error:", err);
      toast.error("Failed to delete review.");
    }
  };

  return (
    <>
      <style>{`
        .rv-root { font-family: 'Inter', sans-serif; margin-top: 1rem; color: var(--foreground); }
        .rv-header {
          display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1.5px solid var(--border);
        }
        @media (min-width: 640px) {
          .rv-header { flex-direction: row; align-items: center; justify-content: space-between; }
        }
        .rv-title { font-size: 1.25rem; font-weight: 800; color: var(--foreground); margin: 0; }
        @media (min-width: 768px) {
          .rv-title { font-size: 1.5rem; }
        }
        .rv-stats { display: flex; align-items: center; gap: 1rem; }
        @media (min-width: 640px) {
          .rv-stats { gap: 1.5rem; }
        }
        .rv-stat-item { display: flex; flex-direction: column; align-items: center; }
        .rv-stat-value { font-size: 1.5rem; font-weight: 800; color: var(--foreground); line-height: 1; }
        @media (min-width: 768px) {
          .rv-stat-value { font-size: 1.75rem; }
        }
        .rv-stat-label { font-size: 0.65rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.4rem; }
        @media (min-width: 768px) {
          .rv-stat-label { font-size: 0.75rem; }
        }
        .rv-stars-avg { display: flex; gap: 2px; color: #f59e0b; margin-bottom: 0.2rem; }

        .rv-form-card { background: var(--background); border: 1.5px solid var(--border); border-radius: 1rem; padding: 1.25rem; margin-bottom: 2.5rem; }
        @media (min-width: 768px) {
          .rv-form-card { padding: 1.5rem; }
        }
        .rv-form-title { font-size: 1rem; font-weight: 700; color: var(--foreground); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; opacity: 0.9; }
        .rv-rating-select { display: flex; gap: 0.25rem; margin-bottom: 1.25rem; }
        @media (min-width: 640px) {
          .rv-rating-select { gap: 0.5rem; }
        }
        .rv-star-btn { background: none; border: none; cursor: pointer; color: var(--border); transition: all 0.2s; padding: 0; font-size: 24px; }
        .rv-star-btn.active { color: #f59e0b; }
        .rv-star-btn:hover { transform: scale(1.2); }
        .rv-textarea { width: 100%; min-height: 100px; padding: 1rem; border-radius: 0.75rem; border: 1.5px solid var(--border); background: var(--surface); color: var(--foreground); font-family: inherit; font-size: 0.95rem; resize: vertical; transition: all 0.2s; box-sizing: border-box; }
        .rv-textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px rgba(124,58,237,0.1); }
        .rv-submit-btn { margin-top: 1rem; background: var(--primary); color: #fff; border: none; padding: 0.75rem 1.75rem; border-radius: 0.75rem; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; width: 100%; justify-content: center; }
        @media (min-width: 640px) {
          .rv-submit-btn { width: auto; }
        }
        .rv-submit-btn:hover { background: #6d28d9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(124,58,237,0.3); }
        .rv-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .rv-login-cta { padding: 1.5rem; text-align: center; background: var(--background); border-radius: 1rem; color: var(--muted); font-weight: 600; font-size: 0.9rem; margin-bottom: 2rem; border: 1.5px dashed var(--border); }
        @media (min-width: 768px) {
          .rv-login-cta { padding: 2rem; font-size: 0.95rem; }
        }
        .rv-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .rv-item { padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); display: flex; gap: 0.75rem; }
        @media (min-width: 640px) {
          .rv-item { gap: 1.25rem; }
        }
        .rv-item:last-child { border-bottom: none; }
        .rv-avatar { width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, var(--primary), #a855f7); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; flex-shrink: 0; text-transform: uppercase; }
        @media (min-width: 768px) {
          .rv-avatar { width: 3rem; height: 3rem; font-size: 1.1rem; }
        }
        .rv-content { flex: 1; min-width: 0; }
        .rv-item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem; gap: 0.5rem; }
        .rv-user-name { font-weight: 700; color: var(--foreground); font-size: 0.9rem; truncate: true; }
        @media (min-width: 768px) {
          .rv-user-name { font-size: 0.95rem; }
        }
        .rv-date { font-size: 0.7rem; color: var(--muted); }
        @media (min-width: 768px) {
          .rv-date { font-size: 0.75rem; }
        }
        .rv-item-stars { display: flex; gap: 2px; color: #f59e0b; margin-bottom: 0.6rem; }
        .rv-text { color: var(--foreground); opacity: 0.9; line-height: 1.6; font-size: 0.88rem; overflow-wrap: break-word; }
        @media (min-width: 768px) {
          .rv-text { font-size: 0.92rem; }
        }
        .rv-delete-btn { background: none; border: none; color: #ef4444; opacity: 0.4; cursor: pointer; padding: 0.4rem; border-radius: 0.5rem; transition: all 0.2s; flex-shrink: 0; }
        .rv-delete-btn:hover { background: rgba(239,68,68,0.1); opacity: 1; }
        .rv-empty { text-align: center; padding: 2rem 0; color: var(--muted); font-style: italic; }
        @media (min-width: 768px) {
          .rv-empty { padding: 3rem 0; }
        }
      `}</style>

      <div className="rv-root">
        <div className="rv-header">
          <h3 className="rv-title">Customer Reviews</h3>
          <div className="rv-stats">
            <div className="rv-stat-item">
              <div className="rv-stat-value">{avgRating.toFixed(1)}</div>
              <div className="rv-stars-avg">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FaStar
                    key={s}
                    size={10}
                    color={s <= Math.round(avgRating) ? "#f59e0b" : "#cbd5e1"}
                  />
                ))}
              </div>
              <div className="rv-stat-label">Avg Rating</div>
            </div>
            <div className="rv-stat-item">
              <div className="rv-stat-value">{comments.length}</div>
              <div className="rv-stat-label">Reviews</div>
            </div>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="rv-form-card">
            <h4 className="rv-form-title">
              <FaEdit size={14} /> Share your experience
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="rv-rating-select">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className={`rv-star-btn ${s <= rating ? "active" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                className="rv-textarea"
                placeholder="Write your review here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                type="submit"
                disabled={submitting}
                className="rv-submit-btn"
              >
                {submitting ? (
                  "Posting..."
                ) : (
                  <>
                    <FaCheck /> Post Review
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="rv-login-cta">
            🌟 Login to leave a review and rate this item
          </div>
        )}

        <div className="rv-list">
          {comments.length === 0 ? (
            <div className="rv-empty">
              No reviews yet. Be the first to share your thoughts!
            </div>
          ) : (
            [...comments].reverse().map((comment) => {
              const cId = comment._id || comment.id;
              const isOwner =
                user &&
                (comment.userId === user._id || comment.userId === user.id);
              const isAdmin = user && user.roles?.includes("ADMIN");
              const canDelete = isOwner || isAdmin;

              return (
                <div key={cId} className="rv-item">
                  <div className="rv-avatar">
                    {(comment.username || "U")[0]}
                  </div>
                  <div className="rv-content">
                    <div className="rv-item-header">
                      <div>
                        <div className="rv-user-name">
                          {comment.username || "Anonymous"}
                        </div>
                        <div className="rv-date">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </div>
                      </div>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(cId)}
                          className="rv-delete-btn"
                          title="Delete review"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                    {(comment.rating || comment.starRating) > 0 && (
                      <div className="rv-item-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar
                            key={s}
                            size={12}
                            color={
                              s <= (comment.rating || comment.starRating)
                                ? "#f59e0b"
                                : "#cbd5e1"
                            }
                          />
                        ))}
                      </div>
                    )}
                    <div className="rv-text">
                      {comment.text ||
                        comment.comment ||
                        comment.content ||
                        comment.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
