import SnackBar from '@components/ui/snack-bar/SnackBar';

interface HeroRekomendasiDestinasiSectionProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  backgroundImage?: string;
}

export default function HeroRekomendasiDestinasiSection({
  selectedRegion,
  onRegionChange,
  backgroundImage = 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200',
}: HeroRekomendasiDestinasiSectionProps) {
  const regions = [
    { id: 'asia', label: 'Asia' },
    { id: 'eropa', label: 'Eropa' },
    { id: 'amerika', label: 'Amerika' },
    { id: 'afrika', label: 'Afrika' },
  ];

  return (
    <div className="relative w-full">
      {/* Hero Section with Background Image */}
      <div
        className="relative min-h-[420px] md:min-h-[520px] lg:min-h-[600px] bg-cover bg-center flex items-center justify-center py-12 mobile:py-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        }}
      >
        <div className="text-center text-white z-10 px-4 mobile:px-3 xs:px-4 sm:px-6 md:px-8 max-w-4xl mx-auto w-full">
          {/* Heading */}
          <h1
            className="font-bold mb-4 mobile:mb-3 xs:mb-4 sm:mb-5 md:mb-6 text-white"
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              lineHeight: 1.2,
            }}
          >
            Rekomendasi Paket
          </h1>

          {/* Description */}
          <p
            className="max-w-2xl mx-auto text-white mobile:px-2 xs:px-4 sm:px-6 mb-8 mobile:mb-6 xs:mb-7 sm:mb-8 md:mb-10"
            style={{
              fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
              lineHeight: 1.6,
            }}
          >
            Jelajahi berbagai pilihan liburan nyaman dan terpercaya yang siap
            menemani langkahmu menuju pengalaman tak terlupakan
          </p>

          {/* Region Tabs - Below description */}
          <div className="max-w-4xl mx-auto">
            <SnackBar
              items={regions}
              activeId={selectedRegion}
              onItemClick={onRegionChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
