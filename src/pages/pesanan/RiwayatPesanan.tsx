import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SnackBar from '@components/ui/snack-bar/SnackBar';
import PesananSayaSection from '@/components/section/pesanan/PesananSayaSection';
import RiwayatPesananSection from '@/components/section/pesanan/RiwayatPesananSection';
import ModalReview from '@/components/ui/modal-review/ModalReview';
import PopupNotifikasi from '@/components/ui/popup-notifikasi/PopupNotifikasi';
import {
  fetchActiveBookings,
  fetchBookingHistory,
  Booking,
} from '@/api/booking';
import { createReview } from '@/api/reviews';

type TabKey = 'booking-saya' | 'daftar-riwayat';

const TABS = [
  { id: 'booking-saya', label: 'Booking Saya' },
  { id: 'daftar-riwayat', label: 'Daftar Riwayat Booking' },
];

export default function Riwayat() {
  const [activeTab, setActiveTab] = useState<TabKey>('booking-saya');
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [selectedPackageName, setSelectedPackageName] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Notification popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupVariant, setPopupVariant] = useState<'success' | 'error'>(
    'success'
  );
  const [popupMessage, setPopupMessage] = useState('');

  const loadBookings = async () => {
    try {
      const [activeData, historyData] = await Promise.all([
        fetchActiveBookings(),
        fetchBookingHistory(),
      ]);
      setActiveBookings(activeData);
      setBookingHistory(historyData);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadBookings();
  }, []);

  function handleDetailClick(id: string | number) {
    const booking = activeBookings.find((b) => b.booking_id === id);
    if (booking?.booking_payment_status === 'unpaid') {
      navigate(`/pembayaran-pesanan/${id}`);
    } else {
      navigate(`/tiket/${id}`);
    }
  }

  const handleCancelSuccess = () => loadBookings();

  const handleReviewClick = (bookingId: string, packageName: string) => {
    setSelectedBookingId(bookingId);
    setSelectedPackageName(packageName);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (data: {
    rating: number;
    comment: string;
    mediaFiles: File[];
  }) => {
    if (!selectedBookingId) return;

    setIsSubmittingReview(true);

    try {
      console.log('Submitting review for booking:', selectedBookingId);
      console.log('Review data:', {
        rating: data.rating,
        comment: data.comment,
        mediaCount: data.mediaFiles.length,
      });

      await createReview(
        {
          booking_id: selectedBookingId,
          rating: data.rating,
          comment: data.comment,
        },
        data.mediaFiles.length > 0 ? data.mediaFiles : undefined
      );

      // Success
      setShowReviewModal(false);
      setPopupVariant('success');
      setPopupMessage('Review Anda berhasil dikirim. Terima kasih!');
      setShowPopup(true);

      // Refresh bookings
      loadBookings();
    } catch (error) {
      console.error('Error submitting review:', error);
      setPopupVariant('error');
      setPopupMessage(
        error instanceof Error
          ? error.message
          : 'Gagal mengirim review. Silakan coba lagi.'
      );
      setShowPopup(true);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleTabChange = (tabId: string) => setActiveTab(tabId as TabKey);

  return (
    <>
      <div className="min-h-screen bg-orange-50">
        <HeroSection activeTab={activeTab} />
        <TabsSection activeTab={activeTab} onTabChange={handleTabChange} />
        <ContentSection
          activeTab={activeTab}
          activeBookings={activeBookings}
          bookingHistory={bookingHistory}
          loading={loading}
          onDetailClick={handleDetailClick}
          onCancelSuccess={handleCancelSuccess}
          onReviewClick={handleReviewClick}
        />
      </div>

      {/* Review Modal */}
      <ModalReview
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
        packageName={selectedPackageName}
        isSubmitting={isSubmittingReview}
      />

      {/* Notification Popup */}
      <PopupNotifikasi
        variant={popupVariant}
        title={
          popupVariant === 'success'
            ? 'Berhasil Mengirim Review'
            : 'Gagal Mengirim Review'
        }
        description={popupMessage}
        buttonText="OK"
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onButtonClick={() => setShowPopup(false)}
      />
    </>
  );
}

function HeroSection({ activeTab }: { activeTab: TabKey }) {
  return (
    <section className="px-4 py-8 md:py-8 lg:mt-20 md:mt-20">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
          Riwayat Booking
        </h1>
        <p className="text-base text-gray-600 sm:text-lg">
          {activeTab === 'booking-saya'
            ? 'Lihat daftar pemesanan, lihat detail e-tiket perjalanan Anda di sini'
            : 'Lihat riwayat pembelian Anda dan tambahkan review untuk setiap perjalanan yang sudah selesai'}
        </p>
      </div>
    </section>
  );
}

function TabsSection({
  activeTab,
  onTabChange,
}: {
  activeTab: TabKey;
  onTabChange: (tabId: string) => void;
}) {
  return (
    <section className="px-4 pb-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-2xl">
        <SnackBar items={TABS} activeId={activeTab} onItemClick={onTabChange} />
      </div>
    </section>
  );
}

function ContentSection({
  activeTab,
  activeBookings,
  bookingHistory,
  loading,
  onDetailClick,
  onCancelSuccess,
  onReviewClick,
}: {
  activeTab: TabKey;
  activeBookings: Booking[];
  bookingHistory: Booking[];
  loading: boolean;
  onDetailClick: (id: string | number) => void;
  onCancelSuccess: () => void;
  onReviewClick: (bookingId: string, packageName: string) => void;
}) {
  return (
    <section className="px-4 pb-16 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-center text-xl font-bold text-gray-900 sm:text-2xl">
          {activeTab === 'booking-saya'
            ? 'E-Tiket & Voucher Aktif'
            : 'Riwayat Booking'}
        </h2>

        {activeTab === 'booking-saya' ? (
          <PesananSayaSection
            bookings={activeBookings}
            loading={loading}
            onDetailClick={onDetailClick}
            onCancelSuccess={onCancelSuccess}
          />
        ) : (
          <RiwayatPesananSection
            bookings={bookingHistory}
            loading={loading}
            onReviewClick={onReviewClick}
          />
        )}
      </div>
    </section>
  );
}
