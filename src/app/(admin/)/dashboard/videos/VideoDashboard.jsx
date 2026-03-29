"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaUpload, FaVideo } from 'react-icons/fa';
import { createVideo, fetchVideo } from '@/lib/slices/videoSlice';
import { ToastContainer, toast } from 'react-toastify';

function VideoDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { videos, genres, loading } = useSelector(state => state.video);
  const [showForm, setShowForm] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    genre: '',
    thumbnail: null,
    videoFile: null,
  });

  useEffect(() => {
    if (!user || !['MERCHANT', 'ADMIN'].includes(user.role)) {
      router.push('/');
    }
    dispatch(fetchVideo({}));
  }, [user, dispatch, router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if ((name === 'videoFile' || name === 'thumbnail') && files) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file,
      }));
      if (name === 'videoFile') {
        setVideoPreview(file.name);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.genre || !formData.videoFile) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', Number(formData.price));
      data.append('genre', formData.genre);
      data.append('videoFile', formData.videoFile);
      if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail);
      }
      data.append('merchantId', user.id);

      dispatch(createVideo(data));
      toast.success('Video created successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        genre: '',
        thumbnail: null,
        videoFile: null,
      });
      setVideoPreview(null);
      setShowForm(false);
    } catch (error) {
      toast.error(error.message || 'Failed to create video');
    }
  };

  const myVideos = (videos || []).filter(v => v.merchantId === user?.id);

  return (
    <div className="py-10 px-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <FaVideo /> Videos Dashboard
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
        >
          {showForm ? 'Cancel' : '+ Upload Video'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#160327] rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Upload New Video</h2>

          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Video Title *"
                required
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price (Rs.) *"
                required
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
              />
            </div>

            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white mb-4"
            >
              <option value="">Select Genre *</option>
              <option value="tutorial">Tutorial</option>
              <option value="entertainment">Entertainment</option>
              <option value="education">Education</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white mb-4"
            />

            {/* Video File Upload */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-800 dark:text-white">
                Upload Video File *
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  name="videoFile"
                  onChange={handleChange}
                  accept="video/*"
                  required
                  className="hidden"
                  id="videoInput"
                />
                <label htmlFor="videoInput" className="cursor-pointer">
                  {videoPreview ? (
                    <div>
                      <FaVideo className="text-4xl text-primary mx-auto mb-2" />
                      <p className="font-semibold text-gray-800 dark:text-white">{videoPreview}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500 mt-2">Supported formats: MP4, AVI, MOV</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-800 dark:text-white">
                Upload Thumbnail
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                  id="thumbnailInput"
                />
                <label htmlFor="thumbnailInput" className="cursor-pointer">
                  <div>
                    <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Click to upload thumbnail</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition font-semibold"
            >
              {loading ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>
        </div>
      )}

      {/* Videos List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Your Videos ({myVideos.length})
        </h2>

        {myVideos.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#160327] rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No videos uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myVideos.map(video => (
              <div key={video.id} className="bg-white dark:bg-[#160327] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="relative w-full h-48 bg-gray-200 dark:bg-[#160327] flex items-center justify-center">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <FaVideo className="text-5xl text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <FaVideo className="text-3xl text-white" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {video.description}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-primary font-bold text-lg">Rs. {video.price}</span>
                    <span className="text-sm bg-gray-100 dark:bg-[#160327] text-gray-800 dark:text-white px-3 py-1 rounded">
                      {video.genre}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                      Edit
                    </button>
                    <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoDashboard;
