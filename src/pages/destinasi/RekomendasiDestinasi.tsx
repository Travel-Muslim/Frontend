import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/section/header/Header';
import Footer from '@/components/section/footer/Footer';
import HeroRekomendasiDestinasiSection from '@/components/section/rekomendasi-destinasi/HeroRekomendasiDestinasiSection';
import RekomendasiDestinasiSection from '@/components/section/rekomendasi-destinasi/RekomendasiDestinasiSection';
import { fetchPackages, PackageDetail } from '@/api/packages';
import { pushRecentDestination } from '@/utils/recentDestinations';
import { RekomendasiPaketImage } from '@/assets/images';

type Region = 'asia' | 'eropa' | 'amerika' | 'afrika';

const REGION_MAP: Record<Region, string> = {
  asia: 'Asia',
  eropa: 'Eropa',
  amerika: 'Amerika',
  afrika: 'Afrika',
};

export default function RekomendasiPaket() {
  const [selectedRegion, setSelectedRegion] = useState<Region>('asia');
  const [packages, setPackages] = useState<PackageDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch packages from API
  useEffect(() => {
    const loadPackages = async () => {
      setLoading(true);
      try {
        const data = await fetchPackages();
        setPackages(data);
      } catch (error) {
        console.error('Error loading packages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  // Filter packages by selected region
  const filteredPackages = useMemo(() => {
    if (!packages.length) return [];

    const regionName = REGION_MAP[selectedRegion];
    return packages.filter(
      (pkg) =>
        pkg.continent?.toLowerCase() === regionName.toLowerCase() ||
        pkg.location?.toLowerCase().includes(regionName.toLowerCase())
    );
  }, [packages, selectedRegion]);

  // Split filtered packages into favorite (first 3) and popular (next 3)
  const favoritePackages = useMemo(
    () => filteredPackages.slice(0, 3),
    [filteredPackages]
  );

  const popularPackages = useMemo(
    () => filteredPackages.slice(3, 6),
    [filteredPackages]
  );

  const handleDetailsClick = (id: string | number) => {
    // Find the package to add to recent destinations
    const selectedPackage = packages.find((pkg) => pkg.id === id);
    if (selectedPackage) {
      pushRecentDestination({
        id: selectedPackage.id,
        title: selectedPackage.title,
        location: selectedPackage.location,
        image: selectedPackage.image || '',
      });
    }
    navigate(`/detail-paket/${id}`);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region as Region);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Hero Section with Region Tabs */}
      <HeroRekomendasiDestinasiSection
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
        backgroundImage={RekomendasiPaketImage}
        // backgroundImage="https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200"
      />

      {/* Main Content with Package Cards */}
      <RekomendasiDestinasiSection
        favoritePackages={favoritePackages}
        popularPackages={popularPackages}
        loading={loading}
        onPackageClick={handleDetailsClick}
      />
    </div>
  );
}
