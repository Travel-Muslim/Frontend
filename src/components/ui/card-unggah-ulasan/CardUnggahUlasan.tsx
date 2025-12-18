import React, { useState, useRef } from 'react';
import { Upload, Star, X } from 'lucide-react';

interface CardUnggahUlasanProps {
  onImageUpload?: (file: File) => void;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function CardUnggahUlasan({
  onImageUpload,
  onRatingChange,
  className = '',
}: CardUnggahUlasanProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRatingClick = (value: number) => {
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      if (onImageUpload) {
        onImageUpload(file);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      if (onImageUpload) {
        onImageUpload(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`bg-white rounded-[20px] border-2 border-[#FFC9D6] p-6 sm:p-8 shadow-lg ${className}`}
    >
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
        Unggah dan Nilai pengalaman anda!
      </h2>

      {/* Upload Area */}
      <div className="mb-6 sm:mb-8">
        <div
          className={`
            relative border-2 border-[#FFC9D6] rounded-[20px] 
            min-h-[250px] sm:min-h-[300px] lg:min-h-[350px]
            flex items-center justify-center
            transition-all duration-200
            ${isDragging ? 'border-pink-400 bg-pink-50' : 'bg-white'}
            ${uploadedImage ? 'p-4' : 'p-8'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadedImage ? (
            /* Preview Image */
            <div className="relative w-full h-full min-h-[220px] sm:min-h-[270px] lg:min-h-[320px]">
              <img
                src={uploadedImage}
                alt="Uploaded preview"
                className="w-full h-full object-contain rounded-[15px]"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                aria-label="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Upload Button */
            <button
              onClick={handleUploadClick}
              className="flex flex-col items-center justify-center gap-4 cursor-pointer hover:scale-105 transition-transform"
              aria-label="Upload image"
            >
              <div className="bg-[#FFC9D6] rounded-[15px] p-6 sm:p-8">
                <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700" />
              </div>
              <p className="text-gray-500 text-sm sm:text-base text-center px-4">
                {isDragging
                  ? 'Lepaskan file di sini'
                  : 'Klik atau drag & drop untuk upload foto'}
              </p>
            </button>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Star Rating */}
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5].map((value) => {
          const isActive = value <= (hoverRating || rating);
          return (
            <button
              key={value}
              onClick={() => handleRatingClick(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110 cursor-pointer"
              aria-label={`Rate ${value} stars`}
            >
              <Star
                className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 transition-colors ${
                  isActive
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-none text-yellow-400 stroke-2'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Rating Display */}
      {rating > 0 && (
        <p className="text-center text-gray-600 mt-4 text-sm sm:text-base">
          Anda memberikan rating:{' '}
          <span className="font-semibold">{rating} bintang</span>
        </p>
      )}
    </div>
  );
}

// Demo Component
export function CardUnggahUlasanDemo() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Card Unggah Ulasan Component
          </h1>
          <p className="text-gray-600">Upload image and rate your experience</p>
        </div>

        {/* Component */}
        <CardUnggahUlasan
          onImageUpload={(file) => {
            setUploadedFile(file);
            console.log('File uploaded:', file.name);
          }}
          onRatingChange={(rating) => {
            setSelectedRating(rating);
            console.log('Rating selected:', rating);
          }}
        />

        {/* Info Display */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Uploaded Data
          </h2>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-semibold">File:</span>{' '}
              {uploadedFile ? uploadedFile.name : 'No file uploaded'}
            </p>
            <p>
              <span className="font-semibold">Rating:</span>{' '}
              {selectedRating > 0
                ? `${selectedRating} stars`
                : 'No rating selected'}
            </p>
          </div>
        </div>

        {/* Usage Example */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Usage Example
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {`const [rating, setRating] = useState(0);

<CardUnggahUlasan
  onImageUpload={(file) => {
    console.log('Uploaded:', file.name);
    // Handle file upload to server
  }}
  onRatingChange={(rating) => {
    setRating(rating);
    console.log('Rating:', rating);
  }}
/>`}
          </pre>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Click to upload or drag & drop image</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Image preview with remove option</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Interactive 5-star rating system</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Hover effects on stars</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Responsive design for all screen sizes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Callbacks for image upload and rating change</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
