'use client';

import { Swap } from '@/contexts/SwapContext';
import { useSwap } from '@/contexts/SwapContext';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface SwapRequestCardProps {
  swap: Swap;
  type: 'incoming' | 'outgoing';
  onChatClick: () => void;
}

export default function SwapRequestCard({ swap, type, onChatClick }: SwapRequestCardProps) {
  const { acceptSwap, rejectSwap, isLoading } = useSwap();
  const [actionLoading, setActionLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await acceptSwap(swap.id);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await rejectSwap(swap.id);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {type === 'incoming' ? 'Incoming Request' : 'Outgoing Request'}
          </h3>
          <p className="text-gray-600 text-sm">
            ID: {swap.id} • Listing IDs: {swap.requester_listing_id} ↔ {swap.receiver_listing_id}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(swap.status)}`}>
          {swap.status}
        </span>
      </div>

      {swap.message && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Message: </span>
            {swap.message}
          </p>
        </div>
      )}

      <div className="text-sm text-gray-600 mb-4">
        <p>Created: {new Date(swap.created_at).toLocaleDateString()}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onChatClick}
          className="flex items-center gap-2 flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          disabled={actionLoading || isLoading}
        >
          <MessageCircle size={18} />
          Chat
        </button>

        {type === 'incoming' && swap.status === 'pending' && (
          <>
            <button
              onClick={handleAccept}
              className="flex items-center gap-2 flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
              disabled={actionLoading || isLoading}
            >
              <CheckCircle size={18} />
              Accept
            </button>
            <button
              onClick={handleReject}
              className="flex items-center gap-2 flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
              disabled={actionLoading || isLoading}
            >
              <XCircle size={18} />
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}
