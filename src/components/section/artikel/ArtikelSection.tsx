import React from 'react';
import ArticleCard from '@components/ui/card-artikel/CardArtikel';
import type { Article } from '@api/articles';

interface ArtikelSectionProps {
  articles: Article[];
  loading?: boolean;
  onReadArticle: (id: string) => void;
  showInspirationText?: boolean;
}

export default function ArtikelSection({
  articles,
  loading = false,
  onReadArticle,
  showInspirationText = true,
}: ArtikelSectionProps) {
  if (loading) {
    return (
      <div className="px-4 mobile:px-3 xs:px-3 sm:px-6 md:px-8 lg:px-24 py-16 mobile:py-12 xs:py-12 sm:py-14 lg:py-20">
        <div className="grid grid-cols-1 mobile:grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile:gap-4 xs:gap-4 sm:gap-5 lg:gap-8 max-w-[1400px] mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="animate-pulse flex flex-col bg-white rounded-2xl overflow-hidden h-96 w-full max-w-[434px] mx-auto"
            >
              <div className="w-full h-56 bg-gray-300" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="px-4 mobile:px-3 xs:px-3 sm:px-6 md:px-8 lg:px-24 py-16 mobile:py-12 xs:py-12">
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg mobile:text-base xs:text-base">
            Tidak ada artikel yang cocok dengan pencarian Anda
          </p>
        </div>
      </div>
    );
  }

  // Maksimal 6 card atas dan 6 card bawah
  const topArticles = articles.slice(0, 6);
  const bottomArticles = articles.slice(6, 12);

  const renderGrid = (items: Article[]) => (
    <div className="grid grid-cols-1 mobile:grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile:gap-4 xs:gap-4 sm:gap-5 lg:gap-8 max-w-[1400px] mx-auto">
      {items.map((article) => (
        <div key={article.id} className="w-full flex justify-center">
          <ArticleCard
            variant="with-button"
            image={article.image || article.coverImage || article.imageUrl}
            title={article.title}
            description={
              article.content?.slice(0, 180) ||
              article.excerpt ||
              article.preview ||
              ''
            }
            date={article.tanggal || article.displayDate || article.date}
            onReadClick={() => onReadArticle(String(article.id))}
            className="w-full max-w-[434px]"
          />
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Cards Atas (max 6) */}
      <div className="px-4 mobile:px-3 xs:px-3 sm:px-6 md:px-8 lg:px-24 py-16 mobile:py-12 xs:py-12 sm:py-14 lg:py-20">
        {renderGrid(topArticles)}
      </div>

      {/* Teks Tengah */}
      {showInspirationText && (
        <div className="px-4 mobile:px-3 xs:px-3 sm:px-6 md:px-8 lg:px-24 py-12 mobile:py-8 xs:py-8 sm:py-10 lg:py-16 bg-orange-50">
          <div className="flex items-center justify-center">
            <p className="font-sans font-semibold text-[clamp(1.125rem,2.5vw,1.5rem)] mobile:text-lg xs:text-lg sm:text-xl lg:text-2xl text-gray-700 text-center leading-relaxed max-w-4xl px-4">
              - Temukan berbagai panduan dan inspirasi perjalanan yang bisa
              membantu kamu merencanakan trip yang lebih nyaman dan menyenangkan
              -
            </p>
          </div>
        </div>
      )}

      {/* Cards Bawah (max 6) */}
      {bottomArticles.length > 0 && (
        <div className="px-4 mobile:px-3 xs:px-3 sm:px-6 md:px-8 lg:px-24 py-16 mobile:py-12 xs:py-12 sm:py-14 lg:py-20">
          {renderGrid(bottomArticles)}
        </div>
      )}
    </>
  );
}
