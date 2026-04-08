'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, Plus, Shirt } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
          <Shirt size={28} />
          ClothSwap
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link href="/listings" className="text-gray-700 hover:text-indigo-600 transition">
                Browse
              </Link>
              <Link href="/swaps" className="text-gray-700 hover:text-indigo-600 transition">
                My Swaps
              </Link>
              <Link
                href="/create-listing"
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus size={20} />
                New Listing
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-indigo-600 transition">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-4 space-y-3">
            {user ? (
              <>
                <Link
                  href="/listings"
                  className="block py-2 text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse
                </Link>
                <Link
                  href="/swaps"
                  className="block py-2 text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Swaps
                </Link>
                <Link
                  href="/create-listing"
                  className="block py-2 text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  New Listing
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block py-2 text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
