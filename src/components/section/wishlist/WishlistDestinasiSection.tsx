import React from 'react';
import CardPackage from '../../ui/card-package/CardPackage';
import type { WishlistItem } from '@api/wishlist';

interface WishlistDestinasiSectionProps {
  wishlistItems: WishlistItem[];
  loading?: boolean;
  onRemove: (id: string) => void;
  onDetailsClick?: (id: string) => void;
}

export default function WishlistDestinasiSection({
  wishlistItems,
  loading = false,
  onRemove,
  onDetailsClick,
}: WishlistDestinasiSectionProps) {
  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-xl font-medium text-gray-500">Memuat wishlist...</p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-xl font-medium text-gray-500">
          Belum ada destinasi pada wishlist Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 mobile:grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile:gap-4 xs:gap-4 sm:gap-5 md:gap-6">
      {wishlistItems.map((item) => (
        <div key={item.id} className="w-full flex justify-center">
          <CardPackage
            variant="compact-bookmark"
            title={item.tour_package.title}
            country={item.tour_package.destination_country}
            price={formatPrice(item.tour_package.price_per_pax)}
            imageUrl={item.tour_package.thumbnail_url}
            isBookmarked={true}
            onBookmarkClick={() => onRemove(item.id)}
            onDetailsClick={() => onDetailsClick?.(item.tour_package.id)}
            className="w-full max-w-[380px]"
          />
        </div>
      ))}
    </div>
  );
}
