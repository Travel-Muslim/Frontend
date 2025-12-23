import React from 'react';
import CardPackage from '../../ui/card-package/CardPackage';
import type { PackageDetail } from '@api/packages';

interface HistoryDestinasiSectionProps {
  packages: PackageDetail[];
  loading?: boolean;
  onDetailsClick?: (id: string) => void;
}

export default function HistoryDestinasiSection({
  packages,
  loading = false,
  onDetailsClick,
}: HistoryDestinasiSectionProps) {
  const formatPrice = (price?: number) => {
    if (!price) return 'Rp0';
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-xl font-medium text-gray-500">
          Memuat riwayat destinasi...
        </p>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-xl font-medium text-gray-500">
          Belum ada destinasi terakhir dilihat.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 mobile:grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile:gap-4 xs:gap-4 sm:gap-5 md:gap-6">
      {packages.map((pkg) => (
        <div key={pkg.id} className="w-full flex justify-center">
          <CardPackage
            variant="compact-button"
            title={pkg.name}
            country={pkg.location}
            price={formatPrice(pkg.price)}
            imageUrl={pkg.image}
            buttonText="Details"
            onDetailsClick={() => onDetailsClick?.(String(pkg.id))}
            className="w-full max-w-[380px]"
          />
        </div>
      ))}
    </div>
  );
}
