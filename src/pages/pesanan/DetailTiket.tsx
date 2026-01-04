import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DetailTiket from '../../components/section/unduh-tiket/DetailTiketSection';
import PopupNotifikasi from '../../components/ui/popup-notifikasi/PopupNotifikasi';
import {
  fetchBookingDetail,
  downloadTicket,
  type Booking,
} from '../../api/booking';
import { fetchPackage, type PackageDetail } from '../../api/packages';

interface TicketDetailState {
  bookingId?: string;
}

export default function TicketDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const locationState = location.state as TicketDetailState | null;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [packageDetail, setPackageDetail] = useState<PackageDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [popupVariant, setPopupVariant] = useState<'success' | 'error'>(
    'success'
  );
  const [popupMessage, setPopupMessage] = useState('');

  // Load booking detail and package info
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch booking detail
        const bookingData = await fetchBookingDetail(
          id || locationState?.bookingId || ''
        );

        if (!bookingData) {
          setError('Booking tidak ditemukan');
          setLoading(false);
          return;
        }

        console.log('Booking data loaded:', bookingData);
        console.log('Booking ID:', bookingData.booking_id);
        console.log('Payment status:', bookingData.booking_payment_status);

        setBooking(bookingData);

        // Fetch package detail if packageId exists
        if (bookingData.package_id) {
          const packageData = await fetchPackage(bookingData.package_id);
          setPackageDetail(packageData);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Gagal memuat detail tiket');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, locationState?.bookingId]);

  const handleDownloadTicket = async () => {
    if (!booking?.booking_id) {
      console.error('No booking_id available');
      setPopupVariant('error');
      setPopupMessage('ID booking tidak ditemukan.');
      setShowPopup(true);
      return;
    }

    console.log('Starting download for booking:', booking.booking_id);
    console.log('Booking payment status:', booking.booking_payment_status);

    // Check payment status before downloading
    if (booking.booking_payment_status !== 'paid') {
      setPopupVariant('error');
      setPopupMessage(
        'Tiket hanya dapat diunduh setelah pembayaran dikonfirmasi.'
      );
      setShowPopup(true);
      return;
    }

    setDownloading(true);

    try {
      const blob = await downloadTicket(booking.booking_id);

      if (blob && blob instanceof Blob) {
        console.log('Blob received, size:', blob.size);
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Tiket-${booking.booking_code || booking.booking_id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Show success popup
        setPopupVariant('success');
        setPopupMessage(
          'Tiket Anda berhasil diunduh. Silakan cek folder download Anda.'
        );
        setShowPopup(true);
      } else {
        // Show error popup
        console.error('No valid blob received');
        setPopupVariant('error');
        setPopupMessage('Gagal mengunduh tiket. Silakan coba lagi.');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error downloading ticket:', error);
      setPopupVariant('error');
      setPopupMessage(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat mengunduh tiket. Silakan coba lagi.'
      );
      setShowPopup(true);
    } finally {
      setDownloading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handlePopupButtonClick = () => {
    if (popupVariant === 'success') {
      // Close and stay on page or navigate
      handleClosePopup();
    } else {
      // Retry download
      handleClosePopup();
      handleDownloadTicket();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B49DE4] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail tiket...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error || 'Booking tidak ditemukan'}
          </div>
          <button
            onClick={() => navigate('/riwayat')}
            className="bg-[#B49DE4] hover:bg-[#9B87C7] text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Kembali ke Riwayat
          </button>
        </div>
      </div>
    );
  }

  // Parse dates for display
  const parseDepartureDate = (dateString?: string) => {
    if (!dateString) return { tanggal: '-', bulan: '-', tahun: '-' };

    try {
      const date = new Date(dateString);
      return {
        tanggal: date.getDate().toString().padStart(2, '0'),
        bulan: date.toLocaleDateString('id-ID', { month: 'short' }),
        tahun: date.getFullYear().toString(),
      };
    } catch {
      return { tanggal: '-', bulan: '-', tahun: '-' };
    }
  };

  // Calculate return date (assuming duration from package)
  const calculateReturnDate = (departureDate?: string, duration?: string) => {
    if (!departureDate) return { tanggal: '-', bulan: '-', tahun: '-' };

    try {
      const date = new Date(departureDate);
      // Extract days from duration string (e.g., "6 Hari 5 Malam" -> 6)
      const days = parseInt(duration?.match(/\d+/)?.[0] || '7');
      date.setDate(date.getDate() + days - 1);

      return {
        tanggal: date.getDate().toString().padStart(2, '0'),
        bulan: date.toLocaleDateString('id-ID', { month: 'short' }),
        tahun: date.getFullYear().toString(),
      };
    } catch {
      return { tanggal: '-', bulan: '-', tahun: '-' };
    }
  };

  const berangkat = parseDepartureDate(
    booking.booking_departure_date || booking.booking_date
  );
  const pulang = calculateReturnDate(
    booking.booking_departure_date || booking.booking_date,
    packageDetail?.duration
  );

  return (
    <>
      <DetailTiket
        namaLengkap={booking.booking_fullname || '-'}
        paketTour={packageDetail?.name || booking.package_name || '-'}
        nomorTelepon={booking.booking_phone_number || '-'}
        tanggalHabisBerlaku={
          booking.booking_passport_expiry
            ? new Date(booking.booking_passport_expiry).toLocaleDateString(
                'id-ID',
                {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }
              )
            : '-'
        }
        alamatEmail={booking.booking_email || '-'}
        statusPembayaran={
          booking.booking_payment_status === 'paid'
            ? 'Terkonfirmasi'
            : booking.booking_payment_status === 'unpaid'
              ? 'Menunggu Pembayaran'
              : booking.booking_payment_status || '-'
        }
        tourId={booking.booking_code || ''}
        berangkat={berangkat}
        pulang={pulang}
        jumlahPenumpang={booking.booking_total_participants || 1}
        onDownload={handleDownloadTicket}
        isDownloading={downloading}
      />

      {/* Popup Notifikasi */}
      <PopupNotifikasi
        variant={popupVariant}
        title={
          popupVariant === 'success'
            ? 'Berhasil Mengunduh Tiket'
            : 'Gagal Mengunduh Tiket'
        }
        description={popupMessage}
        buttonText={popupVariant === 'success' ? 'Selesai' : 'Coba Lagi'}
        isOpen={showPopup}
        onClose={handleClosePopup}
        onButtonClick={handlePopupButtonClick}
      />
    </>
  );
}
