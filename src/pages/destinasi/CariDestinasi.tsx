import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { PackageDetail } from '@api/packages';
import { fetchPackages } from '@api/packages';
import Header from '@/components/section/header/Header';
import Footer from '@/components/section/footer/Footer';
import HeroCariDestinasiSection from '@/components/section/cari-destinasi/HeroCariDestinasiSection';
import CariDestinasiSection from '@/components/section/cari-destinasi/CariDestinasiSection';
import Pagination from '@/components/ui/pagination/Pagination';
import { pushRecentDestination } from '@utils/recentDestinations';
import { CariDestinasiImage } from '@/assets/images';

// ===== DATA DUMMY PACKAGES =====
// Dummy data as fallback when API returns no data
const dummyPackages: PackageDetail[] = [
  {
    id: '1',
    title: 'Korea Halal Adventure',
    location: 'Korea Selatan',
    price: 14000000,
    airline: 'Garuda Indonesia',
    period: ['15 Jan 2026', '22 Jan 2026'],
    image:
      'https://images.unsplash.com/photo-1530981754881-38f1927fbb20?w=500&h=400&fit=crop',
    airport: 'Incheon',
    description:
      'Jelajahi keindahan Korea dengan panduan halal tour profesional',
  },
  {
    id: '2',
    title: 'Dubai & Abu Dhabi Luxury',
    location: 'United Arab Emirates',
    price: 18000000,
    airline: 'Emirates',
    period: ['10 Feb 2026', '17 Feb 2026'],
    image:
      'https://images.unsplash.com/photo-1512453909124-a3500ae3015a?w=500&h=400&fit=crop',
    airport: 'Dubai International',
    description: 'Nikmati kemewahan Dubai dengan fasilitas halal terbaik',
  },
  {
    id: '3',
    title: 'Turki Heritage Tour',
    location: 'Turki',
    price: 16000000,
    airline: 'Turkish Airlines',
    period: ['20 Mar 2026', '28 Mar 2026'],
    image:
      'https://images.unsplash.com/photo-1524634126442-357e0eac5c14?w=500&h=400&fit=crop',
    airport: 'Istanbul',
    description: 'Jelajahi warisan budaya Turki dengan kemudahan halal',
  },
  {
    id: '4',
    title: 'Japan Cultural Experience',
    location: 'Jepang',
    price: 20000000,
    airline: 'Japan Airlines',
    period: ['05 Apr 2026', '14 Apr 2026'],
    image:
      'https://images.unsplash.com/photo-1522383150241-803fca64f381?w=500&h=400&fit=crop',
    airport: 'Narita',
    description: 'Rasakan keindahan budaya Jepang dengan pilihan kuliner halal',
  },
  {
    id: '5',
    title: 'Malaysia & Singapore Tour',
    location: 'Malaysia & Singapura',
    price: 12000000,
    airline: 'Malaysia Airlines',
    period: ['12 Mei 2026', '18 Mei 2026'],
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop',
    airport: 'Kuala Lumpur',
    description:
      'Petualangan singkat ke negara tetangga dengan kemudahan halal',
  },
  {
    id: '6',
    title: 'Egypt Wonders Discovery',
    location: 'Mesir',
    price: 15000000,
    airline: 'EgyptAir',
    period: ['25 Jun 2026', '02 Jul 2026'],
    image:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=400&fit=crop',
    airport: 'Cairo International',
    description:
      'Temukan keajaiban Mesir dengan pemandu berpengalaman halal tour',
  },
];

export default function CariDestinasi() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(
    searchParams.get('q') ?? searchParams.get('to') ?? ''
  );
  const [fromFilter, setFromFilter] = useState(searchParams.get('from') ?? '');
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') ?? '');
  const [packages, setPackages] = useState<PackageDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    document.title = 'Cari Destinasi | Saleema Tour';
  }, []);

  useEffect(() => {
    const incomingQ = searchParams.get('q') ?? searchParams.get('to') ?? '';
    const incomingFrom = searchParams.get('from') ?? '';
    const incomingDate = searchParams.get('date') ?? '';
    setQuery((prev) => (prev === incomingQ ? prev : incomingQ));
    setFromFilter((prev) => (prev === incomingFrom ? prev : incomingFrom));
    setDateFilter((prev) => (prev === incomingDate ? prev : incomingDate));
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPackages(100)
      .then((list) => {
        if (active) {
          // Gunakan data dari API, fallback ke dummy hanya jika error
          setPackages(list && list.length > 0 ? list : dummyPackages);
        }
      })
      .catch(() => {
        // Gunakan dummy data jika API error
        if (active) setPackages(dummyPackages);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1); // Reset ke halaman pertama saat search berubah
    const next = new URLSearchParams(searchParams);
    if (value.trim()) {
      next.set('q', value);
    } else {
      next.delete('q');
      next.delete('to');
    }
    setSearchParams(next);
  };

  const handleSearch = (value: string) => {
    handleInputChange(value);
  };

  const handlePackageClick = (pkg: PackageDetail) => {
    pushRecentDestination(pkg);
    navigate(`/destinasi/${pkg.id}`, { state: { pkg } });
  };

  const filteredPackages = useMemo(() => {
    const q = query.trim().toLowerCase();
    const from = fromFilter.trim().toLowerCase();
    const date = dateFilter.trim().toLowerCase();
    const filtered = packages.filter((pkg) => {
      const base = [pkg.title, pkg.location, pkg.airline]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const fromText =
        `${pkg.airport || ''} ${pkg.location || ''}`.toLowerCase();
      const dateMatch = (pkg.period ?? []).some((p) =>
        p.toLowerCase().includes(date)
      );
      const matchQ = q ? base.includes(q) : true;
      const matchFrom = from ? fromText.includes(from) : true;
      const matchDate = date ? dateMatch : true;
      return matchQ && matchFrom && matchDate;
    });

    // Reset ke halaman pertama jika filter berubah
    setCurrentPage(1);
    return filtered;
  }, [query, fromFilter, dateFilter, packages]);

  // Hitung total halaman
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  // Ambil packages untuk halaman saat ini
  const paginatedPackages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPackages.slice(startIndex, endIndex);
  }, [filteredPackages, currentPage, itemsPerPage]);

  // Handler untuk perubahan halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll ke atas saat pindah halaman
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <HeroCariDestinasiSection
        searchValue={query}
        onSearchChange={handleInputChange}
        onSearch={handleSearch}
        backgroundImage={CariDestinasiImage}
      />

      {/* Main Content Section */}
      <CariDestinasiSection
        packages={paginatedPackages}
        loading={loading}
        onPackageClick={handlePackageClick}
      />

      {/* Pagination Section */}
      {!loading && filteredPackages.length > 0 && (
        <div className="container mx-auto px-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredPackages.length}
          />
        </div>
      )}
    </div>
  );
}
