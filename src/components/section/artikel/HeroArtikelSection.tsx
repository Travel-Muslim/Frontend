import React from 'react';
import SearchBarInput from '@components/ui/searchbar-input/SearchBarInput';

interface HeroArtikelSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (query: string) => void;
  backgroundImage?: string;
}

export default function HeroArtikelSection({
  searchQuery,
  onSearchChange,
  onSearch,
  backgroundImage = '/artikelher1.png',
}: HeroArtikelSectionProps) {
  return (
    <div
      className="relative w-screen h-[400px] mobile:h-[350px] xs:h-[350px] sm:h-[380px] md:h-[400px] lg:h-[450px] bg-center bg-cover flex items-center justify-center overflow-hidden"
      style={{
        marginLeft: 'calc(50% - 50vw)',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.15)), url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 z-0" />

      <div className="relative z-10 flex flex-col items-center gap-5 mobile:gap-4 xs:gap-4 sm:gap-5 px-4 mobile:px-3 xs:px-3 sm:px-6 max-w-4xl w-full">
        {/* Title */}
        <h1 className=" font-black font-semibold text-[3rem] mobile:text-[2.5rem] xs:text-[2.75rem] sm:text-[3rem] md:text-[3rem] lg:text-[3rem] text-white text-center leading-tight">
          Artikel Panduan
        </h1>

        {/* Subtitle */}
        <p className="font-sans font-normal text-[clamp(0.875rem,2vw,1rem)] mobile:text-sm xs:text-sm sm:text-base text-white text-center leading-normal max-w-3xl">
          Temukan semua tips dan trik praktis yang dibutuhkan Muslimah untuk
          merencanakan perjalanan yang aman, nyaman, dan bebas khawatir. Selalu
          siap untuk petualangan berikutnya!
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl flex justify-center px-2 mobile:px-0 xs:px-0">
          <SearchBarInput
            placeholder="Cari topik artikel"
            value={searchQuery}
            onChange={onSearchChange}
            onSearch={onSearch}
            className="w-full rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
