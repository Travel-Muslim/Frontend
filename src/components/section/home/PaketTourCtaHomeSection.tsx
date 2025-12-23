import React from 'react';
import Button from '../../ui/button/Button';
import { useNavigate } from 'react-router-dom';

export default function PaketTourCtaHomeSection() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/cari-destinasi');
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070"
          alt="Travel Together"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] w-full mx-auto">
          <div className="max-w-3xl text-center mx-auto">
            {/* Badge */}
            <div className="inline-block mb-6">
              <span
                className="px-6 py-2 rounded-full text-white font-semibold text-sm md:text-base"
                style={{ backgroundColor: '#B49DE4' }}
              >
                Paket Tour
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-white font-bold text-[clamp(1.75rem,5vw,3rem)] leading-tight mb-6">
              Temukan pilihan destinasi halal dengan akomodasi aman, makanan
              halal terjamin, dan fasilitas ibadah yang mudah dijangkau.
            </h2>

            {/* CTA Button */}
            <Button
              variant="white-hover-light-purple"
              onClick={handleExploreClick}
              className="!w-[clamp(200px,40vw,280px)] !h-[clamp(50px,6vh,64px)] !text-[clamp(1rem,1.5vw,1.125rem)] shadow-xl hover:shadow-2xl cursor-pointer"
            >
              Temukan Destinasi
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
