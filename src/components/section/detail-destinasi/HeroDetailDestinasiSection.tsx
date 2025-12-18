import CardPesanan from '../../ui/card-pesanan/CardPesanan';
import type { Destination } from '../../../api/destinations';
import { BgDetailDestinasiImage } from '@/assets/images';

interface HeroDetailDestinasiSectionProps {
  destination: Destination | null;
  onBookingClick?: () => void;
  onWishlistClick?: () => void;
  isWishlisted?: boolean;
  loading?: boolean;
}

export default function HeroDetailDestinasiSection({
  destination,
  onBookingClick,
  onWishlistClick,
  isWishlisted = false,
  loading = false,
}: HeroDetailDestinasiSectionProps) {
  if (loading) {
    return (
      <section className="w-full relative py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-b from-purple-900 to-purple-800">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse bg-white rounded-2xl h-96" />
        </div>
      </section>
    );
  }

  if (!destination) {
    return (
      <section className="w-full relative py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-b from-purple-900 to-purple-800">
        <div className="max-w-7xl mx-auto text-center text-white">
          <p>Destinasi tidak ditemukan</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full relative py-12 md:py-16 lg:py-20 px-4"
      style={{
        backgroundImage: `url('${BgDetailDestinasiImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay untuk membuat card lebih terlihat */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <CardPesanan
          id={destination.id?.toString()}
          image={destination.image}
          title={destination.title}
          location={destination.location}
          date={destination.period?.join(', ')}
          airline={destination.airline}
          airport={destination.airport}
          price={`Rp ${destination.price?.toLocaleString('id-ID')} / pax`}
          status="Tersedia"
          variant="with-booking"
          isWishlisted={isWishlisted}
          onBookingClick={() => onBookingClick?.()}
          onWishlistClick={() => onWishlistClick?.()}
          className="shadow-2xl"
        />
      </div>
    </section>
  );
}
