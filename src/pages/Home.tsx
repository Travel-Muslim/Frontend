import { useEffect, useState } from 'react';
import HeroHomeSection from '@/components/section/home/HeroHomeSection';
import CariDestinasiHomeSection from '@/components/section/home/CariDestinasiHomeSection';
import WisataPilihanHomeSection from '@/components/section/home/WisataPilihanHomeSection';
import PaketTourCtaHomeSection from '@/components/section/home/PaketTourCtaHomeSection';
import ArtikelHomeSection from '@/components/section/home/ArtikelHomeSection';
import SocialApproveHomeSection from '@/components/section/home/SocialApproveHomeSection';
import TestimoniHomeSection from '@/components/section/home/TestimoniHomeSection';
import { fetchPackages, type PackageDetail } from '@api/packages';
import { fetchArticles, type Article } from '@api/articles';

// Main HomePage Component
export default function HomePage() {
  const [packages, setPackages] = useState<PackageDetail[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  // Fetch packages data
  useEffect(() => {
    let active = true;
    setPackagesLoading(true);
    fetchPackages(100)
      .then((data) => {
        if (active) setPackages(data);
      })
      .finally(() => active && setPackagesLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Fetch articles data
  useEffect(() => {
    let active = true;
    setArticlesLoading(true);
    fetchArticles()
      .then((data) => {
        if (active) setArticles(data);
      })
      .finally(() => active && setArticlesLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-inter overflow-x-hidden w-full max-w-full relative">
      <main className="relative overflow-x-hidden w-full max-w-full">
        {/* Hero Section */}
        <HeroHomeSection />

        {/* Cari Destinasi Section */}
        <CariDestinasiHomeSection />

        {/* Wisata Pilihan Section */}
        <WisataPilihanHomeSection
          packages={packages}
          loading={packagesLoading}
        />

        {/* Paket Tour CTA Section */}
        <PaketTourCtaHomeSection />

        {/* Artikel Section */}
        <ArtikelHomeSection articles={articles} loading={articlesLoading} />

        {/* Social Approve Section */}
        <SocialApproveHomeSection />

        {/* Testimoni Section */}
        <TestimoniHomeSection />
      </main>
    </div>
  );
}
