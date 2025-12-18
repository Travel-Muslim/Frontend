import React from 'react';
import CardPackage from '../../ui/card-package/CardPackage';
import { PackageDetail } from '@/api/packages';

interface WisataPilihanHomeSectionProps {
  packages: PackageDetail[];
  loading: boolean;
}

export default function WisataPilihanHomeSection({
  packages,
  loading,
}: WisataPilihanHomeSectionProps) {
  // Dummy data as fallback
  const dummyPackages = [
    {
      id: 'dummy-1',
      title: 'Korea Halal Tour',
      subtitle: 'Paket Desember 2025',
      country: 'Korea Selatan',
      location: 'Korea Selatan',
      airline: 'Garuda Indonesia',
      dateRange: 'Januari - Februari 2026',
      price: 'Rp14.000.000',
      imageUrl:
        'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=2070',
    },
    {
      id: 'dummy-2',
      title: 'Uzbekistan Halal Tour',
      subtitle: 'Paket November 2025',
      country: 'Uzbekistan',
      location: 'Uzbekistan',
      airline: 'Turkish Airlines',
      dateRange: 'November - Desember 2025',
      price: 'Rp18.000.000',
      imageUrl:
        'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?q=80&w=2070',
    },
    {
      id: 'dummy-3',
      title: 'Japan Halal Tour',
      subtitle: 'Paket Oktober 2025',
      country: 'Jepang',
      location: 'Jepang',
      airline: 'ANA Airlines',
      dateRange: 'Oktober - November 2025',
      price: 'Rp22.000.000',
      imageUrl:
        'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070',
    },
  ];

  // Use API data if available, otherwise use dummy data
  const displayPackages =
    packages.length > 0 ? packages.slice(0, 3) : dummyPackages;

  return (
    <section
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: '#FFF8F0' }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <p className="text-gray-500 text-sm md:text-base mb-2">
              Perjalanan terbaik kami
            </p>
            <h2 className="text-gray-900 font-bold text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">
              Wisata Halal Pilihan Muslimah
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Nikmati setiap destinasi yang terjamin keamanannya, dan jelajahi
              keindahan alam yang menenangkan
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat paket wisata...</p>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 justify-items-center">
            {displayPackages.map((pkg) => (
              <CardPackage
                key={pkg.id}
                title={pkg.title}
                subtitle={'Paket Wisata'}
                country={pkg.location}
                variant="minimal-simple"
                onDetailsClick={() => console.log(`Details for ${pkg.title}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
