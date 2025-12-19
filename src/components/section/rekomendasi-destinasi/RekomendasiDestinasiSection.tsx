import CardPackage from '@components/ui/card-package/CardPackage';
import { PackageDetail } from '@api/packages';

interface RekomendasiDestinasiSectionProps {
  favoritePackages: PackageDetail[];
  popularPackages: PackageDetail[];
  loading?: boolean;
  onPackageClick: (pkg: PackageDetail) => void;
}

export default function RekomendasiDestinasiSection({
  favoritePackages,
  popularPackages,
  loading = false,
  onPackageClick,
}: RekomendasiDestinasiSectionProps) {
  console.log(
    '🎯 Section received - Favorite:',
    favoritePackages?.length || 0,
    'Popular:',
    popularPackages?.length || 0
  );
  console.log('🎯 Loading state:', loading);

  const formatPrice = (price: number | undefined): string => {
    if (!price) return 'Hubungi kami';
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  const formatPeriod = (period: string[] | undefined): string => {
    if (!period || period.length === 0) return 'Jadwal tersedia';
    return period[0];
  };

  const formatDuration = (duration: string | undefined): string => {
    if (!duration) return '';
    return duration;
  };

  const renderPackageCard = (pkg: PackageDetail) => (
    <CardPackage
      key={pkg.id}
      title={pkg.title}
      country={pkg.location}
      airline={pkg.airline || 'Airline tersedia'}
      dateRange={formatPeriod(pkg.period)}
      price={formatPrice(pkg.price)}
      priceLabel="Mulai dari"
      imageUrl={pkg.image}
      buttonText="Details"
      onDetailsClick={() => onPackageClick(pkg)}
      variant="compact-button"
      showLocation={true}
      showAirline={true}
      showDate={true}
      className="w-full"
    />
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8 py-16 mobile:py-12 xs:py-14 sm:py-16">
        <p className="text-center text-gray-600 text-lg">
          Memuat paket wisata...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8 py-16 mobile:py-12 xs:py-14 sm:py-16 space-y-16 mobile:space-y-12 xs:space-y-14 sm:space-y-16">
      {/* Liburan Favorit Saat Ini Section */}
      <section className="w-full">
        <h2 className="text-3xl mobile:text-2xl xs:text-2xl sm:text-3xl font-bold text-center mb-10 mobile:mb-8 xs:mb-9 sm:mb-10 text-gray-900">
          – Liburan Favorit Saat Ini –
        </h2>

        {favoritePackages.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mobile:gap-4 xs:gap-5 sm:gap-6 justify-items-center">
            {favoritePackages.map((pkg) => renderPackageCard(pkg))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-12 mobile:py-8 xs:py-10 sm:py-12">
            <p className="text-lg mobile:text-base xs:text-base sm:text-lg">
              Tidak ada paket favorit tersedia saat ini
            </p>
          </div>
        )}
      </section>

      {/* Paling Banyak Dicari Section */}
      <section className="w-full">
        <h2 className="text-3xl mobile:text-2xl xs:text-2xl sm:text-3xl font-bold text-center mb-10 mobile:mb-8 xs:mb-9 sm:mb-10 text-gray-900">
          – Paling banyak dicari –
        </h2>

        {popularPackages.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mobile:gap-4 xs:gap-5 sm:gap-6 justify-items-center">
            {popularPackages.map((pkg) => renderPackageCard(pkg))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-12 mobile:py-8 xs:py-10 sm:py-12">
            <p className="text-lg mobile:text-base xs:text-base sm:text-lg">
              Tidak ada paket populer tersedia saat ini
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
