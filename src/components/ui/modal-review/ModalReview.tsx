import React, { useState } from 'react';
import { X, Star, Upload, Trash2 } from 'lucide-react';
import Button from '../button/Button';

interface ModalReviewProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    rating: number;
    comment: string;
    mediaFiles: File[];
  }) => void;
  packageName?: string;
  isSubmitting?: boolean;
}

export default function ModalReview({
  isOpen,
  onClose,
  onSubmit,
  packageName = '',
  isSubmitting = false,
}: ModalReviewProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + mediaFiles.length > 5) {
      alert('Maksimal 5 file media');
      return;
    }

    // Filter only images and videos
    const validFiles = files.filter((file) => {
      const type = file.type;
      return type.startsWith('image/') || type.startsWith('video/');
    });

    if (validFiles.length !== files.length) {
      alert('Hanya file gambar dan video yang diperbolehkan');
    }

    // Create previews
    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setMediaPreviews([...mediaPreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setMediaFiles([...mediaFiles, ...validFiles]);
  };

  const handleRemoveMedia = (index: number) => {
    const newFiles = mediaFiles.filter((_, i) => i !== index);
    const newPreviews = mediaPreviews.filter((_, i) => i !== index);
    setMediaFiles(newFiles);
    setMediaPreviews(newPreviews);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Silakan berikan rating');
      return;
    }
    if (!comment.trim()) {
      alert('Silakan tulis komentar Anda');
      return;
    }

    onSubmit({ rating, comment, mediaFiles });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form
      setRating(0);
      setHoveredRating(0);
      setComment('');
      setMediaFiles([]);
      setMediaPreviews([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] h-full flex items-center justify-center p-2 bg-transparent bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">Tulis Review</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Package Name */}
          {packageName && (
            <div className="bg-purple-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Paket Tour</p>
              <p className="font-semibold text-gray-800">{packageName}</p>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isSubmitting}
                  className="transition-transform hover:scale-110 disabled:opacity-50"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {rating === 1 && 'Sangat Buruk'}
                {rating === 2 && 'Buruk'}
                {rating === 3 && 'Cukup'}
                {rating === 4 && 'Baik'}
                {rating === 5 && 'Sangat Baik'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Komentar <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              placeholder="Ceritakan pengalaman Anda tentang paket tour ini..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={6}
              maxLength={1000}
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              {comment.length}/1000 karakter
            </p>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Foto/Video (Opsional)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Maksimal 5 file. Format: JPG, PNG, MP4
            </p>

            {/* Preview Media */}
            {mediaPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {mediaFiles[index].type.startsWith('image/') ? (
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={preview}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveMedia(index)}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {mediaFiles.length < 5 && (
              <label className="block">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Klik untuk upload foto/video
                  </p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            variant="white-hover-light-purple"
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0 || !comment.trim()}
            variant="light-pink-hover-dark-pink"
            className="flex-1"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Mengirim...
              </span>
            ) : (
              'Kirim Review'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
