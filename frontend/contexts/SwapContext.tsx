'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface Swap {
  id: number;
  requester_id: number;
  receiver_id: number;
  requester_listing_id: number;
  receiver_listing_id: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface SwapContextType {
  incomingSwaps: Swap[];
  outgoingSwaps: Swap[];
  isLoading: boolean;
  error: string | null;
  fetchIncomingSwaps: () => Promise<void>;
  fetchOutgoingSwaps: () => Promise<void>;
  sendSwapRequest: (requester_listing_id: number, receiver_listing_id: number, message?: string) => Promise<void>;
  acceptSwap: (swapId: number) => Promise<void>;
  rejectSwap: (swapId: number) => Promise<void>;
  clearError: () => void;
}

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export const SwapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [incomingSwaps, setIncomingSwaps] = useState<Swap[]>([]);
  const [outgoingSwaps, setOutgoingSwaps] = useState<Swap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchIncomingSwaps = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/swaps/incoming`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIncomingSwaps(response.data.data || []);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch incoming swaps';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOutgoingSwaps = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/swaps/outgoing`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOutgoingSwaps(response.data.data || []);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch outgoing swaps';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendSwapRequest = async (requester_listing_id: number, receiver_listing_id: number, message?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_URL}/api/swaps`,
        {
          requester_listing_id,
          receiver_listing_id,
          message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refetch outgoing swaps
      await fetchOutgoingSwaps();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to send swap request';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptSwap = async (swapId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.put(`${API_URL}/api/swaps/${swapId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refetch incoming swaps
      await fetchIncomingSwaps();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to accept swap';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const rejectSwap = async (swapId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.put(`${API_URL}/api/swaps/${swapId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refetch incoming swaps
      await fetchIncomingSwaps();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to reject swap';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <SwapContext.Provider
      value={{
        incomingSwaps,
        outgoingSwaps,
        isLoading,
        error,
        fetchIncomingSwaps,
        fetchOutgoingSwaps,
        sendSwapRequest,
        acceptSwap,
        rejectSwap,
        clearError,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};

export const useSwap = (): SwapContextType => {
  const context = useContext(SwapContext);
  if (!context) {
    throw new Error('useSwap must be used within a SwapProvider');
  }
  return context;
};
