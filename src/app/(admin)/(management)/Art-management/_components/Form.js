"use client";

import artsAPI from "@/api/arts";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "@/components/Button";
import Image from "next/image";

const ArtForm = ({ art, isEditing = false }) => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [artImages, setArtImages] = useState([]);
  const [localImageUrls, setLocalImageUrls] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    values: art,
  });

  function prepareData(data) {
    const formdata = new FormData();

    formdata.append("title", data.title);
    formdata.append("price", data.price);
    formdata.append("category", data.category);
    
    // Non-standard fields (artist, brand, stock) removed to align with standard artwork schema
    if (data.description) formdata.append("description", data.description);
    
    // Explicitly add merchantId if available from session
    if (user?._id || user?.id) {
        formdata.append("merchantId", user?._id || user?.id);
    }

    if (artImages.length > 0) {
      artImages.map((image, index) => {
        // First image as primary 'image', others as 'images' gallery
        if (index === 0) {
          formdata.append("image", image);
        } else {
          formdata.append("images", image);
        }
      });
    }

    return formdata;
  }

  async function submitForm(data) {
    setLoading(true);

    const input = prepareData(data);

    try {
      if (isEditing) {
        await artsAPI.updateArt(art._id, input);

        toast.success("Art updated successfully.", { autoClose: 1500 });

        return;
      }

      await artsAPI.createArts(input);

      reset();

      toast.success("Art created successfully.", { autoClose: 1500 });
    } catch (error) {
      // Robust error reporting to catch backend validation or auth issues
      if (error.response?.status === 403) {
          toast.error("403 Forbidden: Your session roles might be stale. Please LOGOUT and LOGIN again to refresh your permissions.", { autoClose: 10000 });
      } else {
          const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Upload failed. Please check your connection.";
          toast.error(errorMessage, { autoClose: 3000 });
      }
      console.error("Art Upload Error:", error);
    } finally {
      setLoading(false);
      setLocalImageUrls([]);
      setArtImages([]);
    }
  }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-black dark:text-white"
          >
            Art Name
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 dark:bg-[#160327] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Type art title"
            {...register("title", { required: "Art title is required." })}
          />
          <p className="text-red-500 text-sm m-2">{errors.title?.message}</p>
        </div>
        <div className="w-full">
          <label
            htmlFor="price"
            className="block mb-2 text-sm font-medium text-black dark:text-white"
          >
            Price (Rs.)
          </label>
          <input
            type="number"
            id="price"
            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 dark:bg-[#160327] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Rs.2999"
            {...register("price", { required: "Product price is required." })}
          />
          <p className="text-red-500 text-sm m-2">{errors.price?.message}</p>
        </div>
        <div>
          <label
            htmlFor="category"
            className="block mb-2 text-sm font-medium text-black dark:text-white"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 dark:bg-[#160327] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Product category"
            {...register("category", {
              required: "Product category is required.",
            })}
          />
          <p className="text-red-500 text-sm m-2">{errors.category?.message}</p>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-black dark:text-white"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={8}
            className="block p-2.5 w-full text-sm text-black bg-gray-50 rounded-lg border border-gray-300 dark:bg-[#160327] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Your description here"
            {...register("description")}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-2 text-sm font-medium text-black dark:text-white">
            Images
          </label>
          <label
            htmlFor="images"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-[#160327] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, JPEG
              </p>
            </div>
            <input
              id="images"
              type="file"
              className="hidden"
              multiple
              accept=".png,.jpg,.jpeg"
              onChange={(event) => {
                const files = [];
                const urls = [];

                Array.from(event.target.files).map((file) => {
                  files.push(file);
                  urls.push(URL.createObjectURL(file));
                });

                setLocalImageUrls(urls);
                setArtImages(files);
              }}
            />
          </label>
        </div>

        {localImageUrls.length > 0 && (
          <div className="flex items-center gap-3">
            {localImageUrls.map((url, index) => (
              <Image
                key={index}
                height={64}
                width={64}
                alt=""
                src={url}
                className="object-cover p-1 rounded-md bg-slate-300 dark:bg-slate-600"
              />
            ))}
          </div>
        )}
      </div>

      <Button
        label={isEditing ? "Update & Save Art" : "Save & Upload Art"}
        loading={loading}
        className="mt-4 px-12 text-center sm:mt-6 bg-purple-600 !text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20"
      />
    </form>
  );
};

export default ArtForm;