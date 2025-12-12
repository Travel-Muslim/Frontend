import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import UploadAndRateInput from "../components/UploadAndRateInput";
import SuccessModal from "../components/SuccessModal";
import { saveReview } from "../utils/reviews";
import "./ReviewDestinasi.css";

interface ReviewLocationState {
  tourTitle?: string;
  packageName?: string;
  rating?: number;
  image?: string;
  destId?: number;
}

const defaultTour = {
  packageName: "",
  tourTitle: "",
  rating: 0,
  image: "",
};

export default function ReviewDestinasi() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as ReviewLocationState | null;

  const [rating, setRating] = useState(locationState?.rating ?? 0);
  const [reviewText, setReviewText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = (file: File | null) => {
    if (!file) {
      setUploadedImage(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setRating(0);
    setReviewText("");
    setUploadedImage(null);
    setError("");
  };

  const handleSubmit = () => {
    if (!reviewText.trim()) {
      setError("Ulasan tidak boleh kosong");
      return;
    }
    if (!rating || rating <= 0) {
      setError("Berikan rating terlebih dahulu");
      return;
    }

    const matchedDest = locationState?.destId;

    if (!matchedDest) {
      setError("Paket destinasi tidak dikenali");
      return;
    }

    saveReview({
      id: Date.now(),
      destId: matchedDest,
      title: activeTour.tourTitle,
      packageName: activeTour.packageName,
      rating,
      text: reviewText.trim(),
      image: uploadedImage,
      createdAt: new Date().toISOString(),
    });

    setRating(0);
    setReviewText("");
    setUploadedImage(null);
    setError("");
    setShowSuccessModal(true);
  };

  const activeTour = {
    packageName: locationState?.packageName ?? defaultTour.packageName,
    tourTitle: locationState?.tourTitle ?? defaultTour.tourTitle,
    rating: locationState?.rating ?? defaultTour.rating,
    image: locationState?.image ?? defaultTour.image,
  };

  return (
    <div className="review-destinasi-page-wrapper">
      <div className="review-destinasi-page-container">
        <div className="review-destinasi-header-section">
          <div className="review-destinasi-title-wrapper">
            <h1 className="review-destinasi-page-title">Ulasan Destinasi</h1>
          </div>
          <p className="review-destinasi-page-subtitle">
            Bagikan ulasan beserta momen berkesan mengenai perjalanan yang Anda ikuti
          </p>
        </div>

        <div className="review-section-divider">
          <h2 className="review-section-title">Berikut adalah detail perjalanan yang Anda ikuti</h2>
        </div>

        <div className="review-tour-package-card">
          <div className="review-tour-image-wrapper">
            <img src={activeTour.image} alt={activeTour.tourTitle} className="review-tour-image" />
          </div>
          <div className="review-tour-info">
            <p className="review-tour-package-title">{activeTour.packageName}</p>
            <p className="review-tour-name">{activeTour.tourTitle}</p>
            <div className="review-tour-rating">
              <div className="review-star-icon">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                  <path
                    d="M19 2.375L23.7175 12.045L34.3125 13.5875L26.6562 21.0537L28.435 31.625L19 26.5862L9.565 31.625L11.3438 21.0537L3.6875 13.5875L14.2825 12.045L19 2.375Z"
                    fill="#FBBF24"
                  />
                </svg>
              </div>
              <p className="review-rating-text">{activeTour.rating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="review-section-divider">
          <h2 className="review-section-title">Unggah momen terbaik Anda dan beri nilai destinasi ini</h2>
        </div>

        <div className="review-input-section">
          <UploadAndRateInput
            rating={rating}
            onRatingChange={setRating}
            onUploadChange={handleUpload}
            uploadedImage={uploadedImage}
          />

          <div className="review-text-wrapper">
            <div className="review-text-input-container">
              <p className="review-text-input-title">Tambahkan ulasan anda</p>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Masukkan ulasan anda"
                className="review-textarea"
              />
            </div>
          </div>
        </div>

        {error && <div className="review-error">{error}</div>}

        <div className="review-action-buttons">
          <Button
            variant="pink-light"
            showArrows={false}
            onClick={handleCancel}
            className="review-cancel-button"
          >
            Batalkan Ulasan
          </Button>
          <Button
            variant="teal-light"
            showArrows={false}
            onClick={handleSubmit}
            className="review-submit-button"
          >
            Tambahkan Ulasan
          </Button>
        </div>
      </div>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Ulasan berhasil ditambahkan"
        message="Terima kasih telah berbagi momen indah perjalanan Anda."
        primaryText="Tutup"
        onPrimary={() => {
          setShowSuccessModal(false);
          navigate(-1);
        }}
      />
    </div>
  );
}
