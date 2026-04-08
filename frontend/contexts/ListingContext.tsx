'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface Listing {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  clothing_type: string;
  brand?: string;
  size: string;
  condition_status: string;
  estimated_value?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ListingContextType {
  listings: Listing[];
  isLoading: boolean;
  error: string | null;
  fetchListings: (filters?: any) => Promise<void>;
  createListing: (listing: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'status'>) => Promise<void>;
  clearError: () => void;
}

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchListings = async (filters?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.keys(filters).forEach((key) => {
          if (filters[key]) {
            params.append(key, filters[key]);
          }
        });
      }

      const response = await axios.get(`${API_URL}/api/listings?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setListings(response.data.data || []);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch listings';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const createListing = async (listing: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'status'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/listings`, listing, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // Refetch listings after creating
      await fetchListings();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create listing';
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
    <ListingContext.Provider value={{ listings, isLoading, error, fetchListings, createListing, clearError }}>
      {children}
    </ListingContext.Provider>
  );
};

export const useListing = (): ListingContextType => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListing must be used within a ListingProvider');
  }
  return context;
};
