import React from 'react';
import CardArtikel from '../../ui/card-artikel/CardArtikel';
import Button from '../../ui/button/Button';
import { useNavigate } from 'react-router-dom';
import { Article } from '@/api/articles';

interface ArtikelHomeSectionProps {
  articles: Article[];
  loading: boolean;
}

export default function ArtikelHomeSection({
  articles,
  loading,
}: ArtikelHomeSectionProps) {
  const navigate = useNavigate();

  // Dummy data as fallback
  const dummyArticles = [
    {
      id: 'dummy-1',
      image:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070',
      title: "5 Tips Packing Syar'i: Apa yang Wajib Kita di Koper Muslimah?",
      description:
        'Perjalanan halal tidak hanya tentang destinasi, tetapi juga tentang persiapan. Pelajari tips packing untuk perjalanan yang nyaman dan sesuai syariah.',
      category: 'Travel Tips',
      date: '20 Des 2025',
    },
    {
      id: 'dummy-2',
      image:
        'https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=2070',
      title:
        'Eksplore Kota Tua Jakarta: Destinasi Halal-Friendly dan Penuh Sejarah',
      description:
        'Jelajahi keindahan dan sejarah Kota Tua Jakarta dengan panduan lengkap untuk muslimah. Temukan tempat ibadah dan kuliner halal terbaik.',
      category: 'Destinasi',
      date: '18 Des 2025',
    },
  ];

  // Use API data if available, otherwise use dummy data
  const displayArticles =
    articles.length > 0 ? articles.slice(0, 2) : dummyArticles;

  const handleReadMore = () => {
    navigate('/artikel');
  };

  return (
    <section
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: '#F5F5F5' }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-gray-500 text-sm md:text-base mb-2">
            Artikel Panduan Travelling
          </p>
          <h2 className="text-gray-900 font-bold text-[clamp(1.75rem,4vw,2.5rem)] leading-tight mb-4">
            Tips dan Artikel Perjalanan
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat artikel...</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 justify-items-center mb-12">
              {displayArticles.map((article) => {
                const imgSrc =
                  'image' in article
                    ? article.image
                    : article.coverImage || article.imageUrl || '';
                const desc =
                  'description' in article
                    ? article.description
                    : article.excerpt || article.preview || '';
                const dateStr =
                  article.date ||
                  ('displayDate' in article ? article.displayDate : '') ||
                  ('tanggal' in article ? article.tanggal : '') ||
                  '';

                return (
                  <CardArtikel
                    key={article.id}
                    image={imgSrc}
                    title={article.title}
                    description={desc}
                    category={article.category || 'Artikel'}
                    date={dateStr}
                    variant="simple"
                    className="w-full max-w-[434px]"
                  />
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Button
                variant="light-purple-hover-dark-purple"
                onClick={handleReadMore}
                className="!w-[clamp(200px,40vw,280px)] !h-[clamp(50px,6vh,64px)] !text-[clamp(1rem,1.5vw,1.125rem)]"
              >
                Lihat Selengkapnya
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
