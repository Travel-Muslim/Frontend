import "./Home.css";

type Destination = {
  id: number;
  title: string;
  subtitle: string;
  month: string;
  image: string;
};

const DESTINATIONS: Destination[] = [
  {
    id: 1,
    title: "Korea Halal Tour",
    subtitle: "Paket Desember 2025",
    month: "Desember 2025",
    image: "/Dest1.png",
  },
  {
    id: 2,
    title: "Uzbekistan Halal Tour",
    subtitle: "Paket November 2025",
    month: "November 2025",
    image: "/Dest2.png",
  },
  {
    id: 3,
    title: "Japan Halal Tour",
    subtitle: "Paket Oktober 2025",
    month: "Oktober 2025",
    image: "Dest3.png",
  },
];

export default function Home() {
  return (
    <div className="lp-root">
      <section id="hero" className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-bg" />
          <div className="lp-hero-overlay">
            <div className="lp-hero-text">
              <h1>Mulailah Perjalanan Halalmu Sekarang</h1>
              <p>
                Temukan destinasi, akomodasi, dan pengalaman perjalanan yang
                aman serta sesuai syariah. Jelajahi dunia dengan rasa tenang,
                penuh keyakinan, dan tetap menjaga nilai-nilai sebagai muslimah.
              </p>
            </div>
            
            <button className="lp-hero-cta">Cari Sekarang</button>
          </div>
        </div>
      </section>
      <section className="lp-search-section">
        <form className="lp-search-bar">
          <div className="lp-search-item lp-search-item-border">
            <span className="lp-search-label">Dari</span>
            <button type="button" className="lp-search-pill">
              <span>Pilih kota keberangkatan</span>
              <span className="lp-pill-caret">▾</span>
            </button>
          </div>
          <div className="lp-search-item lp-search-item-border">
            <span className="lp-search-label">Ke</span>
            <button type="button" className="lp-search-pill">
              <span>Pilih destinasi</span>
              <span className="lp-pill-caret">▾</span>
            </button>
          </div>
          <div className="lp-search-item lp-search-item-border">
            <span className="lp-search-label">Pergi</span>
            <button type="button" className="lp-search-pill">
              <span>dd/mm/yyyy</span>
              <span className="lp-pill-caret">▾</span>
            </button>
          </div>
          <button type="submit" className="lp-search-btn">
            <img src="/search.svg" alt="" className="lp-search-btn-icon" />
            <span>Cari Destinasi</span>
          </button>
        </form>
      </section>
      <section id="destinasi" className="lp-section lp-section-dest">
        <div className="lp-section-head lp-section-head-dest">
          <div>
            <p className="lp-section-label">Perjalanan terbaik kami</p>
            <h2>Wisata Halal Pilihan Muslimah</h2>
          </div>
          <p className="lp-section-subright">
            Nikmati setiap destinasi yang terjamin keamanannya, dan jelajahi
            keindahan alam yang menenangkan.
          </p>
        </div>

        <div className="lp-card-grid">
          {DESTINATIONS.map((d) => (
            <article key={d.id} className="lp-card">
              <div
                className="lp-card-img"
                style={{ backgroundImage: `url(${d.image})` }}
              />
              <div className="lp-card-body">
                <span className="lp-card-date">{d.month}</span>
                <h3>{d.title}</h3>
                <p>{d.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="lp-cta">
        <div className="lp-cta-img">
          <div className="lp-cta-overlay">
            <span className="lp-cta-tag">Paket Tour</span>
            <h3>
              Temukan pilihan destinasi halal dengan akomodasi aman, makanan
              halal terjamin, dan fasilitas ibadah yang mudah dijangkau.
            </h3>
            <button className="lp-btn-white">Temukan Destinasi</button>
          </div>
        </div>
      </section>
      <section id="artikel" className="lp-section lp-section-soft">
        <div className="lp-section-head lp-section-head-center">
          <span className="lp-tag">Artikel Panduan Traveling</span>
          <h2>Tips dan Artikel Perjalanan</h2>
        </div>
        <div className="lp-article-grid">
          <article className="lp-article-card">
            <div className="lp-article-img lp-article-img-1" />
            <div className="lp-article-body">
              <span className="lp-article-date">01 Des 2025</span>
              <h3>
                5 Tips Packing Syar’i: Apa yang Wajib Ada di Koper Muslimah?
              </h3>
              <p>
                Packing yang efisien dan sesuai kebutuhan adalah kunci.
                Persiapan bukan hanya pakaian...
              </p>
            </div>
          </article>

          <article className="lp-article-card">
            <div className="lp-article-img lp-article-img-2" />
            <div className="lp-article-body">
              <span className="lp-article-date">25 Nov 2025</span>
              <h3>
                Eksplorasi Kota Tua Jakarta: Destinasi Halal-Friendly dan Penuh
                Sejarah
              </h3>
              <p>
                Wisata sejarah tak harus menguras energi. Kota Tua menawarkan
                spot yang ramah Muslimah...
              </p>
            </div>
          </article>
          <article className="lp-article-card">
            <div className="lp-article-img lp-article-img-3" />
            <div className="lp-article-body">
              <span className="lp-article-date">18 Nov 2025</span>
              <h3>
                Checklist Aman Sebelum Berangkat: Dari Dokumen hingga Aplikasi
                Wajib
              </h3>
              <p>
                Pastikan semua dokumen penting dan aplikasi pendukung perjalanan
                sudah siap sebelum berangkat...
              </p>
            </div>
          </article>
        </div>
        <div className="lp-center">
          <button className="lp-btn-outline">Lihat Selengkapnya</button>
        </div>
      </section>
<section id="testimoni" className="lp-section lp-section-test">
  <div className="lp-section-head lp-section-head-center">
    <span className="lp-test-label">Testimoni</span>
  </div>

  <div className="lp-testimoni">
    <p className="lp-test-headline">
      <span className="lp-test-strong">
        Ini bukan sekadar liburan, ini adalah perjalanan yang berbeda.
        Setiap detail dirancang khusus
      </span>{" "}
      <span className="lp-test-normal">
        untuk kenyamanan kita, membawa pengalaman yang mendalam dan unik.
      </span>{" "}
      <span className="lp-test-fade">
        Mari segera wujudkan petualangan impian!
      </span>
    </p>
          <div className="lp-test-photos">
            <div className="lp-test-photo">
              <img src="/muslimah2.png" alt="Testimoni 1" />
            </div>
            <div className="lp-test-photo lp-test-photo-main">
              <img src="/muslimah1.png" alt="Virly Maryam" />
            </div>
            <div className="lp-test-photo">
              <img src="/muslimah 3.png" alt="Testimoni 3" />
            </div>
          </div>

          <div className="lp-test-user">
            <strong>Virly Maryam</strong>
            <span>Si Petualang Syar’i</span>
          </div>
        </div>
      </section>
      <footer id="kontak" className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-col">
            <h4>Halaman</h4>
            <a href="#hero">Home</a>
            <a href="#destinasi">Wishlist</a>
            <a href="#destinasi">Riwayat</a>
            <a href="#artikel">Artikel</a>
            <a href="#testimoni">Komunitas</a>
          </div>
          <div className="lp-footer-col">
            <h4>Tentang Kami</h4>
            <p>Telepon</p>
            <p>081765219854</p>
            <p>Email Support</p>
            <p>saleema@gmail.com</p>
          </div>
          <div className="lp-footer-col">
            <h4>Kantor Pusat</h4>
            <p>
              Jl. H. R. Rasuna Said No. 3, RT 6/RW 2, Kuningan, Karet Kuningan,
              Kecamatan Setiabudi, Kota Jakarta Selatan, DKI Jakarta 12950
            </p>
          </div>
          <div className="lp-footer-brand">
            <div className="lp-footer-logo">
              <div className="lp-footer-logo-circle">
                <img src="/logo.svg" alt="Saleema" />
              </div>
              <div className="lp-footer-brand-text">
                <span className="lp-footer-brand-title">Saleema</span>
                <span className="lp-footer-brand-sub">Tour</span>
              </div>
            </div>
            <div className="lp-footer-social">
              <span>IG</span>
              <span>FB</span>
              <span>YT</span>
            </div>
          </div>
        </div>
        <div className="lp-footer-bottom">
          ©2025 Saleema, Hak Cipta Dilindungi
        </div>
      </footer>
    </div>
  );
}
