import React from 'react';
import CardPackage from '@/components/ui/card-package/CardPackage';
import { PackageDetail } from '@/api/packages';

interface CariDestinasiSectionProps {
  packages: PackageDetail[];
  loading: boolean;
  onPackageClick?: (pkg: PackageDetail) => void;
}

export default function CariDestinasiSection({
  packages,
  loading,
  onPackageClick,
}: CariDestinasiSectionProps) {
  // Split packages into two sections
  const primaryPackages = packages.slice(0, 3);
  const secondaryPackages = packages.slice(3, 6);

  const renderPackageCard = (pkg: PackageDetail) => {
    const formatPrice = (price?: number) =>
      price ? `Rp${price.toLocaleString('id-ID')}` : 'Hubungi kami';

    const formatPeriod = (period?: string[]) => {
      if (!period || period.length === 0) return 'Tanggal akan dikonfirmasi';
      if (period.length === 1) return period[0];
      return `${period[0]} - ${period[period.length - 1]}`;
    };

    return (
      <CardPackage
        key={pkg.id}
        title={pkg.title}
        subtitle={pkg.period?.[0] || 'Paket Tour'}
        country={pkg.location}
        airline={pkg.airline || 'Airline'}
        dateRange={formatPeriod(pkg.period)}
        price={formatPrice(pkg.price)}
        priceLabel="Mulai dari"
        imageUrl={pkg.image || ''}
        buttonText="Details"
        variant="detailed"
        onDetailsClick={() => onPackageClick?.(pkg)}
      />
    );
  };

  if (loading) {
    return (
      <section className="bg-orange-50 py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Memuat destinasi...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-orange-50 py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Primary Section - First 3 packages */}
        {primaryPackages.length > 0 && (
          <div className="mb-16 md:mb-20 lg:mb-24">
            {/* Section Header */}
            <div className="mb-8 md:mb-12">
              <h2 className="text-gray-900 font-bold text-[clamp(1.5rem,3.5vw,2rem)] leading-tight">
                Mulai pencarian destinasi sesuai minat perjalanan Anda
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
              {primaryPackages.map(renderPackageCard)}
            </div>
          </div>
        )}

        {/* Secondary Section - Next 3 packages */}
        {secondaryPackages.length > 0 && (
          <div>
            {/* Section Header */}
            <div className="mb-8 md:mb-12">
              <h2 className="text-gray-900 font-bold text-[clamp(1.5rem,3.5vw,2rem)] leading-tight">
                Destinasi terbaik untuk perjalanan Anda tersedia di sini
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
              {secondaryPackages.map(renderPackageCard)}
            </div>
          </div>
        )}

        {/* Empty State */}
        {packages.length === 0 && !loading && (
          <div className="text-center py-16">
            <h3 className="text-gray-700 font-semibold text-xl mb-2">
              Tidak ada destinasi ditemukan
            </h3>
            <p className="text-gray-500">Coba ubah kata kunci pencarian Anda</p>
          </div>
        )}
      </div>
    </section>
  );
}
