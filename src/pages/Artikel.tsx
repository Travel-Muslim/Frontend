import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchArticles, type Article } from "../api/articles";
import ArticleCard from "../components/ArticleCard";
import SearchBarInput from "../components/SearchBarInput";
import "./Artikel.css";

export default function Artikel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchArticles()
      .then((data) => {
        if (active) setArticles(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleReadArticle = (id: string) => {
    navigate(`/artikel/${id}`);
  };

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return articles;
    return articles.filter((article) => {
      const haystack = [article.title, article.content, article.tag].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [articles, searchQuery]);

  return (
    <div className="artikel-page-wrapper">
      <div className="artikel-page-container">
        {/* Hero Section */}
        <div
          className="artikel-hero-section"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.15)), url(/artikelher1.png)` }}
        >
          <div className="artikel-hero-overlay" />
          <div className="artikel-hero-content">
            <div className="artikel-hero-title-wrapper">
              <h1 className="artikel-hero-title">Artikel Panduan</h1>
            </div>
            <div className="artikel-hero-subtitle-wrapper">
              <p className="artikel-hero-subtitle">
                Temukan semua tips dan sisi praktis yang dibagikan Muslimah untuk merencanakan perjalanan yang aman, nyaman, dan bebas khawatir. Siapkan tas untuk petualangan berikutnya!
              </p>
            </div>

            {/* Search Bar */}
            <div className="artikel-search-wrapper">
              <SearchBarInput
                placeholder="Cari topik artikel..."
                value={searchQuery}
                onChange={handleSearchChange}
                onSearch={handleSearch}
                className="artikel-search-bar"
              />
            </div>
          </div>
        </div>

        {/* Articles Grid Section */}
        <div className="artikel-content-section">
          <div className="artikel-cards-grid">
            {loading ? (
              <ArticleCard
                image=""
                title="Memuat artikel..."
                description="Tunggu sebentar, artikel sedang dimuat dari server."
              />
            ) : filteredArticles.length === 0 ? (
              <ArticleCard
                image=""
                title="Belum ada artikel"
                description="Artikel akan tampil di sini setelah tersedia."
              />
            ) : (
              filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  image={article.image || ""}
                  title={article.title}
                  description={article.content?.slice(0, 180) || ""}
                  onReadClick={() => handleReadArticle(String(article.id))}
                />
              ))
            )}
          </div>
        </div>

        {/* Inspiration Section */}
        <div className="artikel-inspiration-section">
          <div className="artikel-inspiration-text-wrapper">
            <p className="artikel-inspiration-text">
              - Temukan berbagai panduan dan inspirasi perjalanan yang bisa membantu kamu merencanakan trip yang lebih nyaman dan menyenangkan -
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
