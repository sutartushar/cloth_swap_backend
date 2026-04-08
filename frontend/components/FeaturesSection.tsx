'use client';

import { Shirt, MessageSquare, MapPin, Users } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Shirt,
      title: 'List Your Clothes',
      description: 'Add your pre-loved items to our marketplace in minutes',
    },
    {
      icon: Users,
      title: 'Connect with Swappers',
      description: 'Find the perfect swap match with our smart matching system',
    },
    {
      icon: MessageSquare,
      title: 'Chat & Negotiate',
      description: 'Communicate directly with other users to finalize deals',
    },
    {
      icon: MapPin,
      title: 'Meet Locally',
      description: 'Exchange items safely in your community',
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How ClothSwap Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition">
              <feature.icon className="text-indigo-600 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
