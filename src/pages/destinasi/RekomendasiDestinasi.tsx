import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    const loadPackages = async () => {
      setLoading(true);
      try {
        const data = await fetchPackages(100);
        setPackages(data);
      } catch (error) {
        console.error('Error loading packages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  const filteredPackages = useMemo(() => {
    if (!packages.length) {
      return [];
    }

    const regionName = REGION_MAP[selectedRegion];

    const filtered = packages.filter((pkg) => {
      const continent = pkg.benua?.toLowerCase() || '';
      const location = pkg.location?.toLowerCase() || '';
      const regionLower = regionName.toLowerCase();

      const continentMatch = continent === regionLower;
      const locationMatch = location.includes(regionLower);

      return continentMatch || locationMatch;
    });

    return filtered;
  }, [packages, selectedRegion]);

  const { favoritePackages, popularPackages } = useMemo(() => {
    if (!filteredPackages.length) {
      return { favoritePackages: [], popularPackages: [] };
    }

    const shuffled = [...filteredPackages].sort(() => Math.random() - 0.5);

    const fav = shuffled.slice(0, 3);
    const pop = shuffled.slice(3, 6);

    return {
      favoritePackages: fav,
      popularPackages: pop,
    };
  }, [filteredPackages]);

  const handleDetailsClick = (pkg: PackageDetail) => {
    pushRecentDestination({
      id: pkg.id,
      name: pkg.name,
      location: pkg.location,
      image: pkg.image || '',
    });
    navigate(`/destinasi/${pkg.id}`);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region as Region);
  };

  return (
    <>
      <div className="min-h-screen bg-orange-50">
        {/* Hero Section with Region Tabs */}
        <HeroRekomendasiDestinasiSection
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
          backgroundImage={RekomendasiPaketImage}
        />

        {/* Main Content with Package Cards */}
        <RekomendasiDestinasiSection
          favoritePackages={favoritePackages}
          popularPackages={popularPackages}
          loading={loading}
          onPackageClick={handleDetailsClick}
        />
      </div>
    </>
  );
}
