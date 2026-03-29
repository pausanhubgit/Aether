"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiMapPin as FaMapMarkerAlt, FiPhone as FaPhone, FiMail as FaEnvelope, FiClock as FaClock, FiSend as FaPaperPlane } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#0d0118] overflow-hidden">
      <div className="container-responsive relative z-10 py-24">
        {/* Header */}
        <div className="flex flex-col mb-20 space-y-4">
          <div className="inline-flex items-center w-fit gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-semibold uppercase tracking-[0.2em]">
             <FaEnvelope /> <span>Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-slate-800 dark:text-white leading-[1.1]">
            Contact <span className="text-primary italic">Aether</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
            Have questions or feedback? We'd love to hear from you. Reach out to the Aether Hub team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-purple-100 mb-6">Get in Touch</h2>
              <p className="text-gray-600 dark:text-purple-300/70 mb-8">
                We're here to help and answer any question you might have. We look forward to hearing from you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-lg">
                  <FaMapMarkerAlt className="text-purple-600 dark:text-purple-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-purple-100">Address</h3>
                  <p className="text-gray-600 dark:text-purple-300/70">Kathmandu, Nepal</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg">
                  <FaPhone className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-purple-100">Phone</h3>
                  <p className="text-gray-600 dark:text-purple-300/70">+977 123 456 7890</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-lg">
                  <FaEnvelope className="text-green-600 dark:text-green-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-purple-100">Email</h3>
                  <p className="text-gray-600 dark:text-purple-300/70">contact@aetherhub.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 dark:bg-orange-900/40 p-3 rounded-lg">
                  <FaClock className="text-orange-600 dark:text-orange-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-purple-100">Business Hours</h3>
                  <p className="text-gray-600 dark:text-purple-300/70">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600 dark:text-purple-300/70">Sat - Sun: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-[#160327] border border-transparent dark:border-purple-900/40 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-purple-100 mb-6">Send us a Message</h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                  <FaPaperPlane className="inline mr-2" />
                  Thank you for your message! We'll get back to you soon.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-purple-900/40 dark:bg-[#0d0118] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-purple-900/40 dark:bg-[#0d0118] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-purple-900/40 dark:bg-[#0d0118] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-purple-900/40 dark:bg-[#0d0118] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
