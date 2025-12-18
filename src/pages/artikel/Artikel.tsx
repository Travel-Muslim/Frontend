import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@components/section/header/Header';
import Footer from '@components/section/footer/Footer';
import HeroArtikelSection from '@components/section/artikel/HeroArtikelSection';
import ArtikelSection from '@components/section/artikel/ArtikelSection';
import { fetchArticles, type Article } from '@api/articles';

const DUMMY_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Bukan Seoul Aja! Hidden Gems Korea dalam Paket Wisata Muslimah',
    content:
      'Korea Selatan selalu berhasil mencuri perhatian wisatawan dari berbagai belahan dunia. Tapi kali ini, kami akan membahas destinasi populer di Korea selatan yang jarang dikunjungi sebagai alternatif kunjungan wisata yang lebih off the beaten path dibanding yang lain. Disini kita akan menemukan beberapa hal menarik tentang Seoul, Myeongdong, atau Namsan Tower – kamu salah besar!',
    image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800',
    date: '15 Desember 2024',
    tag: 'Korea',
  },
  {
    id: '2',
    title: 'Sakura Journey — Paket Wisata Muslimah ke Jepang',
    content:
      'Nikmati musim sakura bersama paket wisata Muslimah ke Jepang! Dari hotel nyaman, kunjungan ke masjid, dan pengalaman halal yang berkesan. Jelajahi keindahan sakura di Kyoto, Osaka, dan Tokyo dengan layanan terpercaya.',
    image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800',
    date: '12 Desember 2024',
    tag: 'Jepang',
  },
  {
    id: '3',
    title:
      'Tips & Trik Anti Boncos saat Jalan-Jalan ke Singapura untuk Muslimah',
    content:
      'Untuk banyak Muslimah traveler, Singapura adalah destinasi yang wajib dikunjungi. Skyline futuristik, transportasi canggih, kuliner menggoda, adalah beberapa hal yang ditawarkan Singapura. Tapi yang paling penting adalah spot Instagramable di mana-mana.',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
    date: '10 Desember 2024',
    tag: 'Singapura',
  },
  {
    id: '4',
    title: 'Menyelami Lezatnya Vietnam Panduan Kuliner untuk Muslimah',
    content:
      'Vietnam adalah negara yang memiliki kekayaan kuliner yang sangat tinggi. Dengan keindahan alam dan budaya yang kaya, Vietnam menawarkan pengalaman kuliner yang tak terlupakan bagi setiap pengunjung.',
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800',
    date: '8 Desember 2024',
    tag: 'Vietnam',
  },
  {
    id: '5',
    title: 'Liburan Halal Thailand di Bulan November: Paket Wisata Muslimah',
    content:
      'Mengapa November menjadi waktu terbaik untuk liburan ke Thailand? Temukan alasan mengapa bulan ini adalah pilihan sempurna untuk paket wisata Muslimah ke Thailand dengan cuaca yang ideal.',
    image: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=800',
    date: '5 Desember 2024',
    tag: 'Thailand',
  },
  {
    id: '6',
    title: 'Tips Agar Liburan untuk Muslimah di Eropa Lebih Berkesan',
    content:
      'Liburan ke Eropa bukan hanya tentang mengunjungi landmark terkenal, tetapi juga tentang merasakan budaya, seni, tradisi, dan gaya hidup masyarakat lokal. Panduan lengkap untuk liburan Muslimah di Eropa yang berkesan.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    date: '1 Desember 2024',
    tag: 'Eropa',
  },
];

export default function Artikel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchArticles()
      .then((data) => {
        if (active) {
          setArticles(data && data.length > 0 ? data : DUMMY_ARTICLES);
        }
      })
      .catch(() => {
        if (active) {
          setArticles(DUMMY_ARTICLES);
        }
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
      const haystack = [
        article.title,
        article.content,
        article.tag,
        article.category,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [articles, searchQuery]);

  return (
    <>
      <div className="relative w-full min-h-screen bg-orange-50 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto pb-20 mobile:pb-16 xs:pb-16">
          {/* Hero Section */}
          <HeroArtikelSection
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
            backgroundImage="/artikelher1.png"
          />

          {/* Articles Section */}
          <ArtikelSection
            articles={filteredArticles}
            loading={loading}
            onReadArticle={handleReadArticle}
            showInspirationText={true}
          />
        </div>
      </div>
    </>
  );
}
