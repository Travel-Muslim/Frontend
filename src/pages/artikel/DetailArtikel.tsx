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
          className="article-content"
          dangerouslySetInnerHTML={{ __html: block.value }}
        />
      );
    }
    if (block.type === 'image') {
      return (
        <div
          className="w-full rounded-lg overflow-hidden my-6"
          key={`img-${idx}`}
        >
          <img
            src={block.value}
            alt={block.label || article?.title || 'Gambar artikel'}
            className="w-full h-auto object-cover"
          />
          {block.label && (
            <p className="text-center text-sm text-gray-600 mt-3 font-sans">
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
          className="font-sans text-base text-gray-800 leading-relaxed text-justify"
        >
          <a
            href={block.value}
            target="_blank"
            rel="noreferrer"
            className="text-purple-600 hover:text-purple-800 underline"
          >
            {block.label || block.value}
          </a>
        </p>
      );
    }
    return (
      <p
        key={`text-${idx}`}
        className="font-sans text-base text-gray-800 leading-relaxed text-justify"
      >
        {block.value}
      </p>
    );
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-orange-50 pt-24 pb-16">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 mb-8">
            <span className="inline-block px-6 py-1.5 rounded-full bg-purple-200 text-purple-700 font-sans font-semibold text-xs tracking-wide uppercase mx-auto">
              Artikel
            </span>
            <h1 className="text-3xl sm:text-4xl font-sans font-bold text-gray-900 text-center leading-tight">
              Memuat artikel...
            </h1>
          </div>
          <p className="font-sans text-base text-gray-700 leading-relaxed text-center">
            Tunggu sebentar, artikel sedang dimuat dari server.
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-purple-50 via-orange-50 to-orange-100 pt-24 pb-16">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 mb-8">
            <span className="inline-block px-6 py-1.5 rounded-full bg-purple-200 text-purple-700 font-sans font-semibold text-xs tracking-wide uppercase mx-auto">
              Artikel
            </span>
            <h1 className="text-3xl sm:text-4xl font-sans font-bold text-gray-900 text-center leading-tight">
              Artikel tidak ditemukan
            </h1>
          </div>
          <p className="font-sans text-base text-gray-700 leading-relaxed text-center">
            Artikel yang Anda cari tidak tersedia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-orange-50">
      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-8">
          <span className="inline-block px-6 py-1.5 rounded-full bg-purple-200 text-purple-700 font-sans font-semibold text-xs tracking-wide uppercase mx-auto">
            {article.tag || 'Seni Muslimah'}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-gray-900 text-center leading-tight px-4">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-2 font-sans text-sm text-gray-600">
            {article.author && <span>{article.author}</span>}
            {article.author && displayDate && <span>·</span>}
            {displayDate && <span>{displayDate}</span>}
          </div>
        </div>

        {/* Main Image */}
        {article.image && (
          <div className="w-full rounded-lg overflow-hidden shadow-md mb-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content Sections */}
        <div className="rounded-lg p-6 sm:p-8 mb-8">
          <style>
            {`
              .article-content {
                font-family: sans-serif;
                color: #1f2937;
                line-height: 1.75;
              }
              .article-content p {
                margin-bottom: 1.25rem;
                text-align: justify;
                font-size: 1rem;
              }
              .article-content em {
                color: #6b7280;
                font-style: italic;
                display: block;
                margin-bottom: 1.5rem;
              }
              .article-content h2 {
                font-size: 1.5rem;
                font-weight: 700;
                color: #111827;
                margin-top: 2rem;
                margin-bottom: 1rem;
              }
              .article-content h3 {
                font-size: 1.25rem;
                font-weight: 600;
                color: #111827;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
              }
              .article-content ul {
                list-style-type: disc;
                padding-left: 1.5rem;
                margin-bottom: 1.25rem;
              }
              .article-content li {
                margin-bottom: 0.5rem;
                text-align: left;
              }
              .article-content ol {
                list-style-type: decimal;
                padding-left: 1.5rem;
                margin-bottom: 1.25rem;
              }
              .article-content figure {
                margin: 1.5rem 0;
              }
              .article-content figure img {
                width: 100%;
                height: auto;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              }
              .article-content strong {
                font-weight: 600;
                color: #111827;
              }
              .article-content a {
                color: #9333ea;
                text-decoration: underline;
              }
              .article-content a:hover {
                color: #7e22ce;
              }
            `}
          </style>
          {blocks.length === 0 ? (
            <p className="font-sans text-base text-gray-700 leading-relaxed text-center">
              Konten artikel belum tersedia.
            </p>
          ) : (
            blocks.map((block, idx) => renderBlock(block, idx))
          )}
        </div>

        {/* CTA Section */}
        {article.link && (
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
            <p className="font-sans font-semibold text-base sm:text-lg text-gray-800 leading-relaxed">
              Yuk, wujudkan impian liburan halal & berkelas bersama Saleema Tour
              melalui paket wisata muslimah ke Korea 2025!{' '}
              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 hover:text-purple-800 underline"
              >
                Klik di sini
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
