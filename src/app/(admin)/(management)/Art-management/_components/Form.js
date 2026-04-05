"use client";

import artsAPI from "@/api/arts";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Button from "@/components/Button";
import Image from "next/image";

const ArtForm = ({ art, isEditing = false }) => {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
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
    
    if (data.description) formdata.append("description", data.description);
    if (data.stock !== undefined) formdata.append("stock", Number(data.stock));
    
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
        router.push("/Art-management");
        router.refresh();
        return;
      }

      await artsAPI.createArts(input);
      reset();
      toast.success("Art created successfully.", { autoClose: 1500 });
      router.push("/Art-management");
      router.refresh();
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
        <div>
          <label
            htmlFor="stock"
            className="block mb-2 text-sm font-medium text-black dark:text-white"
          >
            Available Stock
          </label>
          <input
            type="number"
            id="stock"
            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 dark:bg-[#160327] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Quantity (e.g. 10)"
            {...register("stock", {
              required: "Stock quantity is required.",
              valueAsNumber: true,
              min: { value: 0, message: "Stock cannot be negative." }
            })}
          />
          <p className="text-red-500 text-sm m-2">{errors.stock?.message}</p>
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

        <div className="flex items-center gap-4 mt-2">
          {isEditing && art?.image && (
            <div className={`relative group transition-all duration-300 ${localImageUrls.length > 0 ? 'opacity-40 scale-90' : 'opacity-100'}`}>
              <Image
                height={80}
                width={80}
                alt="Current Art"
                src={art.image}
                className="h-20 w-20 object-cover p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
              />
              <div className="absolute -top-2 -right-2 bg-slate-500 text-[9px] text-white px-2 py-0.5 rounded-full uppercase font-bold shadow-sm">
                Current
              </div>
              {localImageUrls.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                   <p className="text-[10px] text-white font-black bg-purple-600 px-2 py-0.5 rounded-md shadow-lg rotate-12">REPLACING</p>
                </div>
              )}
            </div>
          )}

          {localImageUrls.length > 0 && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="h-6 w-1 bg-purple-500 rounded-full hidden sm:block" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  {localImageUrls.map((url, index) => (
                    <div key={index} className="relative group animate-scale-in">
                      <Image
                        height={80}
                        width={80}
                        alt=""
                        src={url}
                        className="h-20 w-20 object-cover p-1 rounded-xl bg-white dark:bg-slate-800 border-2 border-purple-500 shadow-md transform group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute -top-2 -right-2 bg-purple-600 text-[9px] text-white px-2 py-0.5 rounded-full uppercase font-bold shadow-sm animate-bounce">
                        New
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold italic tracking-tight">
                  {localImageUrls.length} new selection(s) ready for upload
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Button
        label={isEditing ? "Update & Save Art Piece" : "Confirm & Upload Art"}
        loading={loading}
        className="mt-6 px-16 py-4 text-center sm:mt-10 bg-gradient-to-r from-purple-600 to-indigo-600 !text-white hover:from-purple-700 hover:to-indigo-700 shadow-xl shadow-purple-600/25 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95"
      />
    </form>
  );
};

export default ArtForm;