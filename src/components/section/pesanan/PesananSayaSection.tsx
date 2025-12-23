import CardBs from '@components/ui/card-pesanan/CardPesanan';
import { PackageDetail } from '@api/packages';
import { formatHelper } from '@/helper/format';

interface PesananSayaSectionProps {
  packages: PackageDetail[];
  loading?: boolean;
  onDetailClick: (id: string | number) => void;
}

export default function PesananSayaSection({
  packages,
  loading = false,
  onDetailClick,
}: PesananSayaSectionProps) {
  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8 py-8 mobile:py-6 xs:py-7 sm:py-8">
        <p className="text-center text-gray-600 text-lg">Memuat pesanan...</p>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8 py-12 mobile:py-8 xs:py-10 sm:py-12">
        <div className="text-center">
          <p className="text-xl mobile:text-lg xs:text-lg sm:text-xl text-gray-600 mb-4">
            Belum ada pesanan aktif
          </p>
          <p className="text-base mobile:text-sm xs:text-sm sm:text-base text-gray-500">
            Pesanan Anda yang sedang berjalan akan muncul di sini
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8 py-8 mobile:py-6 xs:py-7 sm:py-8">
      <div className="space-y-6 mobile:space-y-4 xs:space-y-5 sm:space-y-6">
        {packages.map((pkg) => (
          <CardBs
            key={pkg.id}
            id={String(pkg.id)}
            variant="with-detail"
            image={pkg.image}
            title={pkg.name}
            location={pkg.location}
            date={
              formatHelper.Period(pkg.periode_start) +
              (pkg.periode_end
                ? ` - ${formatHelper.Period(pkg.periode_end)}`
                : '')
            }
            airline={pkg.maskapai || 'Airline tersedia'}
            airport={pkg.bandara || 'Airport tersedia'}
            status="Terbayar"
            onDetailClick={() => onDetailClick(pkg.id)}
          />
        ))}
      </div>
    </div>
  );
}
