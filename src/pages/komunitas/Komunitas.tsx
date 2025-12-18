import React, { useEffect, useMemo, useState } from 'react';

import HeroKomunitas from '../../components/section/komunitas/HeroKomunitas';
import SocialApproveKomunitasSection from '../../components/section/komunitas/SocialApproveKomunitasSection';
import ForumDiskusiKomunitas from '../../components/section/komunitas/ForumDiskusiKomunitas';
import PengomentarTerbaruKomunitasSection from '../../components/section/komunitas/PengomentarTerbaruKomunitasSection';
import KomentarKomunitasSection, {
  type CommentFormData,
} from '../../components/section/komunitas/KomentarKomunitasSection';
import SuccessModal from '../../components/modals/SuccessModal';

import {
  fetchCommunityPosts,
  createCommunityPost,
  type CommunityPost,
} from '../../api/community';

type Commenter = {
  avatar: string;
  name: string;
  rating: number;
};

const MONTH_ALL = 'Semua Bulan';

const formatMonthLabel = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }
  const match = value.match(
    /(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/i
  );
  if (match) {
    const month = match[1];
    const yearMatch = value.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : String(new Date().getFullYear());
    return `${month.charAt(0).toUpperCase()}${month.slice(1).toLowerCase()} ${year}`;
  }
  return '';
};

const DUMMY_DISCUSSIONS: CommunityPost[] = [
  {
    id: '1',
    title: 'Budget 6 Hari di Korea',
    body: 'Untuk trip 6D5N, kira-kira total budget minimal berapa ya? Termasuk makan halal & transport.',
    author: 'Sonya Nur Fadillah',
    rating: 4.8,
    timeAgo: '2 Hari Lalu',
    avatar:
      'https://images.unsplash.com/photo-1589553009868-c7b2bb474531?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '2',
    title: 'Musim Terbaik untuk Traveling ke Korea',
    body: 'Bingung pilih autumn atau winter. Dari pengalaman kalian, musim mana yang paling nyaman buat muslimah?',
    author: 'Elsa Marta Saputri',
    rating: 5,
    timeAgo: '1 Hari Lalu',
    avatar:
      'https://images.unsplash.com/photo-1683356476027-d81df5ccc048?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '3',
    title: 'Winter Outfit untuk Hijabers',
    body: 'Muslimah biasanya pakai inner hijab yang tipe apa biar hangat pas winter?',
    author: 'Rinda Dwi R.',
    rating: 4.6,
    timeAgo: '2 Minggu Lalu',
    avatar:
      'https://images.unsplash.com/photo-1556899376-9e4367054307?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '4',
    title: 'Packing Wajib Musim Dingin?',
    body: 'Untuk trip 6 hari, barang wajib apa saja? Butuh rekomendasi skincare anti-kering juga.',
    author: 'Cyntia Nurul F.',
    rating: 4.5,
    timeAgo: '3 Hari Lalu',
    avatar:
      'https://images.unsplash.com/photo-1683356476027-d81df5ccc048?auto=format&fit=crop&w=200&q=80',
  },
];

const DUMMY_COMMENTERS: Commenter[] = [
  {
    name: 'Elsa Marta Saputri',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1556899376-9e4367054307?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Sonya Nur Fadillah',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1683356476027-d81df5ccc048?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Cyntia Nurul F.',
    rating: 4.5,
    avatar:
      'https://images.unsplash.com/photo-1589553009868-c7b2bb474531?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Rinda Dwi R.',
    rating: 4.6,
    avatar:
      'https://images.unsplash.com/photo-1683356476027-d81df5ccc048?auto=format&fit=crop&w=200&q=80',
  },
];

export default function Komunitas() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(MONTH_ALL);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [discussions, setDiscussions] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchCommunityPosts()
      .then((data) => {
        if (active) {
          if (data && data.length > 0) {
            setDiscussions(data);
          } else {
            setDiscussions(DUMMY_DISCUSSIONS);
          }
        }
      })
      .catch((err) => {
        if (active) {
          console.error('Error fetching community posts:', err);
          setDiscussions(DUMMY_DISCUSSIONS);
          setError(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const monthOptions = useMemo(() => {
    const set = new Set<string>([MONTH_ALL]);
    discussions.forEach((d) => {
      const label = formatMonthLabel(d.timeAgo);
      if (label) set.add(label);
    });
    return Array.from(set);
  }, [discussions]);

  useEffect(() => {
    if (!monthOptions.includes(selectedMonth)) {
      setSelectedMonth(monthOptions[0] || MONTH_ALL);
    }
  }, [monthOptions, selectedMonth]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddComment = async (data: CommentFormData) => {
    setSubmitting(true);
    try {
      const payload = {
        judul: data.judul,
        komentar: data.komentar,
        rating: data.rating,
        tanggal: data.tanggal || new Date().toISOString(),
      };

      const result = await createCommunityPost(payload);
      if (result) {
        setDiscussions((prev) => [result, ...prev]);
        setShowSuccessModal(true);

        setTimeout(() => {
          fetchCommunityPosts()
            .then((fetchedData) => {
              if (fetchedData && fetchedData.length > 0) {
                setDiscussions(fetchedData);
              }
            })
            .catch((err) => {
              console.error('Error refreshing posts:', err);
            });
        }, 1000);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Gagal menambahkan komentar. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
  };

  const filteredDiscussions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return discussions.filter((discussion) => {
      const matchSearch =
        discussion.title.toLowerCase().includes(q) ||
        discussion.body.toLowerCase().includes(q) ||
        discussion.author.toLowerCase().includes(q);

      const monthLabel = formatMonthLabel(discussion.timeAgo);
      const matchMonth =
        selectedMonth === MONTH_ALL || monthLabel === selectedMonth;

      return matchSearch && matchMonth;
    });
  }, [discussions, searchQuery, selectedMonth]);

  const commenters: Commenter[] = useMemo(() => {
    const mapped = discussions
      .map((d) => ({
        avatar: d.avatar || '/avatar.jpg',
        name: d.author,
        rating: typeof d.rating === 'number' ? d.rating : Number(d.rating) || 0,
      }))
      .filter((c) => Boolean(c.name));

    if (mapped.length) return mapped.slice(0, 5);
    return DUMMY_COMMENTERS;
  }, [discussions]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white via-pink-50/20 to-white">
      {/* Hero Section */}
      <HeroKomunitas
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
      />

      {/* Social Proof Statistics */}
      <SocialApproveKomunitasSection
        activeMembers="50K+"
        topicCount="100+"
        averageRating="4.9"
        responseRate="95%"
        className="pt-10"
      />

      {/* Forum Discussion Section with Sidebar */}
      <ForumDiskusiKomunitas
        discussions={loading ? [] : filteredDiscussions}
        selectedMonth={selectedMonth}
        monthOptions={monthOptions}
        onMonthChange={handleMonthSelect}
        sidebar={
          <PengomentarTerbaruKomunitasSection
            commenters={commenters}
            variant="sidebar"
          />
        }
      />

      {/* Comment Form Section */}
      <KomentarKomunitasSection
        onSubmit={handleAddComment}
        loading={submitting}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Berhasil Menambahkan Komentar"
        message="Komentar anda berhasil ditambahkan ke forum diskusi"
        primaryText="Tutup"
      />
    </div>
  );
}
