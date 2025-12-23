import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchArticle,
  type Article,
  type ArticleBlock,
} from '../../api/articles';

const isHTMLContent = (content?: string) => {
  if (!content) return false;
  return /<[^>]+>/.test(content);
};

const normalizeBlocks = (article?: Article | null): ArticleBlock[] => {
  if (article?.blocks?.length) return article.blocks;
  if (!article?.content) return [];

  // Jika content adalah HTML, jangan split
  if (isHTMLContent(article.content)) {
    return [{ type: 'html', value: article.content }];
  }

  return article.content
    .split(/\n+/)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((value) => ({ type: 'text', value }));
};

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export default function ArtikelDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} | Artikel`;
    }
  }, [article?.title]);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    fetchArticle(id)
      .then((data) => {
        if (active) setArticle(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const blocks = useMemo(() => normalizeBlocks(article), [article]);
  const displayDate =
    article?.displayDate || formatDate(article?.date) || article?.time || '';

  const renderBlock = (block: ArticleBlock, idx: number) => {
    if (block.type === 'html') {
      return (
        <div
          key={`html-${idx}`}
          className="font-sans font-normal text-base sm:text-lg text-gray-800 leading-relaxed prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: block.value }}
        />
      );
    }
    if (block.type === 'image') {
      return (
        <div
          className="w-full h-56 sm:h-72 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
          key={`img-${idx}`}
        >
          <img
            src={block.value}
            alt={block.label || article?.title || 'Gambar artikel'}
            className="w-full h-full object-cover"
          />
          {block.label && (
            <p className="text-center text-sm text-gray-600 mt-2 font-sans">
              {block.label}
            </p>
          )}
        </div>
      );
    }
    if (block.type === 'link') {
      return (
        <p
          key={`link-${idx}`}
          className="font-sans font-normal text-base sm:text-lg text-gray-800 leading-relaxed text-justify"
        >
          <a
            href={block.value}
            target="_blank"
            rel="noreferrer"
            className="text-purple-500 hover:text-purple-700 underline"
          >
            {block.label || block.value}
          </a>
        </p>
      );
    }
    return (
      <p
        key={`text-${idx}`}
        className="font-sans font-normal text-base sm:text-lg text-gray-800 leading-relaxed text-justify"
      >
        {block.value}
      </p>
    );
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-orange-50 pt-20 sm:pt-28 lg:pt-32 pb-20 lg:pb-28">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:gap-5 mb-12">
            <span className="inline-block px-5 sm:px-6 py-1.5 rounded-full border border-white/90 bg-gradient-to-r from-purple-500 to-purple-400 text-white font-sans font-semibold text-xs sm:text-sm tracking-widest uppercase shadow-md mx-auto">
              Artikel
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black text-gray-900 text-center leading-tight">
              Memuat artikel...
            </h1>
          </div>
          <p className="font-sans font-normal text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
            Tunggu sebentar, artikel sedang dimuat dari server.
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full min-h-screen bg-orange-50 pt-20 sm:pt-28 lg:pt-32 pb-20 lg:pb-28">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:gap-5 mb-12">
            <span className="inline-block px-5 sm:px-6 py-1.5 rounded-full border border-white/90 bg-gradient-to-r from-purple-500 to-purple-400 text-white font-sans font-semibold text-xs sm:text-sm tracking-widest uppercase shadow-md mx-auto">
              Artikel
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black text-gray-900 text-center leading-tight">
              Artikel tidak ditemukan
            </h1>
          </div>
          <p className="font-sans font-normal text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
            Artikel yang Anda cari tidak tersedia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-orange-50 pt-20 sm:pt-28 lg:pt-32 pb-20 lg:pb-28">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-5 mb-12 lg:mb-16">
          <span className="inline-block px-5 sm:px-6 py-1.5 rounded-full border border-white/90 bg-[#B49DE4] text-white font-sans font-semibold text-xs sm:text-sm tracking-widest uppercase shadow-md mx-auto">
            {article.tag || 'Artikel'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black text-gray-900 text-center leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-3 font-sans font-medium text-sm sm:text-base text-gray-600">
            {article.author && <span>{article.author}</span>}
            {displayDate && <span>{displayDate}</span>}
          </div>
        </div>

        {/* Main Image */}
        {article.image && (
          <div className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg mb-12 lg:mb-20">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Sections */}
        <div className="flex flex-col gap-12 lg:gap-16 mb-16 lg:mb-20">
          {blocks.length === 0 ? (
            <p className="font-sans font-normal text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
              Konten artikel belum tersedia.
            </p>
          ) : (
            blocks.map((block, idx) => (
              <div key={idx} className="flex flex-col gap-5 text-center">
                {renderBlock(block, idx)}
              </div>
            ))
          )}
        </div>

        {/* CTA Section */}
        {article.link && (
          <div className="flex items-center justify-center p-8 sm:p-10 bg-white rounded-2xl shadow-md">
            <p className="font-sans font-semibold text-base sm:text-lg lg:text-xl text-gray-800 leading-relaxed text-center">
              Ingin membaca lebih lanjut? Kunjungi sumber artikel di{' '}
              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="text-purple-500 hover:text-purple-700 underline"
              >
                tautan berikut
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
