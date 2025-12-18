import React from 'react';
import { Star } from 'lucide-react';

export interface TestimonialCardProps {
  image?: string;
  avatar?: string;
  name?: string;
  rating?: number;
  testimonial?: string;
  className?: string;
}

export default function CardTestimoni({
  image = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600',
  avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anisya',
  name = 'Anisya Putri',
  rating = 4.8,
  testimonial = 'Banyak hal-hal baru yang tidak kami temukan pada perjalanan kami sebelumnya dengan travel lain. Sukses selalu untuk Saleema Tour.',
  className = '',
}: TestimonialCardProps) {
  return (
    <div
      className={`flex flex-col w-[434px] items-start gap-[9px] pt-[19px] pb-4 px-[17px] bg-white rounded-[15px] shadow-lg hover:shadow-xl transition-shadow ${className}`}
    >
      {/* Image Section */}
      <div className="flex flex-col w-[399px] h-48 items-start gap-2.5">
        <div className="w-full h-full rounded-lg overflow-hidden">
          <img
            src={image}
            alt="Testimonial"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-start self-stretch w-full flex-[0_0_auto] gap-3 p-2.5">
        {/* User Info Section */}
        <div className="flex items-center gap-3 self-stretch w-full">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name and Rating */}
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="font-bold text-xl text-[#444444] leading-tight">
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-xl text-[#444444]">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Testimonial Text */}
        <div className="self-stretch">
          <p className="font-normal text-base text-[#444444] leading-relaxed text-justify">
            "{testimonial}"
          </p>
        </div>
      </div>
    </div>
  );
}

// Demo Component
export function CardTestimoniDemo() {
  const testimonials = [
    {
      id: '1',
      image:
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anisya',
      name: 'Anisya Putri',
      rating: 4.8,
      testimonial:
        'Banyak hal-hal baru yang tidak kami temukan pada perjalanan kami sebelumnya dengan travel lain. Sukses selalu untuk Saleema Tour.',
    },
    {
      id: '2',
      image:
        'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
      name: 'Budi Santoso',
      rating: 5.0,
      testimonial:
        'Pengalaman yang luar biasa! Tour guide sangat profesional dan ramah. Destinasi wisata yang dipilih sangat menarik dan sesuai dengan budget. Highly recommended!',
    },
    {
      id: '3',
      image:
        'https://images.unsplash.com/photo-1528164344305-7f5d642645a7?w=600',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
      name: 'Siti Rahmawati',
      rating: 4.9,
      testimonial:
        'Pelayanan sangat memuaskan dari awal hingga akhir perjalanan. Hotel yang disediakan nyaman dan bersih. Makanan halal juga terjamin. Terima kasih Saleema Tour!',
    },
    {
      id: '4',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
      name: 'Ahmad Hidayat',
      rating: 4.7,
      testimonial:
        'Trip ke Korea sangat berkesan. Itinerary disusun dengan baik, tidak terburu-buru tapi tetap banyak tempat yang dikunjungi. Guide lokal juga sangat membantu.',
    },
    {
      id: '5',
      image:
        'https://images.unsplash.com/photo-1493707553966-283afb8c7aec?w=600',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi',
      name: 'Dewi Lestari',
      rating: 5.0,
      testimonial:
        'Perfect banget! Dari booking sampai pulang semua lancar. Customer service responsif dan helpful. Paket wisata halal yang benar-benar memperhatikan kebutuhan muslim.',
    },
    {
      id: '6',
      image:
        'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
      name: 'Rina Wijaya',
      rating: 4.6,
      testimonial:
        'Harga terjangkau dengan fasilitas yang sangat baik. Pengalaman pertama ke luar negeri menjadi sangat menyenangkan berkat Saleema Tour. Will definitely book again!',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
          Testimonial Card
        </h1>
        <p className="text-gray-600 mb-8">
          Customer testimonials with consistent container design
        </p>

        {/* Single Card Example */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
            Single Card Example
          </h2>
          <div className="flex justify-center">
            <CardTestimoni />
          </div>
        </div>

        {/* Grid of Testimonials */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">
            Multiple Testimonials Grid
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
            {testimonials.map((testimonial) => (
              <CardTestimoni
                key={testimonial.id}
                image={testimonial.image}
                avatar={testimonial.avatar}
                name={testimonial.name}
                rating={testimonial.rating}
                testimonial={testimonial.testimonial}
              />
            ))}
          </div>
        </div>

        {/* Custom Styled Example */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
            Custom Styled Example
          </h2>
          <div className="flex justify-center">
            <CardTestimoni
              image="https://images.unsplash.com/photo-1528164344705-47542687000d?w=600"
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Custom"
              name="Customer VIP"
              rating={5.0}
              testimonial="Ini adalah testimoni custom dengan styling khusus. Sangat puas dengan pelayanan yang diberikan!"
              className="border-2 border-purple-300"
            />
          </div>
        </div>

        {/* Different Ratings Examples */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
            Different Rating Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            <CardTestimoni
              name="High Rating"
              rating={5.0}
              testimonial="Perfect! Everything was amazing from start to finish."
            />
            <CardTestimoni
              name="Good Rating"
              rating={4.5}
              testimonial="Very good experience overall. Would recommend to others."
            />
            <CardTestimoni
              name="Average Rating"
              rating={4.0}
              testimonial="Good service but there's room for improvement."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
