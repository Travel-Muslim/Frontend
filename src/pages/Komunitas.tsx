import React, { useEffect, useMemo, useState } from "react";
import SearchBarInput from "../components/SearchBarInput";
import StatCard from "../components/StatCard";
import ForumCard from "../components/ForumCard";
import RecentCommenters from "../components/RecentCommenters";
import AddCommentForm from "../components/AddCommentForm";
import Button from "../components/Button";
import SuccessModal from "../components/SuccessModal";
import type { CommunityPost } from "../api/community";
import "./Komunitas.css";

type Commenter = {
  avatar: string;
  name: string;
  rating: number;
};

const MONTH_ALL = "Semua Bulan";

const formatMonthLabel = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  }
  const match = value.match(/(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/i);
  if (match) {
    const month = match[1];
    const yearMatch = value.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : String(new Date().getFullYear());
    return `${month.charAt(0).toUpperCase()}${month.slice(1).toLowerCase()} ${year}`;
  }
  return "";
};

const DUMMY_DISCUSSIONS: CommunityPost[] = [
  {
    id: "1",
    title: "Budget 6 Hari di Korea",
    body: "Untuk trip 6D5N, kira-kira total budget minimal berapa ya? Termasuk makan halal & transport.",
    author: "Sonya Nur Fadillah",
    rating: 4.8,
    timeAgo: "2 Hari Lalu",
    avatar: "https://images.unsplash.com/photo-1589553009868-c7b2bb474531?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "2",
    title: "Musim Terbaik untuk Traveling ke Korea",
    body: "Bingung pilih autumn atau winter. Dari pengalaman kalian, musim mana yang paling nyaman buat muslimah?",
    author: "Elsa Marta Saputri",
    rating: 5,
    timeAgo: "1 Hari Lalu",
    avatar: "https://images.unsplash.com/photo-1683356476027-d81df5ccc048?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "3",
    title: "Winter Outfit untuk Hijabers",
    body: "Muslimah biasanya pakai inner hijab yang tipe apa biar hangat pas winter?",
    author: "Rinda Dwi R.",
    rating: 4.6,
    timeAgo: "2 Minggu Lalu",
    avatar: "https://images.unsplash.com/photo-1556899376-9e4367054307?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "4",
    title: "Packing Wajib Musim Dingin?",
    body: "Untuk trip 6 hari, barang wajib apa saja? Butuh rekomendasi skincare anti-kering juga.",
    author: "Cyntia Nurul F.",
    rating: 4.5,
    timeAgo: "3 Hari Lalu",
    avatar: "https://images.unsplash.com/photo-1683356476027-d81df5ccc048?auto=format&fit=crop&w=200&q=80",
  },
];

const DUMMY_COMMENTERS: Commenter[] = [
  { name: "Elsa Marta Saputri", rating: 5, avatar: "https://images.unsplash.com/photo-1556899376-9e4367054307?auto=format&fit=crop&w=200&q=80" },
  { name: "Sonya Nur Fadillah", rating: 5, avatar: "https://images.unsplash.com/photo-1683356476027-d81df5ccc048?auto=format&fit=crop&w=200&q=80" },
  { name: "Cyntia Nurul F.", rating: 4.5, avatar: "https://images.unsplash.com/photo-1589553009868-c7b2bb474531?auto=format&fit=crop&w=200&q=80" },
  { name: "Rinda Dwi R.", rating: 4.6, avatar: "https://images.unsplash.com/photo-1683356476027-d81df5ccc048?auto=format&fit=crop&w=200&q=80" },
];

export default function Komunitas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(MONTH_ALL);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [discussions, setDiscussions] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Gunakan data dummy agar konten tetap tampil tanpa ketergantungan API
    setDiscussions(DUMMY_DISCUSSIONS);
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

  const handleAddComment = (data: any) => {
    console.log("Add comment:", data);
    setShowSuccessModal(true);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setShowMonthDropdown(false);
  };

  const stats = useMemo(() => {
    // Data dummy agar terlihat ramai
    const activeMembers = "50K+";
    const topics = "100+";
    const avgRating = 4.9;
    const responseRate = "95%";
    return [
      { value: activeMembers, label: "Anggota Komunitas Aktif" },
      { value: topics, label: "Topik Diskusi" },
      { value: `${avgRating.toFixed(1)}`, label: "Rata-Rata Rating" },
      { value: responseRate, label: "Tingkat Respons Diskusi" },
    ];
  }, []);

  const filteredDiscussions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return discussions.filter((discussion) => {
      const matchSearch =
        discussion.title.toLowerCase().includes(q) ||
        discussion.body.toLowerCase().includes(q) ||
        discussion.author.toLowerCase().includes(q);
      const monthLabel = formatMonthLabel(discussion.timeAgo);
      const matchMonth = selectedMonth === MONTH_ALL || monthLabel === selectedMonth;
      return matchSearch && matchMonth;
    });
  }, [discussions, searchQuery, selectedMonth]);

  const commenters: Commenter[] = useMemo(() => {
    const mapped = discussions
      .map((d) => ({
        avatar: d.avatar || "/avatar.jpg",
        name: d.author,
        rating: typeof d.rating === "number" ? d.rating : Number(d.rating) || 0,
      }))
      .filter((c) => Boolean(c.name));
    if (mapped.length) return mapped.slice(0, 5);
    return DUMMY_COMMENTERS;
  }, [discussions]);

  return (
    <div className="komunitas-page-wrapper">
      {/* HERO */}
      <section className="komunitas-hero-section">
        <div className="komunitas-hero-bg">
          <img src="/komher1.png" alt="Komunitas hero" className="komunitas-hero-bg-image" />
          <div className="komunitas-hero-overlay" />
        </div>
        <div className="komunitas-hero-content">
          <div className="komunitas-hero-title-wrapper">
            <h1 className="komunitas-hero-title">Komunitas Travel</h1>
          </div>
          <div className="komunitas-hero-subtitle-wrapper">
            <p className="komunitas-hero-subtitle">
              Akses langsung ke berbagai insight, tips halal-friendly, dan tanya jawab seputar destinasi. Tempat terbaik untuk merencanakan trip yang tenang.
            </p>
          </div>

          <div className="komunitas-search-wrapper">
            <div className="komunitas-search-bar">
              <SearchBarInput
                placeholder="Cari topik komentar"
                value={searchQuery}
                onChange={handleSearchChange}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="komunitas-page-container">
        {/* STATS */}
        <section className="komunitas-stats-section">
          <div className="komunitas-stats-grid">
            {stats.map((stat) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="komunitas-content-section">
          {/* LEFT */}
          <div className="komunitas-left-column">
            <div className="komunitas-forum-panel">
              <div className="komunitas-forum-header">
                <div className="komunitas-forum-title-wrapper">
                  <h2 className="komunitas-forum-title">Forum Diskusi</h2>
                </div>

                <div className="komunitas-month-filter-wrapper">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowMonthDropdown((prev) => !prev)}
                      className="komunitas-month-button"
                    >
                      <span className="komunitas-month-label">{selectedMonth}</span>
                      <span className="komunitas-month-caret" aria-hidden="true">
                        <svg fill="none" viewBox="0 0 30 30">
                          <path
                            d="M6 9L12 15L18 9"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </span>
                    </button>

                    {showMonthDropdown && (
                      <div className="komunitas-month-dropdown">
                        {monthOptions.map((month) => (
                          <button
                            key={month}
                            type="button"
                            onClick={() => handleMonthSelect(month)}
                            className="komunitas-month-item"
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="komunitas-forum-cards">
                {loading ? (
                  <ForumCard
                    key="loading"
                    avatar=""
                    name="Memuat..."
                    rating={0}
                    timeAgo=""
                    title="Memuat diskusi"
                    description="Sedang memuat diskusi komunitas dari server."
                  />
                ) : filteredDiscussions.length === 0 ? (
                  <ForumCard
                    key="empty"
                    avatar=""
                    name="Belum ada diskusi"
                    rating={0}
                    timeAgo=""
                    title="Belum ada data"
                    description="Forum akan muncul di sini setelah ada data dari backend."
                  />
                ) : (
                  filteredDiscussions.map((discussion) => (
                    <ForumCard
                      key={discussion.id}
                      avatar={discussion.avatar || ""}
                      name={discussion.author}
                      rating={discussion.rating || 0}
                      timeAgo={discussion.timeAgo || ""}
                      title={discussion.title}
                      description={discussion.body}
                    />
                  ))
                )}
              </div>
            </div>

            <section id="add-comment-form" className="komunitas-add-comment-panel">
              <AddCommentForm onSubmit={handleAddComment} />
            </section>
          </div>

          {/* RIGHT */}
          <div className="komunitas-right-column">
            <section className="komunitas-recent-section">
              <RecentCommenters commenters={commenters} />
            </section>

            <div className="komunitas-cta-wrapper">
              <Button
                className="komunitas-diskusi-button"
                onClick={() => {
                  const formEl = document.getElementById("add-comment-form");
                  if (formEl) {
                    formEl.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                Ikut Diskusi Sekarang
              </Button>
            </div>
          </div>
        </section>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Berhasil Menambahkan Komentar"
        message="Komentar anda berhasil ditambahkan"
        primaryText="Selanjutnya"
      />
    </div>
  );
}
