import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArticle, type Article, type ArticleBlock } from "../api/articles";
import "./ArtikelDetail.css";

const normalizeBlocks = (article?: Article | null): ArticleBlock[] => {
  if (article?.blocks?.length) return article.blocks;
  if (!article?.content) return [];
  return article.content
    .split(/\n+/)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((value) => ({ type: "text", value }));
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
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
  const displayDate = article?.displayDate || formatDate(article?.date) || article?.time || "";

  const renderBlock = (block: ArticleBlock, idx: number) => {
    if (block.type === "image") {
      return (
        <div className="artikel-detail-section-image-wrapper" key={`img-${idx}`}>
          <img src={block.value} alt={block.label || article?.title || "Gambar artikel"} className="artikel-detail-section-image" />
          {block.label && <p className="artikel-detail-caption">{block.label}</p>}
        </div>
      );
    }
    if (block.type === "link") {
      return (
        <p key={`link-${idx}`} className="artikel-detail-paragraph">
          <a href={block.value} target="_blank" rel="noreferrer">
            {block.label || block.value}
          </a>
        </p>
      );
    }
    return (
      <p key={`text-${idx}`} className="artikel-detail-paragraph">
        {block.value}
      </p>
    );
  };

  if (loading) {
    return (
      <div className="artikel-detail-page-wrapper">
        <div className="artikel-detail-page-container">
          <div className="artikel-detail-header">
            <span className="artikel-detail-label">Artikel</span>
            <div className="artikel-detail-title-wrapper">
              <h1 className="artikel-detail-title">Memuat artikel...</h1>
            </div>
          </div>
          <div className="artikel-detail-section">
            <p className="artikel-detail-paragraph">Tunggu sebentar, artikel sedang dimuat dari server.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="artikel-detail-page-wrapper">
        <div className="artikel-detail-page-container">
          <div className="artikel-detail-header">
            <span className="artikel-detail-label">Artikel</span>
            <div className="artikel-detail-title-wrapper">
              <h1 className="artikel-detail-title">Artikel tidak ditemukan</h1>
            </div>
          </div>
          <div className="artikel-detail-section">
            <p className="artikel-detail-paragraph">Artikel yang Anda cari tidak tersedia.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="artikel-detail-page-wrapper">
      <div className="artikel-detail-page-container">
        {/* Header */}
        <div className="artikel-detail-header">
          <span className="artikel-detail-label">{article.tag || "Artikel"}</span>
          <div className="artikel-detail-title-wrapper">
            <h1 className="artikel-detail-title">{article.title}</h1>
          </div>
          <div className="artikel-detail-meta">
            {article.author && (
              <div className="artikel-detail-meta-item">
                <span className="artikel-detail-author">{article.author}</span>
              </div>
            )}
            {(article.author || displayDate) && <div className="artikel-detail-meta-divider">•</div>}
            {displayDate && (
              <div className="artikel-detail-meta-item">
                <span className="artikel-detail-date">{displayDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Image */}
        {article.image && (
          <div className="artikel-detail-main-image-wrapper">
            <img src={article.image} alt={article.title} className="artikel-detail-main-image" />
          </div>
        )}

        {/* Content Sections */}
        <div className="artikel-detail-content">
          {blocks.length === 0 ? (
            <p className="artikel-detail-paragraph">Konten artikel belum tersedia.</p>
          ) : (
            blocks.map((block, idx) => (
              <div key={idx} className="artikel-detail-section">
                {renderBlock(block, idx)}
              </div>
            ))
          )}
        </div>

        {/* CTA Section */}
        {article.link && (
          <div className="artikel-detail-cta-section">
            <p className="artikel-detail-cta-text">
              Ingin membaca lebih lanjut? Kunjungi sumber artikel di{" "}
              <a href={article.link} target="_blank" rel="noreferrer">
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
