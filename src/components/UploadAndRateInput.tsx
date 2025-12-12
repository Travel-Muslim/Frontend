import React, { useRef } from "react";
import uploadIcon from "../assets/icon/arrow.png";
import StarRating from "./StarRating";
import "./UploadAndRateInput.css";

interface UploadAndRateInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  onUploadChange?: (file: File | null) => void;
  uploadedImage?: string | null;
}

export default function UploadAndRateInput({
  rating,
  onRatingChange,
  onUploadChange,
  uploadedImage = null,
}: UploadAndRateInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onUploadChange?.(file);
    event.target.value = "";
  };

  return (
    <div className="upload-rate-card">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="upload-rate-input"
        onChange={handleFileChange}
      />
      <p className="upload-rate-card-title">Unggah dan Nilai pengalaman anda!</p>

      <button
        type="button"
        className="upload-rate-dropzone"
        onClick={handleButtonClick}
        aria-label="Unggah momen perjalanan"
      >
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded preview" className="upload-rate-preview" />
        ) : (
          <div className="upload-rate-placeholder">
            <img src={uploadIcon} alt="Upload icon" className="upload-rate-icon" />
            <span className="upload-rate-placeholder-text">Klik untuk mengunggah</span>
          </div>
        )}
      </button>

      <div className="upload-rate-stars">
        <StarRating
          rating={rating}
          onRatingChange={onRatingChange}
          interactive
          size={32}
          className="upload-rate-star-row"
        />
      </div>
    </div>
  );
}
