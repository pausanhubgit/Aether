"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaUpload, FaTimes } from 'react-icons/fa';
import { createArt, fetchArts } from '@/lib/slices/artsSlice';
import { ToastContainer, toast } from 'react-toastify';

function ArtDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { arts, categories, loading } = useSelector(state => state.arts);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  useEffect(() => {
    if (!user || !['MERCHANT', 'ADMIN'].includes(user.role)) {
      router.push('/');
    }
    dispatch(fetchArts({}));
  }, [user, dispatch, router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file,
      }));
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.category || !formData.image) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', Number(formData.price));
      data.append('category', formData.category);
      data.append('image', formData.image);
      data.append('merchantId', user.id);

      dispatch(createArt(data));
      toast.success('Art created successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        image: null,
      });
      setImagePreview(null);
      setShowForm(false);
    } catch (error) {
      toast.error(error.message || 'Failed to create art');
    }
  };

  const myArts = (arts || []).filter(art => art.merchantId === user?.id);

  return (
    <div className="py-10 px-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Arts Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
        >
          {showForm ? 'Cancel' : '+ Create Art'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#160327] rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Create New Art</h2>

          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Art Title *"
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
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white mb-4"
            >
              <option value="">Select Category *</option>
              {categories && categories.map(cat => (
                <option key={cat.id} value={cat.id || cat}>
                  {typeof cat === 'string' ? cat : cat.name}
                </option>
              ))}
            </select>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#160327] dark:text-white mb-4"
            />

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-800 dark:text-white">
                Upload Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  required
                  className="hidden"
                  id="imageInput"
                />
                <label htmlFor="imageInput" className="cursor-pointer">
                  {imagePreview ? (
                    <div>
                      <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto mb-4 rounded" />
                      <p className="text-gray-600 dark:text-gray-400">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
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
              {loading ? 'Creating...' : 'Create Art'}
            </button>
          </form>
        </div>
      )}

      {/* Arts List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Your Arts ({myArts.length})
        </h2>

        {myArts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#160327] rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No arts created yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myArts.map(art => (
              <div key={art.id} className="bg-white dark:bg-[#160327] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {art.image && (
                  <img src={art.image} alt={art.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    {art.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {art.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold text-lg">Rs. {art.price}</span>
                    <span className="text-sm bg-gray-100 dark:bg-[#160327] text-gray-800 dark:text-white px-3 py-1 rounded">
                      {art.category}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
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

export default ArtDashboard;
