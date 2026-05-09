"use client";

import Image from "next/image";
import bg from "@/assets/images/Background/butterfly.jpg";
import { useState } from "react";
import { toast } from "react-toastify";
import contactApi from "@/api/contact";
import logoImg from "@/assets/images/home/logo.png";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactApi.submitContact(formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="py-16 relative overflow-hidden">
      <style>{`
        @keyframes float-logo {
          0%, 100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 5px rgba(147, 51, 234, 0.2)); }
          50% { transform: translateY(-10px) scale(1.02); filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.6)); }
        }
        .live-logo-effect {
          animation: float-logo 4s ease-in-out infinite;
        }
      `}</style>
      <Image
        src={bg}
        alt="Aether Hub Artistic Brand Background"
        className="object-cover -z-20"
        fill
      />
      <div className="absolute top-0 left-0 w-full h-full bg-white/80 dark:bg-[#0d0118]/80 -z-10" />
      <div className="container-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex flex-col justify-center">
            <div className="mb-8 w-full">
              <div className="bg-white/80 dark:bg-[#160327]/60 w-full p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-purple-500/30 backdrop-blur-md mb-4 flex justify-center hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-shadow duration-500 cursor-pointer group">
                <Image
                  src={logoImg}
                  alt="Aether Hub Logo"
                  width={800}
                  height={200}
                  className="w-full h-auto object-contain live-logo-effect transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2 dark:invert dark:brightness-200 dark:contrast-100"
                />
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-semibold text-slate-900 dark:text-white uppercase tracking-[0.25rem] mb-4">
              Dress to Impress
            </h2>
            <p className="text-slate-700 dark:text-gray-300 md:text-lg">
              Explore Aether Art Hub's spectacular curated collections to
              discover unique, breathtaking pieces that express your true
              artistic aesthetic. Elevate your surroundings today with
              authentic, vibrant masterworks crafted by visionary artists
              worldwide.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 text-slate-800 dark:text-white">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700 dark:text-purple-400">
                    Location
                  </h4>
                  <p className="text-slate-600 dark:text-gray-300">
                    Dharan, Nepal
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-800 dark:text-white">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700 dark:text-purple-400">
                    Phone
                  </h4>
                  <p className="text-slate-600 dark:text-gray-300">980000001</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#160327] dark:text-purple-100 rounded-2xl px-6 sm:px-8 py-10 w-full lg:w-4/5 shadow-md shadow-gray-600 mx-auto">
            <h3 className="text-3xl font-bold text-center mb-6">Contact us</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="pb-2">
                <label htmlFor="name">Full name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="w-full py-2 px-3 rounded-md border-2 border-zinc-300 focus:outline-none focus:ring-2 focus:ring-secondary mt-1 text-black dark:text-white dark:bg-[#0d0118]"
                />
              </div>
              <div className="pb-2">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
                  className="w-full py-2 px-3 rounded-md border-2 border-zinc-300 focus:outline-none focus:ring-2 focus:ring-secondary mt-1 text-black dark:text-white dark:bg-[#0d0118]"
                />
              </div>
              <div className="pb-2">
                <label htmlFor="phone">Phone number</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  required
                  className="w-full py-2 px-3 rounded-md border-2 border-zinc-300 focus:outline-none focus:ring-2 focus:ring-secondary mt-1 text-black dark:text-white dark:bg-[#0d0118]"
                />
              </div>
              <div className="pb-2">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  className="w-full py-2 px-3 rounded-md border-2 border-zinc-300 focus:outline-none focus:ring-2 focus:ring-secondary mt-1 text-black dark:text-white dark:bg-[#0d0118]"
                />
              </div>
              <div className="pb-2">
                <label htmlFor="message">Message</label>
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 rounded-md border-2 border-zinc-300 focus:outline-none focus:ring-2 focus:ring-secondary mt-1 text-black dark:text-white dark:bg-[#0d0118]"
                  rows="4"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-lg shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
