import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/section/header/Header';
import Footer from '@/components/section/footer/Footer';
import SnackBar from '@components/ui/snack-bar/SnackBar';
import PesananSayaSection from '@/components/section/pesanan/PesananSayaSection';
import RiwayatPesananSection from '@/components/section/pesanan/RiwayatPesananSection';
import { fetchPackages, PackageDetail } from '@/api/packages';

type TabKey = 'booking-saya' | 'daftar-riwayat';

export default function Riwayat() {
  const [activeTab, setActiveTab] = useState<TabKey>('booking-saya');
  const [packages, setPackages] = useState<PackageDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch packages from API
  useEffect(() => {
    const loadPackages = async () => {
      setLoading(true);
      try {
        const data = await fetchPackages();
        setPackages(data);
      } catch (error) {
        console.error('Error loading packages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  // Split packages: first 3 for active bookings, rest for history
  const activeBookings = packages.slice(0, 3);
  const completedBookings = packages.slice(3);

  const handleDetailClick = (id: string | number) => {
    navigate(`/detail-paket/${id}`);
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
      <div className="pt-24 mobile:pt-20 xs:pt-22 sm:pt-24 pb-8 mobile:pb-6 xs:pb-7 sm:pb-8 px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8">
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
            packages={activeBookings}
            loading={loading}
            onDetailClick={handleDetailClick}
          />
        ) : (
          <RiwayatPesananSection
            packages={completedBookings}
            loading={loading}
            onReviewClick={handleReviewClick}
          />
        )}
      </div>
    </div>
  );
}
