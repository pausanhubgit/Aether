"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import eventsAPI from "@/api/events";
import EventForm from "../../_components/Form";
import BackButton from "@/components/BackButton";
import { toast } from "react-toastify";

const EditEvent = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await eventsAPI.getEventById(id);
        if (response?.data) {
          setEvent(response.data);
        } else {
          toast.error("Event data not found.");
          router.push("/Event-management");
        }
      } catch (error) {
        toast.error("Failed to fetch event details. It may have been deleted.");
        router.push("/Event-management");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d0118]">
        <div className="relative">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full font-bold"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <section className="min-h-screen bg-gray-50/50 dark:bg-[#160327]/50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <BackButton />
        <div className="bg-white dark:bg-[#160327] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
              Refine Your <span className="text-purple-600">Showdown</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium italic">
              Update the guidelines, dates, or rewards of your competition.
            </p>
          </div>
          <EventForm eventData={event} isEditing={true} />
        </div>
      </div>
    </section>
  );
};

export default EditEvent;
