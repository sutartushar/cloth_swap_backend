'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ListingsPage from '@/components/ListingsPage';

export default function Listings() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <ListingsPage />;
}
