"use client";
import userApi from "@/api/users";
import Spinner from "@/components/Spinner";
import { updateUser } from "@/redux/auth/authSlice";
import Image from "next/image";
import { useState, useRef } from "react";
import { FaImage, FaCamera } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { formatImageUrl } from "../../../../helpers/url";

const CoverImage = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  function updateImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    const userId = user?._id || user?.id;
    if (!userId) {
        toast.error("User ID not found. Please log in again.");
        return;
    }

    userApi.updateCoverImage(userId, formData)
      .then((response) => {
        const updatedUser = response.data?.user || response.data;
        const newImageUrl = updatedUser.coverImageUrl;
        if (newImageUrl) {
            dispatch(updateUser({ ...user, coverImageUrl: newImageUrl }));
        }
        toast.success("Cover image updated successfully!", { autoClose: 1500 });
      })
      .catch((error) => {
        toast.error(error?.response?.data || "Failed to update cover image", { autoClose: 1500 });
      })
      .finally(() => {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      });
  }

  return (
    <div className="flex flex-col gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
      <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400">Profile Cover Photo</h4>
      <div className="relative group w-full h-40 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#160327] flex items-center justify-center">
        {user?.coverImageUrl ? (
          <Image
            src={formatImageUrl(user.coverImageUrl)}
            alt="Cover Preview"
            fill
            sizes="(max-width: 1200px) 100vw, 800px"
            className="object-cover"
          />
        ) : (
          <div className="text-center">
             <FaImage className="mx-auto h-10 w-10 text-gray-300 mb-2" />
             <p className="text-xs text-gray-400">No cover photo set</p>
          </div>
        )}

        {/* Hover overlay */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <Spinner className="h-8 w-8 text-white fill-white" />
          ) : (
            <div className="flex flex-col items-center gap-2">
                <FaCamera className="h-8 w-8 text-white" />
                <span className="text-white text-xs font-bold uppercase tracking-wider">Change Cover</span>
            </div>
          )}
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={updateImage}
        />
      </div>
      <p className="text-[10px] text-gray-400">Recommended size: 1200x400. Max file size: 5MB.</p>
    </div>
  );
};

export default CoverImage;
