import React, { useState } from 'react';

interface CardTambahUlasanProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export default function CardTambahUlasan({
  value,
  onChange,
  placeholder = 'Masukkan ulasan anda',
  maxLength = 1000,
  className = '',
}: CardTambahUlasanProps) {
  const [internalValue, setInternalValue] = useState(value || '');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const currentValue = value !== undefined ? value : internalValue;
  const characterCount = currentValue.length;

  return (
    <div
      className={`bg-white rounded-[20px] border-2 border-[#FFC9D6] p-6 sm:p-8 shadow-lg ${className}`}
    >
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Tambahkan ulasan anda
      </h2>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={8}
          className="
            w-full 
            rounded-[20px] 
            border-2 border-[#FFC9D6] 
            bg-white
            p-4 sm:p-6
            text-base sm:text-lg
            text-gray-800
            placeholder:text-gray-400
            resize-none
            outline-none
            focus:bg-white
            focus:border-[#FFB4C4]
            focus:ring-2
            focus:ring-pink-200
            transition-all
          "
          aria-label="Tulis ulasan anda"
        />

        {/* Character Count */}
        <div className="absolute bottom-4 right-4 text-sm text-gray-400">
          <span className={characterCount >= maxLength ? 'text-red-500' : ''}>
            {characterCount}
          </span>
          /{maxLength}
        </div>
      </div>

      {/* Helper Text */}
      {characterCount >= maxLength && (
        <p className="text-red-500 text-sm mt-2">
          Maksimal {maxLength} karakter tercapai
        </p>
      )}
    </div>
  );
}

// Demo Component
export function CardTambahUlasanDemo() {
  const [review1, setReview1] = useState('');
  const [review2, setReview2] = useState(
    'Pengalaman yang luar biasa! Tour guide sangat membantu dan tempat-tempat yang dikunjungi sangat menarik.'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Card Tambah Ulasan Component
          </h1>
          <p className="text-gray-600">
            Add review textarea with character counter
          </p>
        </div>

        {/* Empty State */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Example 1: Empty State
          </h3>
          <CardTambahUlasan
            value={review1}
            onChange={(value) => setReview1(value)}
          />
        </div>

        {/* With Content */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Example 2: With Existing Content
          </h3>
          <CardTambahUlasan
            value={review2}
            onChange={(value) => setReview2(value)}
          />
        </div>

        {/* Custom Placeholder and Max Length */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Example 3: Custom Settings
          </h3>
          <CardTambahUlasan
            placeholder="Ceritakan pengalaman Anda dalam 500 karakter..."
            maxLength={500}
          />
        </div>

        {/* Review Display */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Current Reviews
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Review 1:
              </p>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg min-h-[60px]">
                {review1 || (
                  <span className="text-gray-400 italic">Belum ada ulasan</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Review 2:
              </p>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {review2}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Example */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Usage Example
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {`const [review, setReview] = useState('');

<CardTambahUlasan
  value={review}
  onChange={(value) => setReview(value)}
  placeholder="Masukkan ulasan anda"
  maxLength={1000}
/>`}
          </pre>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Large textarea for detailed reviews</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Character counter (live update)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Customizable max length</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Focus state with pink border and shadow</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Warning when max length reached</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Fully responsive design</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Controlled or uncontrolled component</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
