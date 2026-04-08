'use client';

import { useEffect, useState } from 'react';
import { useListing } from '@/contexts/ListingContext';
import { useSwap } from '@/contexts/SwapContext';
import ListingCard from './ListingCard';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

export default function ListingsPage() {
  const { listings, isLoading, error, fetchListings } = useListing();
  const { sendSwapRequest } = useSwap();
  const [filters, setFilters] = useState({
    clothing_type: '',
    size: '',
    condition_status: '',
    location: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings(filters);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    fetchListings(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      clothing_type: '',
      size: '',
      condition_status: '',
      location: '',
      search: '',
    });
    fetchListings({});
  };

  if (isLoading && listings.length === 0) {
    return (
      <div className="container py-12">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Browse Listings</h1>
        <Link
          href="/create-listing"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={20} />
          New Listing
        </Link>
      </div>

      {error && <div className="error-message mb-6">{error}</div>}

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-indigo-600 font-semibold mb-4"
        >
          <Search size={20} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              name="search"
              placeholder="Search..."
              value={filters.search}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              name="clothing_type"
              value={filters.clothing_type}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="dresses">Dresses</option>
              <option value="outerwear">Outerwear</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>
            <select
              name="size"
              value={filters.size}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Sizes</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
            <select
              name="condition_status"
              value={filters.condition_status}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Conditions</option>
              <option value="new_with_tags">New</option>
              <option value="like_new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {showFilters && (
          <div className="flex gap-4">
            <button
              onClick={applyFilters}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No listings found</p>
          <Link
            href="/create-listing"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Create the first one
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onSwapClick={sendSwapRequest} />
          ))}
        </div>
      )}
    </div>
  );
}
