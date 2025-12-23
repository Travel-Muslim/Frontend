import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeroDetailDestinasiSection from '../../components/section/detail-destinasi/HeroDetailDestinasiSection';
import ItineraryTable from '../../components/section/detail-destinasi/ItenaryTableDestinasiSection';
import FormPesanan from '../../components/section/detail-destinasi/FormPesananDetailDestinasiSection';
import TestimoniDetailDestinasiSection from '../../components/section/detail-destinasi/TestimoniDetailDestinasiSection';
import SnackBar from '../../components/ui/snack-bar/SnackBar';
import SuccessModal from '../../components/modals/SuccessModal';

import { fetchPackage, type PackageDetail } from '../../api/packages';
import { createBooking, type CreateBookingPayload } from '../../api/booking';
import { fetchUserReviews, type UserReview } from '../../api/reviews';

type TabKey = 'itenary' | 'booking' | 'testimoni';

const STORAGE_WISHLIST = 'wishlist-liked-ids';

export default function DetailDestinasi() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState<PackageDetail | null>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('itenary');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch package detail
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    Promise.all([fetchPackage(id), fetchUserReviews()])
      .then(([pkgData, reviewsData]) => {
        if (active) {
          if (pkgData) {
            setDestination(pkgData);
          }
          if (reviewsData && Array.isArray(reviewsData)) {
            setReviews(reviewsData);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    if (!destination) return;
    const saved = localStorage.getItem(STORAGE_WISHLIST);
    if (saved) {
      try {
        const arr = JSON.parse(saved) as Array<string | number>;
        setIsWishlisted(
          arr.some((val) => String(val) === String(destination.id))
        );
      } catch {
        setIsWishlisted(false);
      }
    }
  }, [destination?.id]);

  // Update page title
  useEffect(() => {
    if (destination?.name) {
      document.title = `${destination.name} | Saleema Tour`;
    }
  }, [destination?.name]);

  const handleWishlistToggle = () => {
    if (!destination) return;
    const saved = localStorage.getItem(STORAGE_WISHLIST);
    let arr: Array<string | number> = saved ? JSON.parse(saved) : [];

    if (arr.some((val) => String(val) === String(destination.id))) {
      arr = arr.filter((val) => String(val) !== String(destination.id));
      setIsWishlisted(false);
    } else {
      arr = [destination.id, ...arr];
      setIsWishlisted(true);
    }
    localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(arr));
  };

  const handleBookingSubmit = async (formData: any) => {
    if (!destination) return;

    setBookingLoading(true);
    try {
      const payload: CreateBookingPayload = {
        packageId: destination.id?.toString() || '',
        fullname: formData.nama,
        email: formData.email,
        phoneNumber: formData.nomorTelepon,
        whatsappContact: formData.nomorTelepon,
        totalParticipants: formData.jumlahBooking,
        passportNumber: formData.noPaspor,
        passportExpiry: formData.tanggalKadaluarsa,
        nationality: formData.negaraPaspor,
        notes: formData.uploadPaspor ? 'Passport uploaded' : '',
      };

      const result = await createBooking(payload);
      if (result) {
        setSuccessMessage(
          'Booking berhasil dibuat! Silahkan lanjut ke pembayaran.'
        );
        setShowSuccessModal(true);
        setActiveTab('itenary');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setSuccessMessage('Gagal membuat booking. Silakan coba lagi.');
      setShowSuccessModal(true);
    } finally {
      setBookingLoading(false);
    }
  };

  const tabItems = [
    { id: 'itenary', label: 'Itinerary' },
    { id: 'booking', label: 'Booking' },
    { id: 'testimoni', label: 'Testimoni' },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white via-pink-50/10 to-white">
      {/* Hero Section */}
      <HeroDetailDestinasiSection
        destination={destination}
        loading={loading}
        isWishlisted={isWishlisted}
        onWishlistClick={handleWishlistToggle}
        onBookingClick={() => setActiveTab('booking')}
      />

      {/* Tab Navigation - SnackBar */}
      <section className="w-full bg-white py-8 md:py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <SnackBar
            items={tabItems as any}
            activeId={activeTab}
            onItemClick={(id) => setActiveTab(id as TabKey)}
            className="shadow-lg"
          />
        </div>
      </section>

      {/* Content Sections */}
      <main className="w-full bg-gradient-to-b from-white to-pink-50/10">
        {/* Itinerary Tab */}
        {activeTab === 'itenary' && destination && (
          <section className="w-full py-12 md:py-16 lg:py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <ItineraryTable
                title={destination.name}
                startDate={destination.periode_start}
                endDate={destination.periode_end}
                days={
                  destination.itinerary?.map((item, idx) => ({
                    day: idx + 1,
                    destinations: item.destinasi || [],
                    meals: item.makan || [],
                    mosques: item.masjid || [],
                    transportation: item.transportasi || [],
                  })) || []
                }
              />
            </div>
          </section>
        )}

        {/* Booking Tab */}
        {activeTab === 'booking' && (
          <section className="w-full py-12 md:py-16 lg:py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <FormPesanan
                loading={bookingLoading}
                onSubmit={handleBookingSubmit}
              />
            </div>
          </section>
        )}

        {/* Testimoni Tab */}
        {activeTab === 'testimoni' && (
          <TestimoniDetailDestinasiSection
            reviews={reviews}
            loading={loading}
          />
        )}
      </main>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Pemberitahuan"
        message={successMessage}
        primaryText="Tutup"
      />
    </div>
  );
}
