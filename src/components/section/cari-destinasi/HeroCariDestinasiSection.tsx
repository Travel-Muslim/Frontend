import React from 'react';
import SearchBarInput from '@/components/ui/searchbar-input/SearchBarInput';

interface HeroCariDestinasiSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch?: (value: string) => void;
  backgroundImage?: string;
}

export default function HeroCariDestinasiSection({
  searchValue,
  onSearchChange,
  onSearch,
  backgroundImage = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021',
}: HeroCariDestinasiSectionProps) {
  return (
    <section
      className="relative min-h-[420px] md:min-h-[520px] lg:min-h-[600px] flex items-center justify-center text-center py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/35" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl w-full flex flex-col gap-6 items-center">
        {/* Title */}
        <h1 className="text-white font-bold text-[clamp(2rem,5vw,3.5rem)] leading-tight mb-2">
          Cari Destinasi
        </h1>

        {/* Description */}
        <p className="text-white text-[clamp(0.95rem,2vw,1.125rem)] leading-relaxed max-w-2xl px-4 mb-4 opacity-95">
          Jelajahi setiap sudut dunia dan temukan destinasi impian anda untuk
          memberikan pengalaman perjalanan yang aman dan sesuai dengan kebutuhan
          Muslimah.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl px-4">
          <SearchBarInput
            placeholder="Cari Destinasi Tour"
            value={searchValue}
            onChange={onSearchChange}
            onSearch={onSearch}
            className="shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
