"use client";
import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  FiPenTool as FaPalette,
  FiMusic as FaMusic,
  FiVideo as FaVideo,
  FiUsers as FaUsers,
  FiHeart as FaHeart,
  FiShare2 as FaShare,
} from "react-icons/fi";

// Metadata must be in a separate layout or removed if this is a client component
// export const metadata = {
//   title: "About",
// };

const About = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-[#0d0118] dark:to-[#160327]">
      <div className="mx-auto max-w-6xl space-y-12 py-12 px-4">
        {/* Hero Section */}
        <header className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full">
              <FaPalette className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Aether Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-purple-200/80 max-w-2xl mx-auto">
            Your ultimate creative playground where imagination meets
            technology. Share, discover, and connect through arts, music, and
            videos.
          </p>
        </header>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-[#160327] border border-transparent dark:border-purple-900/40 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-full w-fit mb-4">
              <FaPalette className="text-purple-600 dark:text-purple-400 text-2xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-purple-100 mb-3">
              Stunning Arts
            </h3>
            <p className="text-gray-600 dark:text-purple-300/70">
              Explore a curated collection of breathtaking artworks from
              talented artists worldwide. From digital art to traditional
              masterpieces.
            </p>
          </div>

          <div className="bg-white dark:bg-[#160327] border border-transparent dark:border-purple-900/40 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full w-fit mb-4">
              <FaMusic className="text-blue-600 dark:text-blue-400 text-2xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-purple-100 mb-3">
              Rhythmic Music
            </h3>
            <p className="text-gray-600 dark:text-purple-300/70">
              Discover new sounds and genres. Upload your tracks, explore
              playlists, and connect with music lovers across the globe.
            </p>
          </div>

          <div className="bg-white dark:bg-[#160327] border border-transparent dark:border-purple-900/40 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full w-fit mb-4">
              <FaVideo className="text-green-600 dark:text-green-400 text-2xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-purple-100 mb-3">
              Cinematic Videos
            </h3>
            <p className="text-gray-600 dark:text-purple-300/70">
              Share your stories through video. From short clips to full
              productions, showcase your creativity in motion.
            </p>
          </div>

          <div className="bg-white dark:bg-[#160327] border border-transparent dark:border-purple-900/40 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-full w-fit mb-4">
              <FaUsers className="text-red-600 dark:text-red-400 text-2xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-purple-100 mb-3">
              Community Driven
            </h3>
            <p className="text-gray-600 dark:text-purple-300/70">
              Join a vibrant community of creators. Collaborate, inspire, and
              grow together in a supportive environment.
            </p>
          </div>

          <div className="bg-white dark:bg-[#160327] border border-transparent dark:border-purple-900/40 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-pink-100 dark:bg-pink-900/40 p-3 rounded-full w-fit mb-4">
              <FaHeart className="text-pink-600 dark:text-pink-400 text-2xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-purple-100 mb-3">
              Interactive Likes
            </h3>
            <p className="text-gray-600 dark:text-purple-300/70">
              Show appreciation for content you love. Track your impact and see
              what resonates with the community.
            </p>
          </div>

          <div className="bg-white dark:bg-[#160327] border border-transparent dark:border-purple-900/40 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-full w-fit mb-4">
              <FaShare className="text-indigo-600 dark:text-indigo-400 text-2xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-purple-100 mb-3">
              Easy Sharing
            </h3>
            <p className="text-gray-600 dark:text-purple-300/70">
              Share your favorite discoveries with friends. Spread creativity
              and build connections through shared experiences.
            </p>
          </div>
        </section>

        {/* What You Can Do Section */}
        <section className="bg-white dark:bg-[#160327] dark:border dark:border-purple-900/40 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-purple-100 mb-6 text-center">
            What You Can Do
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-lg">
                  <FaPalette className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-purple-100">
                    Upload & Share Content
                  </h4>
                  <p className="text-gray-600 dark:text-purple-300/70 text-sm">
                    Easily upload your arts, music, and videos to share with the
                    community.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">
                  <FaMusic className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-purple-100">
                    Discover by Genre
                  </h4>
                  <p className="text-gray-600 dark:text-purple-300/70 text-sm">
                    Browse content by categories and genres to find exactly what
                    you&apos;re looking for.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-lg">
                  <FaVideo className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-purple-100">
                    Personal Dashboard
                  </h4>
                  <p className="text-gray-600 dark:text-purple-300/70 text-sm">
                    Track your uploads, likes, and engagement through your
                    personal dashboard.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-lg">
                  <FaUsers className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-purple-100">
                    Connect with Creators
                  </h4>
                  <p className="text-gray-600 dark:text-purple-300/70 text-sm">
                    Follow your favorite artists and collaborate on amazing
                    projects.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-pink-100 dark:bg-pink-900/40 p-2 rounded-lg">
                  <FaHeart className="text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-purple-100">
                    Interactive Engagement
                  </h4>
                  <p className="text-gray-600 dark:text-purple-300/70 text-sm">
                    Like, comment, and share content to show your appreciation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
                  <FaShare className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-purple-100">
                    Monetize Your Art
                  </h4>
                  <p className="text-gray-600 dark:text-purple-300/70 text-sm">
                    Sell your digital creations and earn from your passion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        {!isAuthenticated && (
          <section className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-semibold mb-4">
              Ready to Start Creating?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of creators sharing their passion on Aether Hub
            </p>
            <Link
              href="/login"
              className="inline-block bg-white dark:bg-[#160327] text-purple-600 dark:text-purple-300 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-[#2d0a4e] transition-colors duration-300"
            >
              Get Started Today
            </Link>
          </section>
        )}
      </div>
    </div>
  );
};

export default About;
