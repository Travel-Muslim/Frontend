import CardBs from '@components/ui/card-pesanan/CardPesanan';
import { Booking, cancelBooking } from '@api/booking';
import { formatHelper } from '@/helper/format';
import { useState } from 'react';

interface PesananSayaSectionProps {
  bookings: Booking[];
  loading?: boolean;
  onDetailClick: (id: string | number) => void;
  onCancelSuccess?: () => void;
}

export default function PesananSayaSection({
  bookings,
  loading = false,
  onDetailClick,
  onCancelSuccess,
}: PesananSayaSectionProps) {
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const handleCancelBooking = async (bookingId: string) => {
    const confirmCancel = window.confirm(
      'Apakah Anda yakin ingin membatalkan booking ini?'
    );

    if (!confirmCancel) return;

    setCancelingId(bookingId);
    try {
      const success = await cancelBooking(bookingId);
      if (success) {
        alert('Booking berhasil dibatalkan');
        // Trigger refresh of booking list
        if (onCancelSuccess) {
          onCancelSuccess();
        }
      } else {
        alert('Gagal membatalkan booking. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Terjadi kesalahan saat membatalkan booking.');
    } finally {
      setCancelingId(null);
    }
  };
  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8 py-8 mobile:py-6 xs:py-7 sm:py-8">
        <p className="text-center text-gray-600 text-lg">Memuat pesanan...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
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
        {bookings.map((booking) => (
          <CardBs
            key={booking.id}
            id={String(booking.id)}
            variant="with-detail"
            paymentStatus={booking.paymentStatus}
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
            airline={booking.airline || 'Airline tersedia'}
            airport={booking.airport || 'Airport tersedia'}
            status={
              booking.paymentStatus === 'paid'
                ? 'Terbayar'
                : 'Menunggu Pembayaran'
            }
            onDetailClick={(id) => {
              // If unpaid, go to payment page; if paid, go to ticket detail
              if (booking.paymentStatus === 'unpaid') {
                onDetailClick(booking.id); // Navigate to payment page with booking ID
              } else {
                onDetailClick(booking.packageId); // Navigate to ticket/package detail
              }
            }}
            onCancelClick={(id) => handleCancelBooking(booking.id)}
          />
        ))}
      </div>
    </div>
  );
}
