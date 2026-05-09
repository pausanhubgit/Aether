"use client";

import { FaCartPlus, FaStar, FaHeart, FaComment } from "react-icons/fa6";
import { GRID_VIEW, LIST_VIEW } from "@/constants/artView";
import { ART_ROUTE } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likeArtAsync, unlikeArtAsync } from "@/lib/slices/artsSlice";

import imagePlaceholder from "@/assets/images/arts/default-image-missing-placeholder-free-vector.jpg";
import AddToCart from "./AddToCart";
import CommentsSection from "@/components/CommentsSection";

const ArtCard = ({ art, artView }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Backend should ideally handle the starting liked state.
      setLiked(false);
    }
  }, [art.id, isAuthenticated, user]);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      if (liked) {
        await dispatch(
          unlikeArtAsync({
            artId: art.id,
            userId: user?._id || user?.id || "guest",
          }),
        ).unwrap();
        setLiked(false);
      } else {
        await dispatch(
          likeArtAsync({
            artId: art.id,
            userId: user?._id || user?.id || "guest",
          }),
        ).unwrap();
        setLiked(true);
      }
    } catch (error) {
      console.error("Error liking/unliking art:", error);
      if (!isAuthenticated) {
        toast.info("Enjoying the art? Login to save your likes forever!");
      } else {
        toast.error("Failed to update like. Please try again.");
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#160327] dark:text-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer flex flex-col mb-4 border border-gray-100 dark:border-gray-600">
      <div className="relative overflow-hidden shadow-sm">
        <Link href={`${ART_ROUTE}/${art.id || art._id}`}>
          <Image
            src={art.imageUrls?.[0] ?? imagePlaceholder}
            className="w-full h-48 object-cover hover:scale-105 transition-all duration-300"
            alt={art.title || "Art image"}
            width={500}
            height={192}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <span className="absolute top-2 left-2 bg-red-500 text-white rounded-full text-xs h-10 w-10 flex items-center justify-center">
          -20%
        </span>
      </div>
      <div className="p-4 flex flex-col justify-center flex-grow">
        <div className="flex items-center mb-2">
          <Link
            href={`?category=${art.category}`}
            className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-600 dark:text-gray-300"
          >
            {art.category}
          </Link>
        </div>
        <h3 className="font-semibold text-xl hover:text-secondary dark:hover:text-primary transition-all duration-300 mb-2">
          <Link href={`${ART_ROUTE}/${art.id || art._id}`}>
            {art.title || art.name}
          </Link>
        </h3>
        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-primary dark:text-secondary font-bold mr-1 text-lg">
              Rs. {art.price}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`text-xl ${liked ? "text-red-500" : "text-gray-400"} hover:text-red-500 transition-colors ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
              title="Like"
            >
              <FaHeart />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className={`text-xl ${showComments ? "text-blue-500" : "text-gray-400"} hover:text-blue-500 transition-colors flex items-center gap-1`}
              title="Comments"
            >
              <FaComment />
              <span className="text-xs font-bold">
                {art.comments?.length || 0}
              </span>
            </button>
            <AddToCart product={art} />
          </div>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-gray-100 dark:border-gray-600 p-4 bg-gray-50 dark:bg-[#160327] animate-in slide-in-from-top duration-200">
          <CommentsSection
            itemId={art.id || art._id}
            itemType="art"
            initialComments={art.comments}
            autoFocus={true}
          />
        </div>
      )}
    </div>
  );
};

export default ArtCard;
