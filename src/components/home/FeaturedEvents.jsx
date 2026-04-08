"use client";
import React, { useEffect, useState } from "react";
import eventsAPI from "@/api/events";
import { format } from "date-fns";
import Link from "next/link";
import { FaCalendarAlt, FaTrophy } from "react-icons/fa";

const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await eventsAPI.getEvents();
        // Only show upcoming or active events
        const activeEvents = (response?.data || []).filter(e => e.status !== "Completed");
        setEvents(activeEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) return null;
  if (!events || events.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-[#0d0118] relative z-10 w-full transition-colors duration-300">
      <div className="container-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-primary text-black dark:text-purple-100 mb-4">
            Upcoming Competitions
          </h2>
          <p className="text-lg text-gray-600 dark:text-purple-300/80 max-w-2xl mx-auto font-secondary">
            Join our latest community events to showcase your talent, win exciting prizes, and connect with other creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((event, index) => (
            <div key={event._id || index} className="bg-white dark:bg-[#160327] rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-purple-900/40 flex flex-col h-full">
              <div className={`h-14 ${
                event.eventType === 'Art' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
                event.eventType === 'Music' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                'bg-gradient-to-r from-green-500 to-teal-500'
              } flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')]"></div>
                <h3 className="text-white font-bold text-lg z-10 drop-shadow-md px-4 text-center truncate w-full">{event.title}</h3>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.eventType === 'Art' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                    event.eventType === 'Music' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {event.eventType} Competition
                  </span>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}>
                    {event.status}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-purple-300/70 text-sm mb-6 line-clamp-3">
                  {event.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {event.prizePool && (
                    <div className="flex items-center text-sm font-medium text-amber-600 dark:text-amber-400">
                      <FaTrophy className="mr-2 h-4 w-4" />
                      <span>Prize: {event.prizePool}</span>
                    </div>
                  )}
                  
                  {(event.startDate || event.endDate) && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-purple-400/60">
                      <FaCalendarAlt className="mr-2 h-4 w-4" />
                      <span>
                        {event.startDate ? format(new Date(event.startDate), "MMM d, yyyy") : "TBA"} 
                        {event.endDate && ` - ${format(new Date(event.endDate), "MMM d, yyyy")}`}
                      </span>
                    </div>
                  )}
                </div>
                
                <Link 
                  href="/events"
                  className="block w-full text-center py-2.5 rounded-lg font-medium !text-white transition-colors duration-300 bg-primary hover:bg-primary/90 focus:ring-4 focus:ring-primary/20"
                >
                  Participate Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
