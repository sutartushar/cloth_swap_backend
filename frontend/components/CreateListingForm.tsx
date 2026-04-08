'use client';

import { useState } from 'react';
import { useListing } from '@/contexts/ListingContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CLOTHING_TYPES = ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'activewear', 'formal'];
const CONDITIONS = ['new_with_tags', 'like_new', 'good', 'fair', 'worn'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export default function CreateListingForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clothing_type: '',
    brand: '',
    size: '',
    condition_status: '',
    estimated_value: '',
    location: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);
  const { createListing } = useListing();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    try {
      const submitData = {
        title: formData.title,
        description: formData.description || null,
        clothing_type: formData.clothing_type,
        brand: formData.brand || null,
        size: formData.size,
        condition_status: formData.condition_status,
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : null,
        location: formData.location || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      await createListing(submitData as any);
      setSuccess(true);
      setTimeout(() => {
        router.push('/listings');
      }, 1500);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Success!</h2>
          <p className="text-green-700">Your listing has been created. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/listings" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6">
          <ArrowLeft size={20} />
          Back to Listings
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Create New Listing</h1>

          {localError && <div className="error-message mb-6">{localError}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Blue Denim Jacket"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Clothing Type *</label>
                <select
                  name="clothing_type"
                  value={formData.clothing_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select type</option>
                  {CLOTHING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Size *</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select size</option>
                  {SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Condition *</label>
                <select
                  name="condition_status"
                  value={formData.condition_status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select condition</option>
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond.charAt(0).toUpperCase() + cond.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Levi&apos;s"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Estimated Value ($)</label>
                <input
                  type="number"
                  name="estimated_value"
                  value={formData.estimated_value}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe the item condition, fit, and any defects"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="0.0001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.0000"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="0.0001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.0000"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
