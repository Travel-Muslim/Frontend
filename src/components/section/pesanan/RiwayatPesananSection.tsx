import CardBs from '@components/ui/card-pesanan/CardPesanan';
import { Booking } from '@api/booking';
import { formatHelper } from '@/helper/format';

interface RiwayatPesananSectionProps {
  bookings: Booking[];
  loading?: boolean;
  onReviewClick: (id: string | number) => void;
}

export default function RiwayatPesananSection({
  bookings,
  loading = false,
  onReviewClick,
}: RiwayatPesananSectionProps) {
  const formatPrice = (price: number | undefined): string => {
    if (!price) return 'Hubungi kami';
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  const formatPeriod = (period: string[] | undefined): string => {
    if (!period || period.length === 0) return 'Jadwal tersedia';
    return period[0];
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8 py-8 mobile:py-6 xs:py-7 sm:py-8">
        <p className="text-center text-gray-600 text-lg">
          Memuat riwayat pesanan...
        </p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8 py-12 mobile:py-8 xs:py-10 sm:py-12">
        <div className="text-center">
          <p className="text-xl mobile:text-lg xs:text-lg sm:text-xl text-gray-600 mb-4">
            Belum ada riwayat pesanan
          </p>
          <p className="text-base mobile:text-sm xs:text-sm sm:text-base text-gray-500">
            Riwayat pesanan yang sudah selesai akan muncul di sini
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8 py-8 mobile:py-6 xs:py-7 sm:py-8">
      <div className="space-y-6 mobile:space-y-4 xs:space-y-5 sm:space-y-6">
        {bookings.map((booking) => (
          <CardBs
            key={booking.id}
            id={String(booking.id)}
            variant="with-review"
            image={booking.package_image || ''}
            title={booking.package_name || 'Paket Tour'}
            location={booking.departure_month || ''}
            date={
              booking.departureDate
                ? formatHelper.Period(booking.departureDate)
                : booking.bookingDate
                  ? formatHelper.Period(booking.bookingDate)
                  : '-'
            }
            airline={booking.airline || 'Maskapai tersedia'}
            airport={booking.airport || 'Bandara tersedia'}
            status="Selesai"
            onReviewClick={() => onReviewClick(booking.packageId)}
          />
        ))}
      </div>
    </div>
  );
}
