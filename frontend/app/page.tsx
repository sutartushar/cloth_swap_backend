'use client';

import { useAuth } from '@/contexts/AuthContext';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/listings');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
