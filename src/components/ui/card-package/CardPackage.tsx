import React, { JSX } from 'react';
import { Bookmark } from 'lucide-react';
import Button from '../button/Button';

export interface TravelCardProps {
  title?: string;
  subtitle?: string;
  country?: string;
  airline?: string;
  dateRange?: string;
  price?: string;
  priceLabel?: string;
  imageUrl?: string;
  buttonText?: string;
  onDetailsClick?: () => void;
  onBookmarkClick?: () => void;
  className?: string;
  variant?:
    | 'simple'
    | 'detailed'
    | 'compact-bookmark'
    | 'compact-button'
    | 'minimal-text'
    | 'minimal-simple';
  showLocation?: boolean;
  showAirline?: boolean;
  showDate?: boolean;
  isBookmarked?: boolean;
}

const CardPackage = ({
  title = 'Korea Halal Tour',
  subtitle,
  country = 'Korea Selatan',
  airline = 'Garuda Indonesia',
  dateRange = 'Januari - Februari 2026',
  price = 'Rp14.000.000',
  priceLabel = 'Mulai dari',
  imageUrl = 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400',
  buttonText = 'Details',
  onDetailsClick,
  onBookmarkClick,
  className = '',
  variant = 'detailed',
  showLocation = true,
  showAirline = true,
  showDate = true,
  isBookmarked = false,
}: TravelCardProps): JSX.Element => {
  // Variant 1: Compact with Bookmark (Image 1)
  if (variant === 'compact-bookmark') {
    return (
      <div
        className={`flex flex-col w-[350px] items-start gap-[9px] pt-[19px] pb-2 px-[17px] bg-white rounded-[15px] shadow-lg ${className}`}
      >
        {/* Image Section */}
        <div className="flex flex-col w-[320px] h-48 items-start gap-2.5">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-120 transition-transform duration-300 cursor-zoom-in"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col items-start justify-end self-stretch w-full flex-[0_0_auto]">
          {/* Location */}
          {showLocation && (
            <div className="flex items-center gap-2 mb-3 px-2.5">
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                  stroke="#666666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                  stroke="#666666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-base text-gray-700">{country}</span>
            </div>
          )}

          {/* Titles and Bookmark Row */}
          <div className="flex items-start justify-between self-stretch w-full px-2.5">
            <div className="flex flex-col flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {title}
              </h3>
              <p className="text-lg font-medium text-gray-800">
                {subtitle || dateRange}
              </p>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={onBookmarkClick}
              className="w-14 h-14 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-colors flex-shrink-0 ml-4"
              type="button"
              aria-label="Bookmark"
            >
              <Bookmark
                className="w-6 h-6 text-white"
                fill={isBookmarked ? 'white' : 'none'}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Variant 2: Compact with Button (Image 2)
  if (variant === 'compact-button') {
    return (
      <div
        className={`flex flex-col w-[350px] items-start gap-[9px] pt-[19px] pb-2 px-[17px] bg-white rounded-[15px] shadow-lg ${className}`}
      >
        {/* Image Section */}
        <div className="flex flex-col w-full h-48 items-start gap-2.5">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-120 transition-transform duration-300 cursor-zoom-in"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col items-start justify-end self-stretch w-full flex-[0_0_auto]">
          {/* Location */}
          {showLocation && (
            <div className="flex items-center gap-2 mb-3 px-2.5">
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                  stroke="#666666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                  stroke="#666666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-base text-gray-700">{country}</span>
            </div>
          )}

          {/* Titles and Button Row */}
          <div className="flex items-center justify-between self-stretch w-full px-2.5">
            <div className="flex flex-col flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {title}
              </h3>
              <p className="text-lg font-medium text-gray-800">
                {subtitle || dateRange}
              </p>
            </div>

            {/* Details Button */}
            <Button
              onClick={onDetailsClick}
              variant="light-purple-hover-dark-purple"
              type="button"
              className="w-[130px]! h-[49px]! ml-4!"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Variant 3: Minimal with Text (Image 3)
  if (variant === 'minimal-text') {
    return (
      <div
        className={`flex flex-col w-[350px] items-start gap-[9px] pt-[19px] pb-2 px-[17px] bg-white rounded-[15px] shadow-lg cursor-pointer hover:shadow-xl transition-shadow ${className}`}
        onClick={onDetailsClick}
      >
        {/* Image Section */}
        <div className="flex flex-col w-[320px] h-48 items-start gap-2.5">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-120 transition-transform duration-300 cursor-zoom-in"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col items-start justify-end self-stretch w-full flex-[0_0_auto] p-2.5">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-lg font-medium text-gray-700">
            {subtitle || dateRange}
          </p>
        </div>
      </div>
    );
  }

  // Variant 4: Minimal Simple (Image 4)
  if (variant === 'minimal-simple') {
    return (
      <div
        className={`flex flex-col w-[350px] items-start gap-[9px] pt-[19px] pb-2 px-[17px] bg-white rounded-[15px] shadow-lg cursor-pointer hover:shadow-xl transition-shadow ${className}`}
        onClick={onDetailsClick}
      >
        {/* Image Section */}
        <div className="flex flex-col w-[320px] h-48 items-start gap-2.5">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-120 transition-transform duration-300 cursor-zoom-in"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col items-start justify-end self-stretch w-full flex-[0_0_auto] p-2.5">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-lg font-medium text-gray-700">
            {subtitle || dateRange}
          </p>
        </div>
      </div>
    );
  }

  // Simple variant (existing)
  if (variant === 'simple') {
    return (
      <div
        className={`flex flex-col w-[350px] items-start gap-[9px] pt-[19px] pb-2 px-[17px] bg-white rounded-[15px] shadow-lg cursor-pointer hover:shadow-xl transition-shadow ${className}`}
        onClick={onDetailsClick}
      >
        <div className="flex flex-col w-[320px] h-48 items-start gap-2.5">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-120 transition-transform duration-300 cursor-zoom-in"
            />
          </div>
        </div>
        <div className="flex flex-col items-start justify-end self-stretch w-full flex-[0_0_auto] p-2.5">
          {subtitle && <p className="text-sm text-gray-600 mb-1">{subtitle}</p>}
          <h3 className="text-lg font-semibold text-[#444444]">{title}</h3>
        </div>
      </div>
    );
  }

  // Detailed variant (existing - matching the reference style exactly)
  return (
    <div
      className={`flex flex-col w-[350px] h-full items-start gap-[9px] pt-[19px] pb-2 px-[17px] bg-white rounded-[15px] shadow-lg ${className}`}
    >
      {/* Image Section */}
      <div className="flex flex-col w-[320px] h-48 items-start gap-2.5 flex-shrink-0">
        <div className="w-full h-full rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-120 transition-transform duration-300 cursor-zoom-in"
          />
        </div>
      </div>

      {/* Content Section - Flex grow untuk button alignment */}
      <div className="flex flex-col items-start self-stretch w-full flex-1 mb-[-5.00px]">
        {/* Title */}
        <div className="flex items-center gap-2.5 p-2.5 self-stretch w-full flex-[0_0_auto]">
          <div className="flex-1 mt-[-1.00px] font-semibold text-xl text-[#444444]">
            {title}
          </div>
        </div>

        {/* Details Section - Flex grow untuk push footer ke bawah */}
        <div className="flex flex-col items-start gap-3 self-stretch w-full flex-1">
          <div className="flex flex-col items-start gap-[3px] self-stretch w-full flex-[0_0_auto]">
            {/* Location */}
            {showLocation && (
              <div className="flex items-center gap-2 self-stretch w-full px-2 py-1">
                <svg
                  className="w-6 h-6 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                    stroke="#C0BFBF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                    stroke="#C0BFBF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium text-base text-slate-600">
                  {country}
                </span>
              </div>
            )}

            {/* Airline */}
            {showAirline && airline && (
              <div className="flex items-center gap-2 self-stretch w-full px-2 py-1">
                <svg
                  className="w-6 h-6 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <path
                    d="M32.3562 16.1969L29.9604 12.4613C29.7593 12.1467 29.4793 11.9037 29.1395 11.7488C28.7996 11.5939 28.4079 11.5307 27.9908 11.5635L9.95876 12.6979L7.7475 10.5326C7.6193 10.4103 7.44343 10.3468 7.24473 10.3511C7.04602 10.3553 6.83452 10.4271 6.64008 10.5563C6.44564 10.6854 6.2781 10.8655 6.1611 11.0709C6.0441 11.2764 5.98356 11.4969 5.98803 11.7014L6.13408 16.1188C6.13589 16.1922 6.15672 16.2581 6.19458 16.3101C6.23245 16.3622 6.28607 16.3987 6.35032 16.4161C7.29316 16.6402 11.2169 17.0003 15.9165 17.3542L9.56121 25.8193C9.50606 25.8925 9.46742 25.9746 9.44943 26.0567C9.43144 26.1389 9.4348 26.2179 9.45914 26.2854C9.48348 26.3528 9.52788 26.4061 9.58754 26.4394C9.64721 26.4727 9.71988 26.4849 9.79772 26.4746L12.325 26.1434C12.4639 26.1246 12.6067 26.0551 12.7284 25.9472L21.9355 17.7977C25.3124 18.0349 28.5552 18.2407 30.8424 18.3814C31.0762 18.4001 31.3322 18.3382 31.5757 18.2041C31.8192 18.07 32.0384 17.8702 32.2036 17.6318C32.3689 17.3933 32.4721 17.1278 32.4994 16.8712C32.5267 16.6145 32.4767 16.3791 32.3562 16.1969Z"
                    fill="#C0BFBF"
                  />
                  <path
                    d="M9.78073 6.76023L11.9646 10.0909L17.1054 10.5994L12.4308 6.76017C12.3844 6.72319 12.3291 6.69901 12.2708 6.69014L10.1219 6.24578C10.0559 6.23105 9.98738 6.2363 9.92527 6.26087C9.86317 6.28544 9.81033 6.32819 9.77358 6.3836C9.73683 6.43901 9.71787 6.50452 9.71914 6.57167C9.72042 6.63881 9.74187 6.7045 9.78073 6.76023Z"
                    fill="#C0BFBF"
                  />
                </svg>
                <span className="font-medium text-base text-slate-600">
                  {airline}
                </span>
              </div>
            )}

            {/* Date */}
            {showDate && dateRange && (
              <div className="flex items-center gap-2 self-stretch w-full px-2 py-1">
                <svg
                  className="w-6 h-6 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M16 2V6M8 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
                    stroke="#C0BFBF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium text-base text-slate-600">
                  {dateRange}
                </span>
              </div>
            )}
          </div>

          {/* Spacer untuk push footer ke bawah */}
          <div className="flex-1" />

          {/* Footer Section - Always at bottom */}
          <div className="flex flex-col items-start gap-1 self-stretch w-full flex-[0_0_auto]">
            {/* Divider */}
            <div className="flex flex-col items-start gap-2.5 p-2.5 self-stretch w-full flex-[0_0_auto]">
              <div className="w-full h-px bg-gray-200 mb-[-1.00px]" />
            </div>

            {/* Price and Button Row */}
            <div className="flex items-center justify-between self-stretch w-full flex-[0_0_auto] px-2 mb-2">
              {/* Price Section */}
              <div className="flex flex-col items-start">
                <div className="font-medium text-sm text-[#444444]">
                  {priceLabel}
                </div>
                <div className="font-semibold text-xl text-[#444444]">
                  {price}
                </div>
              </div>

              {/* Button */}
              <Button
                className="flex w-[110px]! h-[40px]! items-center justify-center rounded-[10px] transition-colors cursor-pointer mb-2"
                onClick={onDetailsClick}
                type="button"
                variant="light-purple-hover-dark-purple"
              >
                <span className="font-semibold text-sm text-white whitespace-nowrap">
                  {buttonText}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPackage;

// Demo Component
export function CardDemo() {
  const [bookmarked, setBookmarked] = React.useState<Record<string, boolean>>(
    {}
  );

  const handleDetailsClick = (title: string) => {
    alert(`Details clicked for: ${title}`);
  };

  const handleBookmarkClick = (id: string) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Travel CardPackage Variants
        </h1>
        <p className="text-gray-600 mb-8">
          6 different card styles for your travel app
        </p>

        {/* Variant 1 & 2: Compact Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Compact Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardPackage
              variant="compact-bookmark"
              title="Lorem ipsum"
              subtitle="Lorem ipsum dolor"
              country="Lorem ipsum"
              imageUrl="https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600"
              onDetailsClick={() => handleDetailsClick('Compact Bookmark')}
              onBookmarkClick={() => handleBookmarkClick('card1')}
              isBookmarked={bookmarked['card1']}
            />
            <CardPackage
              variant="compact-button"
              title="Lorem ipsum"
              subtitle="Lorem ipsum dolor"
              country="Lorem ipsum"
              imageUrl="https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600"
              buttonText="Details"
              onDetailsClick={() => handleDetailsClick('Compact Button')}
            />
          </div>
        </div>

        {/* Variant 3 & 4: Minimal Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Minimal Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardPackage
              variant="minimal-text"
              title="Lorem ipsum"
              subtitle="Lorem ipsum dolor"
              imageUrl="https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600"
              onDetailsClick={() => handleDetailsClick('Minimal Text')}
            />
            <CardPackage
              variant="minimal-simple"
              title="Lorem ipsum"
              subtitle="Lorem ipsum dolor"
              imageUrl="https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600"
              onDetailsClick={() => handleDetailsClick('Minimal Simple')}
            />
          </div>
        </div>

        {/* Original Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Original Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardPackage
              variant="detailed"
              onDetailsClick={() => handleDetailsClick('Korea Halal Tour')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
