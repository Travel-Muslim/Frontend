import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/button/Button';
import CardUlasan from '../../components/ui/card-ulasan/CardUlasan';
import CardUnggahUlasan from '../../components/ui/card-unggah-ulasan/CardUnggahUlasan';
import CardTambahUlasan from '../../components/ui/card-tambah-ulasan/CardTambahUlasan';
import PopupNotifikasi from '../../components/ui/popup-notifikasi/PopupNotifikasi';
import { fetchPackage, type PackageDetail } from '../../api/packages';
import { createReview, type CreateReviewPayload } from '../../api/reviews';

interface ReviewLocationState {
  bookingId?: string;
  packageId?: string;
}

export default function ReviewDestinasi() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const locationState = location.state as ReviewLocationState | null;

  const [packageDetail, setPackageDetail] = useState<PackageDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupVariant, setPopupVariant] = useState<'success' | 'error'>(
    'success'
  );
  const [popupMessage, setPopupMessage] = useState('');
  const [error, setError] = useState('');

  // Load package detail on mount
  useEffect(() => {
    const loadPackageDetail = async () => {
      const packageId = id || locationState?.packageId;

      if (!packageId) {
        setError('Package ID tidak ditemukan');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchPackage(packageId);

        if (data) {
          setPackageDetail(data);
        } else {
          setError('Paket tidak ditemukan');
        }
      } catch (err) {
        console.error('Error loading package:', err);
        setError('Gagal memuat detail paket');
      } finally {
        setLoading(false);
      }
    };

    loadPackageDetail();
  }, [id, locationState?.packageId]);

  const handleUpload = (file: File) => {
    setUploadedImage(file);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleReviewTextChange = (text: string) => {
    setReviewText(text);
  };

  const handleCancel = () => {
    setRating(0);
    setReviewText('');
    setUploadedImage(null);
    setError('');
  };

  const handleSubmit = async () => {
    // Validasi input
    if (!reviewText.trim()) {
      setError('Ulasan tidak boleh kosong');
      return;
    }
    if (!rating || rating <= 0) {
      setError('Berikan rating terlebih dahulu');
      return;
    }

    const bookingId = locationState?.bookingId;
    if (!bookingId) {
      setError(
        'Booking ID tidak ditemukan. Pastikan Anda mengakses dari riwayat pesanan.'
      );
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Prepare payload
      const payload: CreateReviewPayload = {
        booking_id: bookingId,
        rating: rating,
        comment: reviewText.trim(),
      };

      // Prepare media files if image uploaded
      const mediaFiles = uploadedImage ? [uploadedImage] : undefined;

      // Submit review
      const result = await createReview(payload, mediaFiles);

      if (result) {
        // Success
        setPopupVariant('success');
        setPopupMessage(
          'Ulasan Anda berhasil ditambahkan. Terima kasih telah berbagi pengalaman perjalanan Anda!'
        );
        setShowPopup(true);
      } else {
        // Failed
        setPopupVariant('error');
        setPopupMessage('Gagal menambahkan ulasan. Silakan coba lagi.');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setPopupVariant('error');
      setPopupMessage(
        'Terjadi kesalahan saat mengirim ulasan. Silakan coba lagi.'
      );
      setShowPopup(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handlePopupButtonClick = () => {
    if (popupVariant === 'success') {
      // Reset form and redirect
      handleCancel();
      navigate('/riwayat');
    } else {
      // Close popup and allow retry
      handleClosePopup();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-orange-50 pt-32 sm:pt-36 pb-20 sm:pb-32">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-gray-600">Memuat data paket...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - no package found
  if (!packageDetail) {
    return (
      <div className="w-full min-h-screen bg-orange-50 pt-32 sm:pt-36 pb-20 sm:pb-32">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-4">
              {error || 'Paket tidak ditemukan'}
            </p>
            <Button
              variant="light-teal-hover-dark-teal"
              onClick={() => navigate(-1)}
            >
              Kembali
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-orange-50 pt-32 sm:pt-36 pb-20 sm:pb-32">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-purple-950 mb-3">
            Ulasan Destinasi
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl font-sans font-medium text-gray-700">
            Bagikan ulasan beserta momen berkesan mengenai perjalanan yang Anda
            ikuti
          </p>
        </div>

        {/* Section Title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-semibold text-purple-950">
            Berikut adalah detail perjalanan yang Anda ikuti
          </h2>
        </div>

        {/* Tour Package Card using CardUlasan */}
        <div className="mb-12 sm:mb-16">
          <CardUlasan
            image={packageDetail.image || 'https://via.placeholder.com/400x300'}
            title={packageDetail.name}
            subtitle={`${packageDetail.location} - ${packageDetail.duration}`}
            rating={4.5}
          />
        </div>

        {/* Section Title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-semibold text-purple-950">
            Unggah momen terbaik Anda dan beri nilai destinasi ini
          </h2>
        </div>

        {/* Input Section */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-12 sm:mb-16">
          {/* Card Upload and Rating */}
          <div className="w-full lg:w-1/2">
            <CardUnggahUlasan
              onImageUpload={handleUpload}
              onRatingChange={handleRatingChange}
            />
          </div>

          {/* Card Review Text */}
          <div className="w-full lg:w-1/2">
            <CardTambahUlasan
              value={reviewText}
              onChange={handleReviewTextChange}
              placeholder="Ceritakan pengalaman Anda selama perjalanan..."
              maxLength={1000}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-end">
          <Button
            variant="light-pink-hover-dark-pink"
            showArrows={false}
            onClick={handleCancel}
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
          >
            Batalkan Ulasan
          </Button>
          <Button
            variant="light-teal-hover-dark-teal"
            showArrows={false}
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
          >
            {submitting ? 'Mengirim...' : 'Tambahkan Ulasan'}
          </Button>
        </div>
      </div>

      {/* Popup Notifikasi */}
      <PopupNotifikasi
        variant={popupVariant}
        title={
          popupVariant === 'success'
            ? 'Ulasan Berhasil Ditambahkan'
            : 'Gagal Menambahkan Ulasan'
        }
        description={popupMessage}
        buttonText={popupVariant === 'success' ? 'Selesai' : 'Coba Lagi'}
        isOpen={showPopup}
        onClose={handleClosePopup}
        onButtonClick={handlePopupButtonClick}
      />
    </div>
  );
}
