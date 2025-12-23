import React from 'react';
import Button from '../../ui/button/Button';
import { HeroBgImage } from '@/assets/images';

export default function HeroHomeSection() {
  const handleSearchClick = () => {
    // Navigate to search or scroll to search section
    const searchSection = document.getElementById('cari-destinasi-section');
    searchSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          // src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=2071"
          src={HeroBgImage}
          alt="Istiqlal Mosque"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] w-full mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Text Content - Left Side */}
            <div className="flex-1 text-center lg:text-left max-w-[800px]">
              <h1 className="text-white font-bold text-[clamp(2rem,5vw,3.5rem)] leading-tight mb-4 md:mb-6">
                Mulailah Perjalanan Halalmu Sekarang
              </h1>
              <p className="text-white text-[clamp(1rem,2vw,1.25rem)] leading-relaxed mb-8 md:mb-10 opacity-95">
                Temukan destinasi, akomodasi, dan pengalaman perjalanan yang
                aman serta sesuai syariah. Jelajahi dunia dengan rasa tenang,
                penuh keyakinan, dan tetap menjaga nilai-nilai sebagai muslimah.
              </p>
            </div>

            {/* CTA Button - Right Side */}
            <div className="flex-shrink-0">
              <Button
                variant="white-hover-light-purple"
                onClick={handleSearchClick}
                className="!w-[clamp(200px,25vw,300px)] !h-[clamp(50px,6vh,70px)] !text-[clamp(1rem,1.5vw,1.25rem)] shadow-xl hover:shadow-2xl cursor-pointer"
              >
                Cari Sekarang
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <div className="flex flex-col items-center gap-2 text-white opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
          <span className="text-sm">Scroll</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
