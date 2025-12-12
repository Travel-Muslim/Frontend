import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Header from "../components/Header";
import Button from "../components/Button";
import StatCard from "../components/StatCard";
import SearchBar from "../components/SearchBar";
import { fetchDestinations, type Destination } from "../api/destinations";
import { fetchArticles, type Article } from "../api/articles";
import { pushRecentDestination } from "../utils/recentDestinations";

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="hero-section">
      <div className="hero-bg">
        <img src="../src/assets/hero-bg.png" alt="Hero Background" className="hero-bg-image" />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <h1 className="hero-title">Mulailah Perjalanan Halalmu Sekarang</h1>
        <p className="hero-desc">
          Temukan destinasi, akomodasi, dan pengalaman perjalanan yang aman serta sesuai syariah. 
          Jelajahi dunia dengan rasa tenang, penuh keyakinan, dan tetap menjaga nilai-nilai sebagai muslimah.
        </p>
        <div className="hero-btn-wrapper">
          <Button
            className="btn purple-light"
            variant="purple-light"
            showArrows={false}
            onClick={() => navigate("/cari-destinasi")}
          >
            Cari Sekarang
          </Button>
        </div>
      </div>
    </section>
  );
}

function DestinationsSection({ destinations, loading }: { destinations: Destination[]; loading: boolean }) {
  const navigate = useNavigate();
  const handleCardClick = (dest: Destination) => {
    pushRecentDestination(dest);
    navigate(`/destinasi/${dest.id}`, { state: { dest } });
  };

  return (
    <section className="destinations-section new-destinations-section">
      <div className="destinations-inner">
        <div className="destinations-head">
          <div className="dest-left">
            <p className="section-subtitle">Perjalanan terbaik kami</p>
            <h2 className="section-title">Wisata Halal Pilihan Muslimah</h2>
          </div>
          <div className="dest-right">
            <p className="section-desc">
              Nikmati setiap destinasi yang terjamin keamanannya, dan jelajahi keindahan alam yang menenangkan
            </p>
          </div>
        </div>

        {loading ? (
          <div className="dest-grid new-dest-grid" role="list">
            <div className="dest-card new-dest-card skeleton" aria-busy="true">
              Memuat destinasi...
            </div>
          </div>
        ) : destinations.length === 0 ? (
          <div className="dest-grid new-dest-grid" role="list">
            <div className="dest-card new-dest-card empty">Belum ada destinasi</div>
          </div>
        ) : (
          <div className="dest-grid new-dest-grid" role="list">
            {destinations.map((dest) => (
              <article
                className="dest-card new-dest-card"
                key={dest.id}
                role="listitem"
                aria-label={dest.title}
                onClick={() => handleCardClick(dest)}
              >
                <div className="dest-card-media">
                  {dest.image ? <img src={dest.image} alt={dest.title} /> : <div className="image-placeholder" />}
                </div>
                <div className="dest-card-body">
                  <p className="dest-card-date">
                    {dest.period?.[0] ? `Paket ${dest.period[0]}` : "Periode belum tersedia"}
                  </p>
                  <h3 className="dest-card-title">{dest.title}</h3>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="cta-section">
      <div className="cta-bg">
        <img src="../src/assets/2.png" alt="CTA Background" />
        <div className="cta-overlay" />
      </div>
      <div className="cta-content">
        <p className="cta-label">Paket Tour</p>
        <h2 className="cta-title">
          Temukan pilihan destinasi halal dengan akomodasi aman, makanan halal terjamin, 
          dan fasilitas ibadah yang mudah dijangkau.
        </h2>
        <Button variant="purple-light" showArrows={false} onClick={() => navigate("/cari-destinasi")}>
          Temukan Destinasi
        </Button>
      </div>
    </section>
  );
}

// Article Card
function ArticleCard({ date, title, excerpt, image }: { date: string; title: string; excerpt: string; image?: string }) {
  const imageContent = image ? <img src={image} alt={title} /> : <div className="article-image-placeholder" />;
  return (
    <article className="article-card">
      <div className="article-image">
        {imageContent}
      </div>
      <div className="article-content">
        <p className="article-date">{date}</p>
        <h3 className="article-title">{title}</h3>
        <p className="article-excerpt">{excerpt}</p>
      </div>
    </article>
  );
}

// Articles Section
function ArticlesSection({ articles, loading }: { articles: Article[]; loading: boolean }) {
  const displayed = articles.slice(0, 2);
  return (
    <section className="articles-section">
      <p className="section-subtitle">Aritkel Panduan Travelling</p>
      <h2 className="section-title">Tips dan Artikel Perjalanan</h2>
      {loading ? (
        <div className="articles-grid">
          <ArticleCard date="..." title="Memuat artikel..." excerpt="" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="articles-grid">
          <ArticleCard date="" title="Belum ada artikel" excerpt="Artikel akan tampil di sini setelah tersedia." />
        </div>
      ) : (
        <>
          <div className="articles-grid">
            {displayed.map((article) => (
              <ArticleCard
                key={article.id}
                date={article.displayDate || article.date || ""}
                title={article.title}
                excerpt={article.content?.slice(0, 160) || ""}
                image={article.image}
              />
            ))}
          </div>
          <div className="articles-btn-wrapper">
            <Button variant="purple-light" showArrows={false}>
              Lihat Selengkapnya
            </Button>
          </div>
        </>
      )}
    </section>
  );
}

function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stats-content">
        <div className="stats-text">
          <h2 className="stats-title">Ketenangan dan Kenyamanan Perjalanan Anda, Prioritas Kami</h2>
          <p className="stats-desc">
            Setiap paket perjalanan kami dirancang dengan cermat, menjamin kenyamanan dan kesesuaian syariat.
            Ribuan Muslimah telah membuktikan layanan kami yang berfokus pada pengalaman beribadah yang tenang.
          </p>

          <div className="stats-cards">
            <StatCard value="500+" label="Destinasi Halal" />
            <StatCard value="100K+" label="Muslimah yang Terlayani" />
            <StatCard value="4.9" label="Rata-rata Rating Kepuasan" />
          </div>
        </div>

        <div className="stats-image" aria-hidden="true">
          <img src="/desher1.png" alt="Destinasi unggulan" />
        </div>
      </div>
    </section>
  );
}

// Testimonial Section
function TestimonialSection() {
  return (
    <section className="testimonial-section">
      <p className="testimonial-label">Testimoni</p>
      <div className="testimonial-quote">
        <p>
          <span className="text-black">Ini bukan sekadar liburan, ini adalah perjalanan yang berbeda. Setiap detail dirancang khusus </span>
          <span className="text-gray">untuk kenyamanan kita, membawa pengalaman yang mendalam dan unik.</span>{" "}
          <span className="text-light-gray">Mari segera wujudkan petualangan impian!</span>
        </p>
      </div>
      <div className="testimonial-photos">
        <div className="testimonial-photo testimonial-photo-side">
          <img
            src="/muslimah1.png"
            alt="Testimonial 1"
          />
        </div>
        <div className="testimonial-photo testimonial-photo-main">
          <img
            src="/muslimah2.png"
            alt="Testimonial Main"
          />
        </div>
        <div className="testimonial-photo testimonial-photo-side">
          <img
            src="/muslimah%203.png"
            alt="Testimonial 2"
          />
        </div>
      </div>
      <div className="testimonial-author">
        <h3 className="testimonial-name">Virly Maryam</h3>
        <p className="testimonial-role">Si Petualang Syar'i</p>
      </div>
    </section>
  );
}

// Main HomePage Component
export default function HomePage() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destLoading, setDestLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleLoading, setArticleLoading] = useState(true);

  const handleSearch = (from: string, to: string, date: string) => {
    const params = new URLSearchParams();
    if (to) params.set("q", to);
    if (from) params.set("from", from);
    if (date) params.set("date", date);
    const qs = params.toString();
    navigate(qs ? `/cari-destinasi?${qs}` : "/cari-destinasi");
  };

  useEffect(() => {
    let active = true;
    setDestLoading(true);
    fetchDestinations()
      .then((data) => {
        if (active) setDestinations(data);
      })
      .finally(() => active && setDestLoading(false));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setArticleLoading(true);
    fetchArticles()
      .then((data) => {
        if (active) setArticles(data);
      })
      .finally(() => active && setArticleLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="homepage">
      <Header />
      
      <main className="homepage-main">
        <HeroSection />
        
        <div className="search-bg-wrapper">
          <SearchBar destinations={destinations} loading={destLoading} onSearch={handleSearch} />
        </div>

        <DestinationsSection destinations={destinations} loading={destLoading} />
        
        <CTASection />
        
        <ArticlesSection articles={articles} loading={articleLoading} />
        
        <StatsSection />
        
        <TestimonialSection />
      </main>
    </div>
  );
}
