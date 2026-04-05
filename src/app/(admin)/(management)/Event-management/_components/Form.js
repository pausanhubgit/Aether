"use client";

import eventsAPI from "@/api/events";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { FaCalendarAlt, FaTrophy, FaLayerGroup } from "react-icons/fa";

const EventForm = ({ eventData, isEditing = false }) => {
  const [loading, setLoading] = useState(false);
  const [eventImage, setEventImage] = useState(null);
  const [localImageUrl, setLocalImageUrl] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    values: eventData,
  });

  function prepareData(data) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("eventType", data.eventType);
    formData.append("prizePool", data.prizePool);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("status", data.status || 'Active');

    if (eventImage) {
      formData.append("image", eventImage);
    }

    return formData;
  }

  async function submitForm(data) {
    setLoading(true);
    const input = prepareData(data);

    try {
      if (isEditing) {
        await eventsAPI.updateEvent(eventData._id, input);
        toast.success("Event updated successfully.", { autoClose: 1500 });
        return;
      }

      await eventsAPI.createEvent(input);
      reset();
      toast.success("Event launched successfully.", { autoClose: 1500 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed", { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-4 bg-gray-50 dark:bg-[#0d0118] border border-gray-200 dark:border-purple-900/40 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white"
            placeholder="e.g. Masterpiece Showdown 2024"
            {...register("title", { required: "Title is required." })}
          />
          {errors.title && <p className="text-red-500 text-xs mt-2 ml-2 font-bold">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="eventType" className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            Discipline
          </label>
          <select
            id="eventType"
            className="w-full p-4 bg-gray-50 dark:bg-[#0d0118] border border-gray-200 dark:border-purple-900/40 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white"
            {...register("eventType", { required: "Discipline is required." })}
          >
            <option value="Art">Visual Arts</option>
            <option value="Music">Musical Tracks</option>
            <option value="Video">Video Production</option>
          </select>
        </div>

        <div>
          <label htmlFor="prizePool" className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            Prize Pool
          </label>
          <input
            type="text"
            id="prizePool"
            className="w-full p-4 bg-gray-50 dark:bg-[#0d0118] border border-gray-200 dark:border-purple-900/40 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white"
            placeholder="e.g. $10,000 + Spotlight"
            {...register("prizePool", { required: "Prize pool is required." })}
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            className="w-full p-4 bg-gray-50 dark:bg-[#0d0118] border border-gray-200 dark:border-purple-900/40 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white"
            {...register("startDate", { required: "Start date is required." })}
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            className="w-full p-4 bg-gray-50 dark:bg-[#0d0118] border border-gray-200 dark:border-purple-900/40 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white"
            {...register("endDate", { required: "End date is required." })}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            Guidelines & Description
          </label>
          <textarea
            id="description"
            rows={6}
            className="w-full p-4 bg-gray-50 dark:bg-[#0d0118] border border-gray-200 dark:border-purple-900/40 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none transition-all dark:text-white resize-none"
            placeholder="Define the rules and spirit of your competition..."
            {...register("description", { required: "Description is required." })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            Showdown Cover Image
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-72 border-2 border-gray-300 border-dashed rounded-[2.5rem] cursor-pointer bg-gray-50 dark:bg-[#0d0118] hover:bg-gray-100 dark:border-purple-900/40 dark:hover:border-purple-500/50 transition-all overflow-hidden relative group"
            >
              {localImageUrl || (isEditing && eventData?.image) ? (
                <div className="absolute inset-0 w-full h-full p-2">
                   <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-inner">
                    <img 
                      src={localImageUrl || eventData?.image} 
                      alt="Preview" 
                      className={`w-full h-full object-cover transition-all duration-500 ${localImageUrl ? 'scale-105 brightness-110' : 'opacity-70 group-hover:opacity-50'}`} 
                    />
                    
                    {/* Replacing Overlay */}
                    {localImageUrl && isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-purple-600/20 backdrop-blur-[2px]">
                         <div className="bg-purple-600 text-white px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-tighter shadow-xl rotate-3 animate-pulse">
                           Replacing Original Cover
                         </div>
                      </div>
                    )}

                    {!localImageUrl && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg mb-2">
                            <FaLayerGroup className="text-2xl text-white" />
                        </div>
                        <p className="text-white font-black text-xs uppercase tracking-widest shadow-sm">Change Event Image</p>
                      </div>
                    )}

                    {localImageUrl && (
                       <div className="absolute top-4 right-4 bg-purple-600 text-[10px] text-white px-3 py-1 rounded-full uppercase font-black shadow-lg animate-bounce">
                          New Selection
                       </div>
                    )}
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-[1.5rem] flex items-center justify-center mb-4 border border-purple-200 dark:border-purple-800/40 shadow-sm">
                    <FaLayerGroup className="text-3xl text-purple-600" />
                  </div>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-black text-purple-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Premium Showdown Banner (PNG, JPG)</p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setEventImage(file);
                    setLocalImageUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <Button
        label={isEditing ? "Update & Save Showdown" : "Launch Premium Showdown"}
        loading={loading}
        className="mt-10 w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 !text-white font-black uppercase tracking-[0.2em] text-xs rounded-[2rem] shadow-2xl shadow-purple-600/30 hover:scale-[1.02] active:scale-95 transform transition-all"
      />
    </form>
  );
};

export default EventForm;