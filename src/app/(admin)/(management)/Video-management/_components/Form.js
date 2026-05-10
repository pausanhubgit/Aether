"use client";

import videoAPI from "@/api/video";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Image from "next/image";
import { FaPlus, FaVideo } from "react-icons/fa";

const VideoForm = ({ video, isEditing = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [videoImages, setVideoImages] = useState([]);
  const [localImageUrls, setLocalImageUrls] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaFileUrls, setMediaFileUrls] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    values: video,
  });

  function prepareData(data) {
    const formdata = new FormData();

    formdata.append("title", data.title);
    formdata.append("artist", data.artist);
    formdata.append("category", data.category);
    formdata.append("subcategory", data.subcategory);
    formdata.append("brand", data.artist); // mapping artist to brand for consistency
    formdata.append("stock", data.stock ?? 1);
    formdata.append("hide", data.hide ? "true" : "false");

    if (data.description) formdata.append("description", data.description);

    if (videoImages.length > 0) {
      videoImages.forEach((image) => {
        formdata.append("image", image);
      });
    }

    if (mediaFiles.length > 0) {
      mediaFiles.forEach((file) => {
        formdata.append("media", file);
      });
    }

    return formdata;
  }

  async function submitForm(data) {
    setLoading(true);

    const input = prepareData(data);

    try {
      if (isEditing) {
        await videoAPI.updateVideo(video._id, input);

        toast.success("Video updated successfully.", { autoClose: 1500 });
        router.push("/Video-management");
        router.refresh();
        return;
      }

      await videoAPI.createVideo(input);

      reset();

      toast.success("Video created successfully.", { autoClose: 1500 });
      router.push("/Video-management");
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to save video.");
    } finally {
      setLoading(false);
      setLocalImageUrls([]);
      setVideoImages([]);
      setMediaFiles([]);
      setMediaFileUrls([]);
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
            Video Title
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 dark:bg-[#160327] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Type video title"
            {...register("title", { required: "Video title is required." })}
          />
          <p className="text-red-500 text-sm m-2">{errors.title?.message}</p>
        </div>
        <div className="w-full">
          <label
            htmlFor="brand"
            className="block mb-2 text-sm font-medium text-black dark:text-white"
          >
            Brand (Studio)
          </label>
          <input
            type="text"
            id="brand"
            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 dark:bg-[#160327] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Studio or creator name"
            {...register("artist", { required: "Creator is required." })}
          />
          <p className="text-red-500 text-sm m-2">{errors.artist?.message}</p>
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
            placeholder="Category (e.g. Entertainment)"
            {...register("category", {
              required: "Category is required.",
            })}
          />
          <p className="text-red-500 text-sm m-2">{errors.category?.message}</p>
        </div>
        <div>
          <label
            htmlFor="subcategory"
            className="block mb-2 text-sm font-medium text-black dark:text-white"
          >
            Video Type
          </label>
          <input
            type="text"
            id="subcategory"
            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 dark:bg-[#160327] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Type (e.g. Movie, Vlog)"
            {...register("subcategory", {
              required: "Video type is required.",
            })}
          />
          <p className="text-red-500 text-sm m-2">
            {errors.subcategory?.message}
          </p>
        </div>
        <div className="sm:col-span-2 flex items-center gap-2 mb-2">
          <input
            id="hide"
            type="checkbox"
            {...register("hide")}
            className="w-4 h-4 text-purple-600 bg-gray-50 rounded border-gray-300 focus:ring-purple-500 dark:bg-[#160327] dark:border-gray-600"
          />
          <label
            htmlFor="hide"
            className="text-sm font-medium text-black dark:text-white cursor-pointer"
          >
            Hide Video (Only play on hover, default behavior)
          </label>
        </div>
        <div>
          <label
            htmlFor="stock"
            className="block mb-2 text-sm font-medium text-black dark:text-white"
          >
            Stock
          </label>
          <input
            type="number"
            id="stock"
            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 dark:bg-[#160327] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder={1}
            {...register("stock")}
          />
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
            placeholder="What's this video about?..."
            {...register("description")}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-2 text-sm font-medium text-black dark:text-white">
            Thumbnail
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
              accept="video/*,.png,.jpg,.jpeg"
              onChange={(event) => {
                const files = [];
                const urls = [];

                Array.from(event.target.files).map((file) => {
                  files.push(file);
                  urls.push(URL.createObjectURL(file));
                });

                setLocalImageUrls(urls);
                setVideoImages(files);
              }}
            />
          </label>
        </div>

        <div className="flex items-center gap-4 mt-2">
          {isEditing && video?.image && (
            <div
              className={`relative group transition-all duration-300 ${localImageUrls.length > 0 ? "opacity-40 scale-90" : "opacity-100"}`}
            >
              <Image
                height={80}
                width={80}
                alt="Current Primary"
                src={video.image}
                className="h-20 w-20 object-cover p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
              />
              <div className="absolute -top-2 -right-2 bg-slate-500 text-[9px] text-white px-2 py-0.5 rounded-full uppercase font-bold shadow-sm">
                Current
              </div>
              {localImageUrls.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                  <p className="text-[10px] text-white font-black bg-green-600 px-2 py-0.5 rounded-md shadow-lg rotate-12">
                    REPLACING
                  </p>
                </div>
              )}
            </div>
          )}

          {localImageUrls.length > 0 && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="h-6 w-1 bg-green-500 rounded-full hidden sm:block" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  {localImageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative group animate-scale-in"
                    >
                      <Image
                        height={80}
                        width={80}
                        alt={`New thumbnail preview ${index + 1}`}
                        src={url}
                        className="h-20 w-20 object-cover p-1 rounded-xl bg-white dark:bg-slate-800 border-2 border-green-500 shadow-md transform group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute -top-2 -right-2 bg-green-600 text-[9px] text-white px-2 py-0.5 rounded-full uppercase font-bold shadow-sm animate-bounce">
                        New
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-green-600 dark:text-green-400 font-bold italic tracking-tight">
                  New thumbnail ready for upload
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-2 text-sm font-medium text-black dark:text-white">
            Video File
          </label>
          <label
            htmlFor="media"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary border-dashed rounded-lg cursor-pointer bg-primary/5 dark:hover:bg-primary/10 hover:bg-primary/10 border-primary shadow-sm"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaPlus className="w-8 h-8 mb-4 text-primary" />
              <p className="mb-2 text-sm text-primary font-bold">
                Click to upload video files
              </p>
              <p className="text-xs text-gray-500">MP4, WEBM, OGG</p>
            </div>
            <input
              id="media"
              type="file"
              className="hidden"
              multiple
              accept="video/*"
              onChange={(event) => {
                const files = [];
                const urls = [];
                Array.from(event.target.files).map((file) => {
                  files.push(file);
                  urls.push(URL.createObjectURL(file));
                });
                setMediaFileUrls(urls);
                setMediaFiles(files);
              }}
            />
          </label>
        </div>

        {(mediaFileUrls.length > 0 || (isEditing && video?.media)) && (
          <div className="sm:col-span-2 flex flex-col gap-2">
            {mediaFileUrls.map((url, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-900/30 animate-fade-in"
              >
                <FaPlus className="text-green-600" />
                <span className="text-xs text-green-700 dark:text-green-300 font-bold tracking-wide uppercase italic">
                  New Source Video Selected
                </span>
              </div>
            ))}
            {isEditing && video?.media && mediaFileUrls.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-800">
                <FaVideo className="text-slate-500" />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest break-all">
                  Active Stream: {video.media.split("/").pop()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <Button
        label={
          isEditing ? "Update & Save Video Studio" : "Confirm & Upload Video"
        }
        loading={loading}
        className="mt-6 px-16 py-4 text-center sm:mt-10 bg-gradient-to-r from-green-600 to-emerald-600 !text-white hover:from-green-700 hover:to-emerald-700 shadow-xl shadow-green-600/25 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95"
      />
    </form>
  );
};

export default VideoForm;
