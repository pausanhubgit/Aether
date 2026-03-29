"use client";
import userApi from "@/api/users";
import Spinner from "@/components/Spinner";
import { updateUser } from "@/redux/auth/authSlice";
import Image from "next/image";
import { useState, useRef } from "react";
import { FaUser, FaCamera } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { formatImageUrl } from "../../../../helpers/url";

const ProfileImage = ({ user }) => {
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

    userApi.updateProfileImage(userId, formData)
      .then((response) => {
        const updatedUser = response.data?.user || response.data;
        const newImageUrl = updatedUser.profileImageUrl || updatedUser.profileImage;
        if (newImageUrl) {
            // dispatch full updated user so header avatar also refreshes
            dispatch(updateUser({ ...user, profileImageUrl: newImageUrl }));
        }
        toast.success("Profile image updated successfully!", { autoClose: 1500 });
      })
      .catch((error) => {
        toast.error(error?.response?.data || "Failed to update image", { autoClose: 1500 });
      })
      .finally(() => {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
      <div className="relative group">
        <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gray-100 dark:bg-[#160327] flex items-center justify-center">
          {user?.profileImageUrl ? (
            <Image
              src={formatImageUrl(user.profileImageUrl)}
              alt={user?.username || user?.name || "Profile"}
              fill
              sizes="(max-width: 768px) 128px, 128px"
              className="object-cover"
              priority
            />
          ) : (
            <FaUser className="h-16 w-16 text-gray-400" />
          )}
        </div>

        {/* Hover overlay & camera icon */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <Spinner className="h-8 w-8 text-white fill-white" />
          ) : (
            <FaCamera className="h-8 w-8 text-white" />
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

      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{user?.username || user?.name || "Set your name"}</h2>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="px-5 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 rounded-full text-sm font-semibold transition shadow-sm"
        >
          {loading ? "Uploading..." : "Change Profile Photo"}
        </button>
      </div>
    </div>
  );
};

export default ProfileImage;