import React from 'react';
import Button from '../button/Button';

export interface ArticleCardProps {
  image?: string;
  title: string;
  description: string;
  category?: string;
  date?: string;
  onReadClick?: () => void;
  variant?: 'simple' | 'with-button';
  className?: string;
}

export default function ArticleCard({
  image,
  title,
  description,
  category,
  date,
  onReadClick,
  variant = 'with-button',
  className = '',
}: ArticleCardProps) {
  // Variant Simple - Tanpa button
  if (variant === 'simple') {
    return (
      <div
        className={`flex flex-col w-[380px] items-start gap-[9px] pt-[19px] pb-2 px-[17px] bg-white rounded-[15px] shadow-lg hover:shadow-xl transition-shadow ${className}`}
      >
        {/* Article Image */}
        <div className="flex flex-col w-[350px] h-48 items-start gap-2.5 overflow-hidden">
          <div className="w-full h-full rounded-lg overflow-hidden">
            {image ? (
              <img
                // src={image}
                alt={title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
        </div>

        {/* Article Content */}
        <div className="flex flex-col items-start justify-end self-stretch w-full flex-[0_0_auto] p-2.5 gap-3">
          {/* Category/Date */}
          {(category || date) && (
            <p className="font-sans font-medium text-sm text-gray-400">
              {category || date}
            </p>
          )}

          {/* Title */}
          <h3 className="font-sans font-bold text-xl text-gray-800 leading-snug">
            {title}
          </h3>

          {/* Description */}
          <p className="font-sans font-normal text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    );
  }

  // Variant With Button - Dengan button di tengah
  return (
    <div
      className={`flex flex-col w-[380px] items-start gap-[9px] pt-[19px] pb-2 px-[17px] bg-white rounded-[15px] shadow-lg hover:shadow-xl transition-shadow ${className}`}
    >
      {/* Article Image */}
      <div className="flex flex-col w-full h-48 items-start gap-2.5 overflow-hidden">
        <div className="w-full h-full rounded-lg overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="flex flex-col items-start justify-end self-stretch w-full flex-[0_0_auto] p-2.5 gap-3">
        {/* Title */}
        <h3 className="font-sans font-bold text-xl text-gray-800 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="font-sans font-normal text-sm text-gray-600 leading-relaxed">
          {description}
        </p>

        {/* Read Article Button - Centered */}
        {onReadClick && (
          <div className="flex justify-center self-stretch w-full mt-2">
            <Button
              variant="light-purple-hover-dark-purple"
              onClick={onReadClick}
              className="h-12!"
            >
              Lihat Artikel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Demo Component
export function ArticleCardDemo() {
  const handleReadClick = (title: string) => {
    alert(`Reading: ${title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Article Card Variants
        </h1>
        <p className="text-gray-600 mb-8">
          2 different card styles for article display
        </p>

        {/* Variant 1: Simple - Tanpa Button */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Simple Variant (Tanpa Button)
          </h2>
          <div className="flex justify-center">
            <ArticleCard
              variant="simple"
              image="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800"
              category="Lorem ipsum"
              title="Lorem ipsum dolor sit amet consectetur."
              description="Lorem ipsum dolor sit amet consectetur. Dolor at pulvinar ullamcorper dignissim tellus at."
            />
          </div>
        </div>

        {/* Variant 2: With Button */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            With Button Variant
          </h2>
          <div className="flex justify-center">
            <ArticleCard
              variant="with-button"
              image="https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800"
              title="Bukan Seoul Aja! Hidden Gems Korea dalam Paket Wisata Muslimah"
              description="Korea Selatan selalu berhasil mencuri perhatian para traveler dunia. Tapi kalau kamu pikir Korea cuma tentang Seoul, Myeongdong, atau Namsan Tower — kamu salah besar!"
              onReadClick={() =>
                handleReadClick(
                  'Bukan Seoul Aja! Hidden Gems Korea dalam Paket Wisata Muslimah'
                )
              }
            />
          </div>
        </div>

        {/* Both Variants Side by Side */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Both Variants
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <ArticleCard
                variant="simple"
                image="https://images.unsplash.com/photo-1528164344705-47542687000d?w=800"
                category="Lorem ipsum"
                title="Lorem ipsum dolor sit amet consectetur."
                description="Lorem ipsum dolor sit amet consectetur. Dolor at pulvinar ullamcorper dignissim tellus at."
              />
            </div>
            <div className="flex justify-center">
              <ArticleCard
                variant="with-button"
                image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                title="Destinasi Wisata Halal Terbaik di Indonesia"
                description="Indonesia memiliki banyak destinasi wisata halal yang menarik untuk dikunjungi. Dari Aceh hingga Papua, setiap daerah memiliki keunikan tersendiri yang sayang untuk dilewatkan!"
                onReadClick={() =>
                  handleReadClick('Destinasi Wisata Halal Terbaik di Indonesia')
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
