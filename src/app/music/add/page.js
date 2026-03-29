"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUpload, FaArrowLeft, FaMusic } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { addFeedItem } from '@/lib/storage';

const AddMusic = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    artist: '',
    audio: null
  });
  const [audioPreview, setAudioPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const genres = [
    "Pop", "Rock", "Hip Hop", "Electronic", "Jazz",
    "Classical", "Ambient", "Techno", "Country", "R&B"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        audio: file
      }));
      const audioUrl = URL.createObjectURL(file);
      setAudioPreview(audioUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.genre || !formData.artist || !formData.audio) {
      toast.error("Please fill in all required fields and upload an audio file", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('artist', formData.artist);
      data.append('category', 'Music'); // Required by MusicModel
      data.append('subcategory', formData.genre); // Used as genre
      data.append('audio', formData.audio);

      const response = await musicApi.createMusic(data);

      toast.success('Music added successfully! Redirecting...', {
        position: "top-right",
        autoClose: 2000,
      });
      
      setTimeout(() => {
        router.push('/music');
      }, 1500);
    } catch (error) {
      console.error('Error adding music:', error);
      toast.error(error.response?.data?.error || 'Error adding music. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Link href="/music" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
          <FaArrowLeft size={16} />
          Back to Music
        </Link>
        <h1 className="text-3xl font-semibold text-gray-800">Add New Music</h1>
        <p className="text-gray-600 mt-2">Share your music with the community</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Song Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter song title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist *
              </label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Artist name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre *
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Describe your music"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audio File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {audioPreview ? (
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <FaMusic className="text-purple-600 text-3xl mx-auto mb-2" />
                    {formData.audio?.type?.startsWith('video/') ? (
                      <video controls src={audioPreview} className="w-full max-h-48 object-cover rounded-md" />
                    ) : (
                      <audio controls src={audioPreview} className="w-full" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAudioPreview(null);
                      setFormData(prev => ({ ...prev, audio: null }));
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove Audio
                  </button>
                </div>
              ) : (
                <div>
                  <FaUpload className="mx-auto text-gray-400 text-3xl mb-2" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">MP3, WAV, FLAC, MP4 up to 50MB</p>
                  <input
                    type="file"
                    accept="audio/*,video/mp4"
                    onChange={handleAudioChange}
                    className="hidden"
                    id="audio-upload"
                    required
                  />
                  <label
                    htmlFor="audio-upload"
                    className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Music...' : 'Add Music'}
            </button>
            <Link
              href="/music"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMusic;