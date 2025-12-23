import { PackageDetail } from '@/api/packages';
import CardPesanan from '../../ui/card-pesanan/CardPesanan';
import { BgDetailDestinasiImage } from '@/assets/images';
import { Form } from 'react-router-dom';
import { formatHelper } from '@/helper/format';

interface HeroDetailDestinasiSectionProps {
  destination: PackageDetail | null;
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
      <div className="max-w-7xl mx-auto mt-6 relative z-10">
        <CardPesanan
          id={destination.id?.toString()}
          image={destination.image}
          title={destination.name}
          location={destination.location}
          date={
            destination.periode_start && destination.periode_end
              ? `${formatHelper.Period(destination.periode_start)} - ${formatHelper.Period(
                  destination.periode_end
                )}`
              : formatHelper.Period(destination.periode_start)
          }
          airline={destination.maskapai}
          airport={destination.bandara}
          price={`${formatHelper.rupiah(destination.price)} / Pax`}
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
