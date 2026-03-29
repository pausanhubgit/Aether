"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaUpload, FaMusic } from 'react-icons/fa';
import { createMusic, fetchMusic } from '@/lib/slices/musicSlice';
import { ToastContainer, toast } from 'react-toastify';

function MusicDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { music, genres, loading } = useSelector(state => state.music);
  const [showForm, setShowForm] = useState(false);
  const [audioPreview, setAudioPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    genre: '',
    artist: '',
    audioFile: null,
  });

  useEffect(() => {
    if (!user || !['MERCHANT', 'ADMIN'].includes(user.role)) {
      router.push('/');
    }
    dispatch(fetchMusic({}));
  }, [user, dispatch, router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'audioFile' && files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0],
      }));
      setAudioPreview(files[0].name);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.genre || !formData.audioFile) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', Number(formData.price));
      data.append('genre', formData.genre);
      data.append('artist', formData.artist || user.firstName);
      data.append('audioFile', formData.audioFile);
      data.append('merchantId', user.id);

      dispatch(createMusic(data));
      toast.success('Music created successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        genre: '',
        artist: '',
        audioFile: null,
      });
      setAudioPreview(null);
      setShowForm(false);
    } catch (error) {
      toast.error(error.message || 'Failed to create music');
    }
  };

  const myMusic = (music || []).filter(m => m.merchantId === user?.id);

  return (
    <div className="py-10 px-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <FaMusic /> Music Dashboard
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
        >
          {showForm ? 'Cancel' : '+ Upload Music'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#160327] rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Upload New Music</h2>

          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Music Title *"
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

            <div className="grid grid-cols-2 gap-4 mb-4">
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
              >
                <option value="">Select Genre *</option>
                <option value="rock">Rock</option>
                <option value="pop">Pop</option>
                <option value="hiphop">Hip Hop</option>
                <option value="folk">Folk</option>
                <option value="classical">Classical</option>
                <option value="jazz">Jazz</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                placeholder="Artist Name"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white"
              />
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white mb-4"
            />

            {/* Audio File Upload */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-800 dark:text-white">
                Upload Audio File *
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  name="audioFile"
                  onChange={handleChange}
                  accept="audio/*"
                  required
                  className="hidden"
                  id="audioInput"
                />
                <label htmlFor="audioInput" className="cursor-pointer">
                  {audioPreview ? (
                    <div>
                      <FaMusic className="text-4xl text-primary mx-auto mb-2" />
                      <p className="font-semibold text-gray-800 dark:text-white">{audioPreview}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500 mt-2">Supported formats: MP3, WAV, FLAC</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition font-semibold"
            >
              {loading ? 'Uploading...' : 'Upload Music'}
            </button>
          </form>
        </div>
      )}

      {/* Music List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Your Music ({myMusic.length})
        </h2>

        {myMusic.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#160327] rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No music uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myMusic.map(track => (
              <div key={track.id} className="bg-white dark:bg-[#160327] rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                    <FaMusic className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {track.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      By {track.artist || user.firstName}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {track.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-primary font-bold text-lg">Rs. {track.price}</span>
                  <span className="text-sm bg-gray-100 dark:bg-[#160327] text-gray-800 dark:text-white px-3 py-1 rounded">
                    {track.genre}
                  </span>
                </div>

                {track.audioUrl && (
                  <audio controls className="w-full mb-4 h-8">
                    <source src={track.audioUrl} type="audio/mpeg" />
                  </audio>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    Edit
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicDashboard;
