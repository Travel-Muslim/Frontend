import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DetailTiket from '../../components/section/unduh-tiket/DetailTiket';
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
      const bookingId = id || locationState?.bookingId;

      if (!bookingId) {
        setError('Booking ID tidak ditemukan');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch booking detail
        const bookingData = await fetchBookingDetail(bookingId);

        if (!bookingData) {
          setError('Booking tidak ditemukan');
          setLoading(false);
          return;
        }

        setBooking(bookingData);

        // Fetch package detail if packageId exists
        if (bookingData.packageId) {
          const packageData = await fetchPackage(bookingData.packageId);
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
    if (!booking?.id) return;

    setDownloading(true);

    try {
      const blob = await downloadTicket(booking.id);

      if (blob) {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Tiket-${booking.bookingCode || booking.id}.pdf`;
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
        setPopupVariant('error');
        setPopupMessage('Gagal mengunduh tiket. Silakan coba lagi.');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error downloading ticket:', error);
      setPopupVariant('error');
      setPopupMessage(
        'Terjadi kesalahan saat mengunduh tiket. Silakan coba lagi.'
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
    booking.departureDate || booking.bookingDate
  );
  const pulang = calculateReturnDate(
    booking.departureDate || booking.bookingDate,
    packageDetail?.duration || booking.duration
  );

  return (
    <>
      <DetailTiket
        namaLengkap={booking.fullname || '-'}
        paketTour={packageDetail?.name || booking.package_name || '-'}
        nomorTelepon={booking.phoneNumber || '-'}
        tanggalHabisBerlaku={
          booking.passportExpiry
            ? new Date(booking.passportExpiry).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '-'
        }
        alamatEmail={booking.email || '-'}
        statusPembayaran={
          booking.paymentStatus === 'paid'
            ? 'Terkonfirmasi'
            : booking.paymentStatus === 'unpaid'
              ? 'Menunggu Pembayaran'
              : booking.paymentStatus || '-'
        }
        tourId={booking.bookingCode || booking.id}
        berangkat={berangkat}
        pulang={pulang}
        jumlahPenumpang={booking.totalParticipants || 1}
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
