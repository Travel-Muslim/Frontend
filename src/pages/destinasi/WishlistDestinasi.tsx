import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WishlistDestinasiSection from '@components/section/wishlist/WishlistDestinasiSection';
import HistoryDestinasiSection from '@components/section/wishlist/HistoryDestinasiSection';
import PopupNotifikasi from '@components/ui/popup-notifikasi/PopupNotifikasi';
import { fetchWishlist, removeFromWishlist } from '@api/wishlist';
import { fetchPackages } from '@api/packages';
import { readRecentDestinations } from '@utils/recentDestinations';
import type { WishlistItem } from '@api/wishlist';
import type { PackageDetail } from '@api/packages';

export default function WishlistDestinasi() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'wishlist' | 'recent'>(
    'wishlist'
  );
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [recentPackages, setRecentPackages] = useState<PackageDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    loadWishlist();
    loadRecentDestinations();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const data = await fetchWishlist();
      setWishlistItems(data);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentDestinations = async () => {
    try {
      // Get recent destination IDs from localStorage
      const recentDests = readRecentDestinations();

      if (recentDests.length === 0) {
        setRecentPackages([]);
        return;
      }

      // Fetch all packages and filter by recent IDs
      const allPackages = await fetchPackages(3);
      const recentIds = recentDests.map((d) => d.id);
      const filteredPackages = allPackages.filter((pkg) =>
        recentIds.includes(pkg.id)
      );

      setRecentPackages(filteredPackages.slice(0, 6));
    } catch (error) {
      console.error('Failed to load recent destinations:', error);
      setRecentPackages([]);
    }
  };

  const handleRemoveWishlist = async (id: string) => {
    try {
      await removeFromWishlist(id);
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      setAlertVisible(true);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleDetailsClick = (id: string) => {
    navigate(`/detail-paket/${id}`);
  };

  const isWishlistActive = activeSection === 'wishlist';

  return (
    <>
      <div className="min-h-screen bg-orange-50 pt-24 mobile:pt-20 xs:pt-20 sm:pt-24 pb-20 mobile:pb-16 xs:pb-16">
        <div className="max-w-[1200px] mx-auto px-5 mobile:px-4 xs:px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-12 lg:mt-20 md:mt-15 mobile:mt-15 mobile:mb-8 xs:mt-12 xs:mb-8 sm:mt-12 sm:mb-10">
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold text-[#444444] mb-2">
              Wishlist
            </h1>
          </div>

          {/* Section Headers */}
          <div className="flex items-center mb-8 mobile:mb-6 xs:mb-6 gap-0">
            <button
              onClick={() => setActiveSection('wishlist')}
              type="button"
              className="flex flex-col flex-1 items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="inline-flex items-center justify-center gap-2.5 p-2.5 mobile:p-1.5 xs:p-1.5">
                <h2
                  className={`text-[clamp(1.125rem,3vw,1.5rem)] font-bold ${
                    isWishlistActive ? 'text-slate-600' : 'text-[#a0a0a0]'
                  }`}
                >
                  Wishlist Destinasi
                </h2>
              </div>
              <div className="flex flex-col items-start gap-2.5 p-2.5 mobile:p-1.5 xs:p-1.5 w-full">
                <div
                  className={`w-full h-px ${
                    isWishlistActive ? 'bg-slate-600' : 'bg-gray-300'
                  }`}
                />
              </div>
            </button>

            <button
              onClick={() => setActiveSection('recent')}
              type="button"
              className="flex flex-col flex-1 items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="inline-flex items-center justify-center gap-2.5 p-2.5 mobile:p-1.5 xs:p-1.5">
                <h2
                  className={`text-[clamp(1.125rem,3vw,1.5rem)] font-bold ${
                    !isWishlistActive ? 'text-slate-600' : 'text-[#a0a0a0]'
                  }`}
                >
                  Destinasi Terakhir Dilihat
                </h2>
              </div>
              <div className="flex flex-col items-start gap-2.5 p-2.5 mobile:p-1.5 xs:p-1.5 w-full">
                <div
                  className={`w-full h-px ${
                    !isWishlistActive ? 'bg-slate-600' : 'bg-gray-300'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Content Sections */}
          {isWishlistActive ? (
            <WishlistDestinasiSection
              wishlistItems={wishlistItems}
              loading={loading}
              onRemove={handleRemoveWishlist}
              onDetailsClick={handleDetailsClick}
            />
          ) : (
            <HistoryDestinasiSection
              packages={recentPackages}
              loading={loading}
              onDetailsClick={handleDetailsClick}
            />
          )}
        </div>
      </div>

      {/* Success Alert Modal */}
      <PopupNotifikasi
        variant="success"
        title="Berhasil Menghapus Wishlist"
        description="Wishlist destinasi Anda berhasil dihapus"
        buttonText="Oke"
        isOpen={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
    </>
  );
}
