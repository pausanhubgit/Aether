"use client";

import Image from "next/image";
import bg from "@/assets/images/Background/butterfly.jpg";
import { useState } from "react";
import { toast } from "react-toastify";
import contactApi from "@/api/contact";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
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
      toast.error(error?.response?.data?.error || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="py-16 relative">
      <Image
        src={bg}
        alt="Aether Hub Artistic Brand Background"
        className="w-full h-full object-cover absolute top-0 -z-20"
        height={900}
        width={1200}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-slate-900/60 dark:bg-[#0d0118]/80 -z-10" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-6xl font-semibold text-white uppercase tracking-[0.25rem] mb-4">
              Dress to Impress
            </h2>
            <p className="text-gray-300">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatum ipsum adipisci dolore vitae commodi, officiis rerum
              mollitia quas sint? Excepturi corporis voluptas atque hic suscipit
              dignissimos eos at in beatae.
            </p>
          </div>
          <div className="bg-white dark:bg-[#160327] dark:text-purple-100 rounded-2xl px-8 py-10 lg:w-3/4 shadow-md shadow-gray-600 mx-auto">
            <h3 className="text-3xl font-bold text-center mb-4">
              Contact form
            </h3>
            <form onSubmit={handleSubmit}>
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