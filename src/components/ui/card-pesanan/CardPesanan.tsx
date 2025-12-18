import PropTypes from 'prop-types';
import React from 'react';
import { Bookmark } from 'lucide-react';
import Button from '../button/Button';

interface CardBsProps {
  id?: string;
  image?: string;
  title?: string;
  location?: string;
  date?: string;
  airline?: string;
  airport?: string;
  status?: string;
  price?: string;
  variant?: 'with-review' | 'with-detail' | 'with-booking';
  onDetailClick?: (id: string) => void;
  onReviewClick?: (id: string) => void;
  onBookingClick?: (id: string) => void;
  onWishlistClick?: (id: string) => void;
  onContactClick?: (id: string) => void;
  isWishlisted?: boolean;
  showDetailButton?: boolean;
  showReviewButton?: boolean;
  className?: string;
  locationIcon?: string;
  periodIcon?: string;
  airlineIcon?: string;
  airportIcon?: string;
}
const CardBs: React.FC<CardBsProps> = ({
  id = '1',
  image = 'image.png',
  title = 'Korea Halal Tour',
  location = 'Korea Selatan',
  date = '10, 20, dan 30 Desember 2025',
  airline = 'Garuda Indonesia',
  airport = 'Soekarno-Hatta International Airport (CGK)',
  status = 'Selesai',
  price = 'Rp 14.000.000 / pax',
  variant = 'with-detail',
  onDetailClick,
  onReviewClick,
  onBookingClick,
  onWishlistClick,
  onContactClick,
  isWishlisted = false,
  showDetailButton = true,
  showReviewButton = false,
  className = '',
  locationIcon = 'vector.svg',
  periodIcon = 'image.svg',
  airlineIcon = 'vector-2.svg',
  airportIcon = 'vector-3.svg',
}) => {
  return (
    <div
      className={`flex flex-col lg:flex-row w-full max-w-[1200px] mx-auto items-center gap-4 sm:gap-5 lg:gap-10 p-3 sm:p-4 lg:p-8 relative bg-white rounded-[18px] border-2 border-solid border-[#ffb4c4] ${className}`}
    >
      {/* Image Section */}
      <div className="flex flex-col w-full lg:w-[420px] xl:w-[460px] h-[200px] sm:h-[240px] lg:h-[340px] xl:h-[360px] items-start relative shrink-0">
        <div className="relative w-full h-full shadow-[0px_3.14px_4.71px_-1.57px_#0a0d1208,0px_9.42px_12.57px_-3.14px_#0a0d1214] rounded-[14px] overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col w-full lg:flex-1 items-start gap-3 sm:gap-4 relative">
        <div className="flex flex-col items-start gap-2.5 sm:gap-3 relative self-stretch w-full">
          {/* Title and Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 relative self-stretch w-full">
            <div className="flex items-center gap-2 px-0 py-1.5 relative flex-1 w-full sm:w-auto">
              <div className="relative flex-1 font-bold text-base sm:text-lg lg:text-2xl text-[#444444] leading-tight">
                {title}
              </div>
            </div>
            {status && variant !== 'with-booking' && (
              <div className="flex w-full sm:w-auto sm:min-w-[140px] lg:min-w-[160px] justify-center px-3 py-2 lg:py-2.5 bg-white rounded-[10px] border border-solid border-[#34e43b] items-center relative shrink-0">
                <div className="inline-flex gap-2 p-1 lg:p-1.5 items-center relative">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-4 h-4 lg:w-5 lg:h-5"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="#34E43C"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="relative w-fit font-medium text-black text-sm lg:text-lg tracking-[0] leading-[normal] whitespace-nowrap">
                  {status}
                </div>
              </div>
            )}
          </div>

          {/* Location Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 relative self-stretch w-full">
            <div className="flex w-full sm:w-[150px] items-center gap-2 relative shrink-0">
              <div className="relative w-5 h-6 sm:w-6 sm:h-7 aspect-[0.68]">
                {/* Location Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="35"
                  viewBox="0 0 24 35"
                  fill="none"
                >
                  <path
                    d="M11.7804 16.4578C10.6645 16.4578 9.59438 16.0015 8.80536 15.1893C8.01635 14.3771 7.57308 13.2755 7.57308 12.1268C7.57308 10.9782 8.01635 9.87657 8.80536 9.06434C9.59438 8.25212 10.6645 7.79582 11.7804 7.79582C12.8962 7.79582 13.9663 8.25212 14.7553 9.06434C15.5444 9.87657 15.9876 10.9782 15.9876 12.1268C15.9876 12.6956 15.8788 13.2588 15.6674 13.7842C15.4559 14.3097 15.146 14.7871 14.7553 15.1893C14.3647 15.5915 13.9009 15.9105 13.3904 16.1282C12.88 16.3458 12.3329 16.4578 11.7804 16.4578ZM11.7804 0C8.65601 0 5.65963 1.27764 3.45038 3.55187C1.24114 5.82609 0 8.9106 0 12.1268C0 21.222 11.7804 34.6481 11.7804 34.6481C11.7804 34.6481 23.5607 21.222 23.5607 12.1268C23.5607 8.9106 22.3196 5.82609 20.1103 3.55187C17.9011 1.27764 14.9047 0 11.7804 0Z"
                    fill="#444444"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 px-1.5 py-0 relative">
                <div className="relative font-semibold text-sm sm:text-base lg:text-xl text-[#444444]">
                  Lokasi
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 relative flex-1 pl-6 sm:pl-0">
              <div className="relative w-fit font-semibold text-sm sm:text-base lg:text-xl text-[#444444]">
                {location}
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="flex flex-col items-start gap-3 sm:gap-4 lg:gap-5 relative self-stretch w-full">
          <div className="flex flex-col items-start relative self-stretch w-full">
            {/* Periode Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2.5 sm:py-3 px-0 relative self-stretch w-full border-t [border-top-style:solid] border-b [border-bottom-style:solid] border-[#d0d0d0]">
              <div className="flex w-full sm:w-[150px] items-center relative shrink-0">
                <div className="flex flex-col w-7 sm:w-8 items-start gap-0.5 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="31"
                    height="28"
                    viewBox="0 0 31 28"
                    fill="none"
                  >
                    <path
                      d="M15.2005 0C23.5957 0 30.4009 6.14667 30.4009 13.7294C30.4009 21.3122 23.5957 27.4589 15.2005 27.4589C6.80524 27.4589 0 21.3122 0 13.7294C0 6.14667 6.80524 0 15.2005 0ZM15.2005 5.49178C14.7973 5.49178 14.4107 5.63643 14.1256 5.8939C13.8406 6.15138 13.6804 6.50059 13.6804 6.86472V13.7294C13.6805 14.0935 13.8407 14.4427 14.1258 14.7001L18.6859 18.8189C18.9726 19.069 19.3566 19.2074 19.7551 19.2043C20.1537 19.2012 20.5349 19.0568 20.8167 18.8022C21.0986 18.5477 21.2584 18.2033 21.2619 17.8433C21.2654 17.4834 21.1121 17.1365 20.8353 16.8776L16.7205 13.161V6.86472C16.7205 6.50059 16.5604 6.15138 16.2753 5.8939C15.9902 5.63643 15.6036 5.49178 15.2005 5.49178Z"
                      fill="#444444"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0 relative">
                  <div className="relative w-fit font-semibold text-sm sm:text-base lg:text-xl text-[#444444] whitespace-nowrap">
                    Periode
                  </div>
                </div>
              </div>
              <div className="flex gap-2 px-2 sm:px-0 py-0 flex-1 items-center relative">
                <p className="relative w-fit font-medium text-xs sm:text-sm lg:text-lg text-[#666666] m-0">
                  {date}
                </p>
              </div>
            </div>

            {/* Maskapai Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-0 py-2.5 sm:py-3 relative self-stretch w-full border-b [border-bottom-style:solid] border-[#d0d0d0]">
              <div className="flex w-full sm:w-[150px] items-center relative shrink-0">
                <div className="flex flex-col w-7 sm:w-8 h-5 sm:h-6 items-start gap-0.5 px-0 py-0.5 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="20"
                    viewBox="0 0 32 20"
                    fill="none"
                  >
                    <path
                      d="M30.3178 1.09657L24.7431 0.0652506C24.2743 -0.0219746 23.789 -0.0217471 23.3203 0.0659178C22.8516 0.153583 22.4104 0.326633 22.0266 0.573326L5.18752 11.0609L1.14367 10.9092C0.912041 10.9025 0.683792 10.9583 0.491149 11.0687C0.298507 11.1791 0.151205 11.3386 0.0700425 11.5246C-0.0111199 11.7107 -0.022042 11.9139 0.0388185 12.1055C0.0996791 12.2972 0.229247 12.4676 0.409228 12.5927L4.34689 15.2696C4.41172 15.3144 4.48888 15.3442 4.57099 15.3562C4.6531 15.3681 4.73742 15.3618 4.81587 15.3378C5.93965 14.9663 10.1251 13.0629 15.0715 10.7348L16.0625 19.4631C16.071 19.5387 16.1033 19.6109 16.1561 19.6719C16.2088 19.7329 16.28 19.7804 16.362 19.8093C16.4439 19.8381 16.5335 19.8473 16.6211 19.8357C16.7087 19.8242 16.7909 19.7923 16.8589 19.7437L19.0711 18.1664C19.1922 18.0793 19.2737 17.9585 19.3012 17.8251L21.3983 7.74704C24.9378 6.06357 28.318 4.43318 30.6983 3.28053C30.9453 3.16534 31.145 2.98786 31.2704 2.77214C31.3958 2.55642 31.4408 2.31288 31.3992 2.07452C31.3577 1.83616 31.2317 1.6145 31.0382 1.43957C30.8448 1.26464 30.5933 1.1449 30.3178 1.09657Z"
                      fill="#444444"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0 relative">
                  <div className="relative w-fit font-semibold text-sm sm:text-base lg:text-xl text-[#444444] whitespace-nowrap">
                    Maskapai
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 sm:px-0 py-0 relative flex-1">
                <div className="relative w-fit font-medium text-xs sm:text-sm lg:text-lg text-[#666666]">
                  {airline}
                </div>
              </div>
            </div>

            {/* Bandara Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-0 py-2.5 sm:py-3 relative self-stretch w-full border-b [border-bottom-style:solid] border-[#d0d0d0]">
              <div className="flex w-full sm:w-[150px] items-center gap-1.5 relative shrink-0">
                <div className="flex items-center gap-0.5 px-0 py-0 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M10.4914 11.3894V20.5009H26.2284C26.8159 20.5009 27.2775 21.002 27.2775 21.6398V31.8902H0V21.6398C0 21.002 0.46162 20.5009 1.04914 20.5009H4.19655V11.3894H2.9166C2.434 11.3894 2.01434 11.0249 1.90943 10.5238L0.335724 3.69016C0.188845 3.07513 0.524568 2.4601 1.0911 2.30065C1.17503 2.30065 1.25896 2.27787 1.34289 2.27787H5.24568L4.57424 0.820035C4.51527 0.686728 4.50639 0.533751 4.54947 0.393462C4.59254 0.253174 4.6842 0.136577 4.80505 0.0683362C4.87725 0.0297494 4.9556 0.00655174 5.03586 0L9.65206 0C9.92483 0 10.1766 0.250566 10.1766 0.569469C10.1766 0.660584 10.1556 0.751699 10.1137 0.820035L9.44223 2.27787H13.345C13.9325 2.27787 14.3942 2.77901 14.3942 3.41681C14.3942 3.50793 14.3732 3.59904 14.3522 3.69016L12.7785 10.5238C12.6736 11.0249 12.2539 11.3894 11.7713 11.3894H10.4914ZM8.39309 22.7787H2.09827V25.0566H8.39309V22.7787ZM16.7862 22.7787H10.4914V25.0566H16.7862V22.7787ZM25.1793 22.7787H18.8845V25.0566H25.1793V22.7787ZM8.39309 27.3345H2.09827V29.6124H8.39309V27.3345ZM16.7862 27.3345H10.4914V29.6124H16.7862V27.3345ZM25.1793 27.3345H18.8845V29.6124H25.1793V27.3345ZM2.68579 4.55575L3.73493 9.1115H10.953L12.0021 4.55575H2.68579ZM11.8972 14.3051L12.6106 13.7811C12.8624 13.6217 13.1352 13.5761 13.408 13.6217L15.8839 14.2139L18.9894 12.0044L15.6741 9.88598C15.5598 9.80505 15.4786 9.67945 15.4473 9.53523C15.416 9.39101 15.4372 9.23927 15.5062 9.1115C15.5482 9.04316 15.5902 8.97483 15.6741 8.92927L16.9331 8.0409C17.059 7.94978 17.2058 7.927 17.3317 7.94978L22.9341 9.24817L25.2422 7.6081C26.711 6.56028 28.5155 6.28693 30.1941 6.83362L30.6558 6.9703C31.2223 7.15253 31.537 7.79033 31.3692 8.40536C31.2852 8.65592 31.1384 8.88371 30.9285 9.02038L17.7724 18.3141L12.0021 15.6262C11.8337 15.543 11.702 15.3915 11.6353 15.2041C11.5686 15.0168 11.5723 14.8085 11.6454 14.624C11.6874 14.4873 11.7923 14.3734 11.8972 14.3051Z"
                      fill="#444444"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0 relative">
                  <div className="relative w-auto font-semibold text-sm sm:text-base lg:text-xl text-[#444444] whitespace-nowrap">
                    Bandara
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 sm:px-0 py-0 relative flex-1">
                <div className="relative w-fit font-medium text-xs sm:text-sm lg:text-lg text-[#666666]">
                  {airport}
                </div>
              </div>
            </div>
          </div>

          {/* Price Section - Only for with-booking variant */}
          {variant === 'with-booking' && price && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-0 py-2.5 sm:py-3 relative self-stretch w-full">
              <div className="flex w-full sm:w-[150px] items-center relative shrink-0">
                <div className="flex items-center gap-1.5 px-2 py-0 relative">
                  <div className="relative w-fit font-bold text-sm sm:text-base lg:text-xl text-[#444444] whitespace-nowrap">
                    Harga
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 sm:px-0 py-0 relative flex-1">
                <div className="relative w-fit font-bold text-sm sm:text-base lg:text-xl text-[#444444]">
                  {price}
                </div>
              </div>
            </div>
          )}

          {/* Button Section */}
          {variant === 'with-review' && (
            <div className="w-full">
              <Button
                variant="light-teal-hover-dark-teal"
                onClick={() => onReviewClick?.(id)}
                className="w-full h-12 sm:h-14"
              >
                Tambahkan Ulasan
              </Button>
            </div>
          )}

          {variant === 'with-detail' && (
            <div className="w-full">
              <Button
                variant="light-pink-hover-dark-pink"
                onClick={() => onDetailClick?.(id)}
                className="w-full h-12 sm:h-14"
              >
                Lihat Detail Tiket
              </Button>
            </div>
          )}

          {variant === 'with-booking' && (
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="flex-1">
                <Button
                  variant="light-teal-hover-dark-teal"
                  onClick={() => onBookingClick?.(id)}
                  className="w-full h-12 sm:h-14"
                >
                  Booking Sekarang
                </Button>
              </div>
              <div className="flex-1">
                <Button
                  variant="dark-pink-hover-super-dark-pink"
                  onClick={() => onWishlistClick?.(id)}
                  className="w-full h-12 sm:h-14"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Bookmark
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill={isWishlisted ? 'white' : 'none'}
                    />
                    <span>Wishlist</span>
                  </div>
                </Button>
              </div>
              <div className="flex-1">
                <Button
                  variant="light-pink-hover-dark-pink"
                  onClick={() => onContactClick?.(id)}
                  className="w-full h-12 sm:h-14"
                >
                  Hubungi CS
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardBs;

// Demo Component
export function CardRiwayatPesananDemo() {
  const [wishlisted, setWishlisted] = React.useState<Record<string, boolean>>(
    {}
  );

  const handleWishlist = (id: string) => {
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
          Card Riwayat Pesanan Variants
        </h1>
        <p className="text-gray-600 mb-8">
          3 different variants for order history cards
        </p>

        {/* Variant 1: With Review Button */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
            Variant 1: With Review Button (Teal)
          </h2>
          <CardBs
            id="1"
            variant="with-review"
            image="https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600"
            title="Korea Halal Tour"
            location="Korea Selatan"
            date="10, 20, dan 30 Desember 2025"
            airline="Garuda Indonesia"
            airport="Soekarno-Hatta International Airport (GCK)"
            status="Selesai"
            onReviewClick={(id) => alert(`Review clicked for: ${id}`)}
          />
        </div>

        {/* Variant 2: With Detail Button */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
            Variant 2: With Detail Button (Pink)
          </h2>
          <CardBs
            id="2"
            variant="with-detail"
            image="https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600"
            title="Korea Halal Tour"
            location="Korea Selatan"
            date="10, 20, dan 30 Desember 2025"
            airline="Garuda Indonesia"
            airport="Soekarno-Hatta International Airport (GCK)"
            status="Selesai"
            onDetailClick={(id) => alert(`Detail clicked for: ${id}`)}
          />
        </div>

        {/* Variant 3: With Booking Buttons */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
            Variant 3: With Booking Buttons (3 Buttons)
          </h2>
          <CardBs
            id="3"
            variant="with-booking"
            image="https://images.unsplash.com/photo-1528164344705-47542687000d?w=600"
            title="Korea Halal Tour"
            location="Korea Selatan"
            date="10, 20, dan 30 Desember 2025"
            airline="Garuda Indonesia"
            airport="Soekarno-Hatta International Airport (GCK)"
            price="Rp 14.000.000 / pax"
            onBookingClick={(id) => alert(`Booking clicked for: ${id}`)}
            onWishlistClick={(id) => handleWishlist(id)}
            onContactClick={(id) => alert(`Contact CS clicked for: ${id}`)}
            isWishlisted={wishlisted['3']}
          />
        </div>

        {/* All Variants Together */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
            All Variants
          </h2>
          <div className="space-y-6">
            <CardBs
              id="4"
              variant="with-review"
              image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"
              title="Bali Paradise Tour"
              location="Bali, Indonesia"
              date="15, 22, dan 29 Januari 2026"
              airline="Lion Air"
              airport="Ngurah Rai International Airport (DPS)"
              status="Selesai"
              onReviewClick={(id) => alert(`Review clicked for: ${id}`)}
            />
            <CardBs
              id="5"
              variant="with-detail"
              image="https://images.unsplash.com/photo-1549144511-f099e773c147?w=600"
              title="Tokyo Adventure"
              location="Tokyo, Japan"
              date="5, 12, dan 19 Februari 2026"
              airline="ANA"
              airport="Narita International Airport (NRT)"
              status="Selesai"
              onDetailClick={(id) => alert(`Detail clicked for: ${id}`)}
            />
            <CardBs
              id="6"
              variant="with-booking"
              image="https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=600"
              title="Turki Heritage Tour"
              location="Istanbul, Turki"
              date="10, 17, dan 24 Maret 2026"
              airline="Turkish Airlines"
              airport="Istanbul Airport (IST)"
              price="Rp 18.500.000 / pax"
              onBookingClick={(id) => alert(`Booking clicked for: ${id}`)}
              onWishlistClick={(id) => handleWishlist(id)}
              onContactClick={(id) => alert(`Contact CS clicked for: ${id}`)}
              isWishlisted={wishlisted['6']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
