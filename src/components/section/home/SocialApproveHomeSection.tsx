import React from 'react';

export default function SocialApproveHomeSection() {
  const stats = [
    {
      id: 1,
      value: '500+',
      label: 'Destinasi Halal',
    },
    {
      id: 2,
      value: '100K+',
      label: 'Muslimah yang Terlayani',
    },
    {
      id: 3,
      value: '4.9',
      label: 'Rata-rata Rating Kepuasan',
    },
  ];

  return (
    <section
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: '#E8E8E8' }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content - Text */}
          <div className="flex-1 max-w-2xl">
            <h2 className="text-gray-900 font-bold text-[clamp(1.75rem,4vw,2.75rem)] leading-tight mb-6">
              Ketenangan dan Kenyamanan Perjalanan Anda, Prioritas Kami
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
              Setiap paket perjalanan kami dirancang dengan cermat, menjamin
              kenyamanan dan kesesuaian syariah.{' '}
              <span className="font-semibold">Ribuan Muslimah</span> telah
              membuktikan layanan kami yang berfokus pada pengalaman beribadah
              yang tenang.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="text-center">
                    <div
                      className="text-[35px] font-bold mb-2"
                      style={{ color: '#444444' }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-gray-600 text-sm md:text-base font-medium leading-snug">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="flex-1 max-w-xl w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021"
                alt="Muslim travelers"
                className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
              />
              {/* Optional gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
