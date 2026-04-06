"use client";

import React, { useState, useEffect } from 'react';
import { FaTrash, FaComment } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import musicApi from "@/api/music";
import videoApi from "@/api/video";
import artsAPI from "@/api/arts";

function CommentsSection({ itemId, itemType, initialComments = [], autoFocus = false, onCommentPosted }) {
  const { user } = useSelector(state => state.auth);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = React.useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Sync state if initialComments change
  useEffect(() => {
    if (initialComments) setComments(initialComments);
  }, [initialComments]);

  const getApi = () => {
    if (itemType === "music") return musicApi;
    if (itemType === "video") return videoApi;
    if (itemType === "art") return artsAPI;
    return null;
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    setLoading(true);

    try {
      const api = getApi();
      const response = await api.addComment(itemId, { text: newComment });
      setComments(response.data.comments || []);
      setNewComment('');
      toast.success("Comment posted!");
      if (onCommentPosted) onCommentPosted(response.data.comments || []);
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error("Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const api = getApi();
      const response = await api.deleteComment(itemId, commentId);
      setComments(response.data.comments || []);
      toast.success("Comment deleted.");
      if (onCommentPosted) onCommentPosted(response.data.comments || []);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error("Failed to delete comment.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Comment */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Add a comment..." : "Login to post a comment..."}
          className="flex-1 px-3 py-2 border border-gray-200 dark:border-purple-900/40 rounded-xl bg-white dark:bg-[#0d0118] text-sm dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          disabled={loading}
        />
        <button
          onClick={handleAddComment}
          disabled={loading || !newComment.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition text-sm font-bold disabled:opacity-50"
        >
          {user ? 'Post' : 'Post as Guest'}
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
        {comments.length === 0 ? (
          <p className="text-gray-400 dark:text-purple-400/60 text-center py-4 text-sm italic">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {[...comments].reverse().map((comment) => {
              const cId = comment._id || comment.id;
              const isOwner = user && (comment.userId === user._id || comment.userId === user.id);
              const isAdmin = user && user.roles?.some(r => r.toUpperCase() === "ADMIN");

              return (
                <div key={cId} className="flex gap-3 group">
                  <div className="shrink-0 pt-1">
                    <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-sm border border-purple-200 dark:border-purple-800 shadow-sm">
                      {comment.username?.charAt(0).toUpperCase() || "A"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 dark:bg-purple-900/20 px-4 py-3 rounded-[1.25rem] inline-block max-w-[95%] shadow-sm">
                      <p className="font-bold text-black dark:text-purple-100 text-xs mb-1 hover:underline cursor-pointer">
                        {comment.username || 'Anonymous User'}
                      </p>
                      <p className="text-gray-700 dark:text-purple-200/90 text-sm leading-relaxed whitespace-pre-wrap">{comment.text || comment.comment || comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 px-2">
                      <span className="text-[10px] text-gray-400 dark:text-purple-400/60 font-semibold uppercase tracking-tight">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      <button className="text-[10px] font-bold text-gray-500 hover:text-purple-600 transition-colors uppercase tracking-tight">Like</button>
                      <button className="text-[10px] font-bold text-gray-500 hover:text-purple-600 transition-colors uppercase tracking-tight">Reply</button>
                      {(isOwner || isAdmin) && (
                        <button 
                          onClick={() => handleDeleteComment(cId)}
                          className="text-red-400/60 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-tight"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentsSection;
