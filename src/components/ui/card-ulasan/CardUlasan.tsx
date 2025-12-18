import React from 'react';
import { Star } from 'lucide-react';

interface CardUlasanProps {
  image: string;
  title: string;
  subtitle: string;
  rating: number;
  className?: string;
}

export default function CardUlasan({
  image,
  title,
  subtitle,
  rating,
  className = '',
}: CardUlasanProps) {
  return (
    <div
      className={`bg-white rounded-[20px] border-2 border-[#FFC9D6] p-4 sm:p-6 shadow-lg ${className}`}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
        {/* Image */}
        <div className="w-full sm:w-[320px] lg:w-[520px] h-[200px] sm:h-[240px] lg:h-[300px] rounded-[15px] overflow-hidden flex-shrink-0 bg-gray-100">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center gap-3 sm:gap-4 flex-1 text-center sm:text-left">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            {title}
          </h3>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700">
            {subtitle}
          </p>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Star className="w-6 h-6 sm:w-7 sm:h-7 fill-yellow-400 text-yellow-400" />
            <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo Component
export function CardUlasanDemo() {
  const sampleData = {
    image:
      'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=900&q=80',
    title: 'Paket Desember 2025',
    subtitle: 'Korea Halal Tour 2025',
    rating: 4.8,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Card Ulasan Component
          </h1>
          <p className="text-gray-600">
            Package review card with image and rating
          </p>
        </div>

        {/* Example */}
        <CardUlasan {...sampleData} />

        {/* Multiple Examples */}
        <div className="space-y-6">
          <CardUlasan
            image="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
            title="Paket November 2025"
            subtitle="Turki Halal Tour"
            rating={4.9}
          />
          <CardUlasan
            image="https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=900&q=80"
            title="Paket Januari 2026"
            subtitle="Mesir Halal Tour"
            rating={4.7}
          />
        </div>

        {/* Usage Example */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Usage Example
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {`<CardUlasan
  image="https://example.com/image.jpg"
  title="Paket Desember 2025"
  subtitle="Korea Halal Tour 2025"
  rating={4.8}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
