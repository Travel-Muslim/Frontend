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
  // Format package data untuk card
  const formatPackageForCard = (pkg: PackageDetail) => {
    const formatPrice = (price?: number) =>
      price ? `Rp${price.toLocaleString('id-ID')}` : undefined;

    const formatPeriod = (period?: string[]) => {
      if (!period || period.length === 0) return undefined;
      // Format tanggal: hilangkan T dan timezone
      const cleanDates = period.map((d) =>
        d.replace(/T.*$/, '').replace(/\.\d{3}Z$/, '')
      );
      if (cleanDates.length === 1) return cleanDates[0];
      return `${cleanDates[0]} - ${cleanDates[cleanDates.length - 1]}`;
    };

    return {
      id: pkg.id,
      title: pkg.title,
      subtitle: pkg.period?.[0] || 'Paket Tour',
      country: pkg.location,
      location: pkg.location,
      airline: pkg.airline,
      dateRange: formatPeriod(pkg.period),
      price: formatPrice(pkg.price),
      imageUrl: pkg.image || '',
    };
  };

  // Use API data with formatting
  const displayPackages =
    packages.length > 0 ? packages.slice(0, 3).map(formatPackageForCard) : [];

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

        {/* Empty State */}
        {!loading && displayPackages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada paket wisata tersedia</p>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && displayPackages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 justify-items-center">
            {displayPackages.map((pkg) => (
              <CardPackage
                key={pkg.id}
                title={pkg.title}
                subtitle={pkg.subtitle}
                imageUrl={pkg.imageUrl}
                dateRange={pkg.dateRange}
                country={pkg.country}
                airline={pkg.airline}
                price={pkg.price}
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
