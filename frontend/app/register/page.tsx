'use client';

import RegisterForm from '@/components/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/listings');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50 px-4 py-8">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
