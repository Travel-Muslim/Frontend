import CardTestimoni from '../../ui/card-testimoni/card-testimoni';
import type { UserReview } from '../../../api/reviews';

interface TestimoniDetailDestinasiSectionProps {
  reviews: UserReview[];
  loading?: boolean;
}

export default function TestimoniDetailDestinasiSection({
  reviews,
  loading = false,
}: TestimoniDetailDestinasiSectionProps) {
  if (loading) {
    return (
      <section className="w-full bg-gradient-to-b from-white to-pink-50/20 py-12 md:py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-pink-50/20 py-12 md:py-16 lg:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            – Pilihan paling banyak dicari –
          </h2>
        </div>

        {/* Testimonials Grid */}
        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {reviews.slice(0, 6).map((review) => (
              <div key={review.id} className="flex justify-center">
                <CardTestimoni
                  image={`https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=600`}
                  avatar={
                    review.tour_package?.id
                      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.id}`
                      : undefined
                  }
                  name={review.tour_package?.name || 'Testimoni'}
                  rating={review.rating}
                  testimonial={review.comment}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Belum ada testimoni untuk destinasi ini
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
