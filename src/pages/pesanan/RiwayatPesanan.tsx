import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/section/header/Header';
import Footer from '@/components/section/footer/Footer';
import SnackBar from '@components/ui/snack-bar/SnackBar';
import PesananSayaSection from '@/components/section/pesanan/PesananSayaSection';
import RiwayatPesananSection from '@/components/section/pesanan/RiwayatPesananSection';
import {
  fetchActiveBookings,
  fetchBookingHistory,
  Booking,
} from '@/api/booking';

type TabKey = 'booking-saya' | 'daftar-riwayat';

export default function Riwayat() {
  const [activeTab, setActiveTab] = useState<TabKey>('booking-saya');
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch bookings from API
  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
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

    loadBookings();
  }, []);

  const handleDetailClick = (id: string | number) => {
    // Check if this is a booking ID (for payment) or package ID (for detail)
    const booking = activeBookings.find((b) => b.id === id);
    if (booking && booking.paymentStatus === 'unpaid') {
      // Navigate to payment page
      console.log('Navigating to payment page for booking ID:', id);
      navigate(`/pembayaran-pesanan/${id}`);
    } else {
      // Navigate to package detail
      navigate(`/detail-paket/${id}`);
    }
  };

  const handleCancelSuccess = () => {
    // Reload bookings after cancellation
    const loadBookings = async () => {
      try {
        const [activeData, historyData] = await Promise.all([
          fetchActiveBookings(),
          fetchBookingHistory(),
        ]);
        setActiveBookings(activeData);
        setBookingHistory(historyData);
      } catch (error) {
        console.error('Error reloading bookings:', error);
      }
    };
    loadBookings();
  };

  const handleReviewClick = (id: string | number) => {
    navigate(`/review/${id}`);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabKey);
  };

  const tabs = [
    { id: 'booking-saya', label: 'Booking Saya' },
    { id: 'daftar-riwayat', label: 'Daftar Riwayat Booking' },
  ];

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Hero Section */}
      <div className="pt-24 lg:mt-20 md:mt-20  mobile:pt-20 xs:pt-22 sm:pt-24 pb-8 mobile:pb-6 xs:pb-7 sm:pb-8 px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl mobile:text-3xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-3 mobile:mb-2 xs:mb-2.5 sm:mb-3">
            Riwayat Booking
          </h1>
          <p className="text-lg mobile:text-base xs:text-base sm:text-lg text-gray-600">
            {activeTab === 'booking-saya'
              ? 'Lihat daftar pemesanan, lihat detail e-tiket perjalanan Anda di sini'
              : 'Lihat riwayat pembelian Anda dan tambahkan review untuk setiap perjalanan yang sudah selesai'}
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8 pb-6 mobile:pb-4 xs:pb-5 sm:pb-6">
        <div className="max-w-2xl mx-auto">
          <SnackBar
            items={tabs}
            activeId={activeTab}
            onItemClick={handleTabChange}
          />
        </div>
      </div>

      {/* Section Title */}
      <div className="px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8 pb-4 mobile:pb-3 xs:pb-3.5 sm:pb-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl mobile:text-xl xs:text-xl sm:text-2xl font-bold text-gray-900 text-center">
            {activeTab === 'booking-saya'
              ? 'E-Tiket & Voucher Aktif'
              : 'Riwayat Booking'}
          </h2>
        </div>
      </div>

      {/* Content Section */}
      <div className="pb-16 mobile:pb-12 xs:pb-14 sm:pb-16">
        {activeTab === 'booking-saya' ? (
          <PesananSayaSection
            bookings={activeBookings}
            loading={loading}
            onDetailClick={handleDetailClick}
            onCancelSuccess={handleCancelSuccess}
          />
        ) : (
          <RiwayatPesananSection
            bookings={bookingHistory}
            loading={loading}
            onReviewClick={handleReviewClick}
          />
        )}
      </div>
    </div>
  );
}
