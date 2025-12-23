import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
}

export default function TestimoniHomeSection() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Virly Maryam',
      role: "Si Petualang Syar'i",
      image:
        'https://images.unsplash.com/photo-1550546094-9835463f9f71?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bXVzbGltJTIwZ2lybHxlbnwwfHwwfHx8MA%3D%3D',
      quote:
        'Ini bukan sekadar liburan, ini adalah perjalanan yang berbeda. Setiap detail dirancang khusus untuk kenyamanan kita, membawa pengalaman yang mendalam dan unik. Mari segera wujudkan petualangan impian!',
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      role: 'Travel Enthusiast',
      image:
        'https://images.unsplash.com/photo-1612307057748-b44842539a29?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG11c2xpbSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
      quote:
        'Pengalaman yang luar biasa! Semua fasilitas ibadah lengkap dan makanan halal terjamin. Saya merasa sangat nyaman dan aman selama perjalanan.',
    },
    {
      id: 3,
      name: 'Fatimah Azzahra',
      role: 'Blogger Traveling',
      image:
        'https://media.istockphoto.com/id/865817026/photo/happy-young-muslim-women.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZvkaeyCzvMD1wWMtZyava4fm6i6PqI-iG6jjdm0zTJc=',
      quote:
        'Pelayanan yang sangat memuaskan dan destinasi yang indah. Tim sangat memahami kebutuhan muslimah dalam berpergian. Highly recommended!',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const currentTestimonial = testimonials[currentIndex];
  const prevIndex =
    (currentIndex - 1 + testimonials.length) % testimonials.length;
  const nextIndex = (currentIndex + 1) % testimonials.length;

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-gray-500 text-sm md:text-base mb-2">Testimoni</p>
          <h2 className="text-gray-900 font-bold text-[clamp(1.75rem,4vw,2.5rem)] leading-tight mb-6 max-w-4xl mx-auto">
            Ini bukan sekadar liburan, ini adalah perjalanan yang berbeda.
            Setiap detail dirancang khusus{' '}
            <span className="text-gray-500">
              untuk kenyamanan kita, membawa pengalaman yang mendalam dan unik.
            </span>{' '}
            <span className="text-gray-500">
              Mari segera wujudkan petualangan impian!
            </span>
          </h2>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Images Container */}
          <div className="flex items-center justify-center gap-4 md:gap-8 mb-12">
            {/* Left Image - Previous */}
            <div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden opacity-40 hover:opacity-60 transition-opacity cursor-pointer grayscale">
              <img
                src={testimonials[prevIndex].image}
                alt={testimonials[prevIndex].name}
                className="w-full h-full object-cover"
                onClick={prevTestimonial}
              />
            </div>

            {/* Center Image - Current (Featured) */}
            <div className="flex-shrink-0 relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-purple-200">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div
                className="absolute -top-2 -right-2 w-16 h-16 md:w-24 md:h-24 rounded-2xl opacity-20 -z-10"
                style={{ backgroundColor: '#F9A8D4' }}
              />
            </div>

            {/* Right Image - Next */}
            <div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden opacity-40 hover:opacity-60 transition-opacity cursor-pointer grayscale">
              <img
                src={testimonials[nextIndex].image}
                alt={testimonials[nextIndex].name}
                className="w-full h-full object-cover"
                onClick={nextTestimonial}
              />
            </div>
          </div>

          {/* Name and Role */}
          <div className="text-center mb-8">
            <h3 className="text-gray-900 font-bold text-xl md:text-2xl mb-1">
              {currentTestimonial.name}
            </h3>
            <p className="text-gray-500 text-sm md:text-base">
              {currentTestimonial.role}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-md bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-[#6D4891]" />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-[#6D4891]'
                      : 'w-2 bg-purple-200'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-md bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-[#6D4891]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
