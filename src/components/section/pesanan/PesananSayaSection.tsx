import CardBs from '@components/ui/card-pesanan/CardPesanan';
import PopupNotifikasi from '@components/ui/popup-notifikasi/PopupNotifikasi';
import { Booking, cancelBooking } from '@api/booking';
import { formatHelper } from '@/helper/format';
import { useState } from 'react';

interface PesananSayaSectionProps {
  bookings: Booking[];
  loading?: boolean;
  onDetailClick: (id: string) => void;
  onCancelSuccess?: () => void;
}

export default function PesananSayaSection({
  bookings,
  loading = false,
  onDetailClick,
  onCancelSuccess,
}: PesananSayaSectionProps) {
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleCancelBooking = async (bookingId: string) => {
    setPendingCancelId(bookingId);
    setShowConfirmPopup(true);
  };

  const confirmCancel = async () => {
    if (!pendingCancelId) return;

    setCancelingId(pendingCancelId);
    try {
      const success = await cancelBooking(pendingCancelId);
      if (success) {
        setShowSuccessPopup(true);
        onCancelSuccess?.();
      } else {
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      setShowErrorPopup(true);
    } finally {
      setCancelingId(null);
      setPendingCancelId(null);
    }
  };

  const handleDetailClick = (booking: Booking) => {
    onDetailClick(booking.booking_id || '');
  };

  const LoadingState = () => (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-lg text-gray-600">Memuat pesanan...</p>
    </div>
  );

  const EmptyState = () => (
    <div className="container mx-auto px-4 py-12 text-center">
      <p className="mb-4 text-xl text-gray-600">Belum ada pesanan aktif</p>
      <p className="text-base text-gray-500">
        Pesanan Anda yang sedang berjalan akan muncul di sini
      </p>
    </div>
  );

  if (loading) return <LoadingState />;
  if (bookings.length === 0) return <EmptyState />;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {bookings.map((booking) => (
            <CardBs
              key={booking.booking_id}
              id={String(booking.booking_id)}
              variant="with-detail"
              paymentStatus={booking.booking_payment_status}
              image={booking.package_image}
              title={booking.package_name}
              location={booking.package_location}
              date={formatHelper.Period(
                booking.package_periode_start,
                booking.package_periode_end
              )}
              airline={booking.package_maskapai}
              airport={booking.package_bandara}
              status={booking.booking_status}
              onDetailClick={() => handleDetailClick(booking)}
              onCancelClick={() =>
                handleCancelBooking(booking.booking_id || '')
              }
            />
          ))}
        </div>
      </div>

      <PopupNotifikasi
        variant="confirm"
        title="Batalkan Booking"
        description="Apakah Anda yakin ingin membatalkan booking ini?"
        confirmButtonText="Ya, Batalkan"
        cancelButtonText="Batal"
        isOpen={showConfirmPopup}
        onClose={() => setShowConfirmPopup(false)}
        onConfirm={confirmCancel}
      />

      <PopupNotifikasi
        variant="success"
        title="Berhasil Dibatalkan"
        description="Booking berhasil dibatalkan"
        buttonText="Oke"
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />

      <PopupNotifikasi
        variant="error"
        title="Gagal Dibatalkan"
        description="Gagal membatalkan booking. Silakan coba lagi."
        buttonText="Oke"
        isOpen={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
      />
    </>
  );
}
