'use client';

import { Listing } from '@/contexts/ListingContext';
import { MapPin, Shirt } from 'lucide-react';
import { useState } from 'react';

interface ListingCardProps {
  listing: Listing;
  onSwapClick: (requester_listing_id: number, receiver_listing_id: number, message?: string) => Promise<void>;
}

export default function ListingCard({ listing, onSwapClick }: ListingCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);

  const handleSwapClick = (receiverListingId: number) => {
    setSelectedListing(receiverListingId);
    setShowModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
        <div className="bg-gradient-to-br from-indigo-500 to-pink-500 h-32 flex items-center justify-center">
          <Shirt size={48} className="text-white" />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{listing.title}</h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Shirt size={16} />
              <span className="capitalize">
                {listing.clothing_type.replace('_', ' ')} • Size {listing.size}
              </span>
            </div>

            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {listing.condition_status.replace('_', ' ')}
              </span>
              {listing.brand && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  {listing.brand}
                </span>
              )}
            </div>

            {listing.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span className="text-sm">{listing.location}</span>
              </div>
            )}

            {listing.estimated_value && (
              <div className="text-lg font-semibold text-green-600">
                ${listing.estimated_value.toFixed(2)}
              </div>
            )}
          </div>

          {listing.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
          )}

          <button
            onClick={() => handleSwapClick(listing.id)}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Initiate Swap
          </button>
        </div>
      </div>

      {showModal && (
        <SwapModal
          listing={listing}
          onClose={() => setShowModal(false)}
          onConfirm={(message) => {
            if (selectedListing) {
              onSwapClick(selectedListing, listing.id, message);
              setShowModal(false);
            }
          }}
        />
      )}
    </>
  );
}

function SwapModal({
  listing,
  onClose,
  onConfirm,
}: {
  listing: Listing;
  onClose: () => void;
  onConfirm: (message: string) => void;
}) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(message);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Initiate Swap</h2>
        <p className="text-gray-600 mb-4">
          Send a swap request for <strong>{listing.title}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message (optional)"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
