'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20 md:py-32">
      <div className="container text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Swap Clothes, Save the Planet
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of fashion lovers building a sustainable community. Buy, sell, and swap clothes with people nearby.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </Link>
          <Link
            href="/login"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
