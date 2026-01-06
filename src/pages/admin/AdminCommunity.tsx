import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { CommunityPost } from '../../api/community';
import { fetchCommunityPosts } from '../../api/community';

interface NavItem {
  key: string;
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', path: '/admin' },
  { key: 'users', label: 'Manajemen User', path: '/admin/users' },
  { key: 'packages', label: 'Manajemen Paket', path: '/admin/packages' },
  { key: 'articles', label: 'Manajemen Artikel', path: '/admin/articles' },
  { key: 'community', label: 'Manajemen Komunitas', path: '/admin/community' },
  { key: 'orders', label: 'Manajemen Order', path: '/admin/orders' },
];

function NavIcon({ name }: { name: NavItem['key'] }) {
  const stroke = '#8b6bd6';
  switch (name) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="3"
            width="8"
            height="8"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="13"
            y="3"
            width="8"
            height="5"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="3"
            y="13"
            width="5"
            height="8"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="10"
            y="13"
            width="11"
            height="8"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="9"
            cy="8"
            r="4"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M3 20c0-3.5 3-6 6-6"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="18"
            cy="9"
            r="3"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M15.5 15.5c1.5 0 5.5 1 5.5 4.5"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'packages':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M4 7.5v9l8 4.5 8-4.5v-9"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path d="M12 12v9" stroke={stroke} strokeWidth="2" fill="none" />
        </svg>
      );
    case 'articles':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="5"
            y="4"
            width="14"
            height="16"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M8 8h8M8 12h8M8 16h5"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'community':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="7"
            cy="9"
            r="3"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="17"
            cy="9"
            r="3"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M3 18c0-3 3-5 7-5"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M21 18c0-3-3-5-7-5"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'orders':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M7 9h10M7 13h7"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="m8 10 4 4 4-4"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M14 5h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 5v14"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 12h9"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m13 9-3 3 3 3"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle
        cx="12"
        cy="9"
        r="4"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
      />
      <path
        d="M6 20c0-3.5 3-6 6-6s6 2.5 6 6"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="m12 4 2.2 4.4 4.8.7-3.5 3.4.8 4.8L12 14.8 7.7 17.3l.8-4.8L5 9.1l4.8-.7Z"
        fill="#f4b400"
        stroke="#e3a200"
      />
    </svg>
  );
}

export default function AdminCommunity() {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthOpen, setMonthOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (current: string, target: string) =>
    target === '/admin'
      ? current === target
      : current === target || current.startsWith(`${target}/`);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('click', close);
    }
    return () => document.removeEventListener('click', close);
  }, [profileOpen]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCommunityPosts()
      .then((list) => {
        if (active) setPosts(list);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const sortedPosts = useMemo(() => posts, [posts]);

  return (
    <div className="flex min-h-screen bg-[#faf5f0]">
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${navOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setNavOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 h-screen w-[260px] bg-white shadow-[4px_0_18px_rgba(15,23,42,0.08)] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-3 p-6 border-b border-[#f0f0f0]">
          <div className="w-[46px] h-[46px] rounded-xl bg-gradient-to-br from-[#8b6bd6] to-[#6a4cb8] grid place-items-center shadow-[0_8px_20px_rgba(123,90,211,0.25)]">
            <img src="/logo.svg" alt="Saleema" className="w-[30px] h-[30px]" />
          </div>
          <div className="flex flex-col leading-tight">
            <strong className="text-[#2a2a2a] text-base">Saleema</strong>
            <span className="text-[#8a8a8a] text-sm">Tour</span>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-[6px] p-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`flex items-center gap-3 px-4 py-[13px] rounded-[12px] text-[15px] font-bold transition-all duration-150 ${isActive(location.pathname, item.path) ? 'bg-gradient-to-r from-[#8b6bd6] to-[#6a4cb8] text-white shadow-[0_8px_18px_rgba(123,90,211,0.28)]' : 'text-[#4a4a4a] hover:bg-[#f7f4ff]'}`}
              type="button"
              onClick={() => {
                setNavOpen(false);
                navigate(item.path);
              }}
            >
              <span className="w-[22px] h-[22px] flex-shrink-0">
                <NavIcon name={item.key as NavItem['key']} />
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col lg:ml-[260px]">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-white px-6 py-4 shadow-[0_2px_12px_rgba(15,23,42,0.08)] min-h-[74px]">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden flex flex-col gap-[5px] w-[28px] h-[28px] justify-center cursor-pointer"
              type="button"
              aria-label="Buka navigasi"
              onClick={() => setNavOpen(true)}
            >
              <span className="block w-full h-[3px] bg-[#7b5ad3] rounded-full" />
              <span className="block w-full h-[3px] bg-[#7b5ad3] rounded-full" />
              <span className="block w-full h-[3px] bg-[#7b5ad3] rounded-full" />
            </button>
            <h1 className="text-[22px] font-bold text-[#1d1d1f] m-0">
              Manajemen Komunitas
            </h1>
          </div>
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center gap-3 cursor-pointer bg-transparent border-none"
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <img
                src="/avatar.jpg"
                alt="Admin"
                className="w-[44px] h-[44px] rounded-full object-cover border-2 border-[#e8dfd6]"
              />
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <div className="text-[15px] font-bold text-[#2a2a2a]">
                  Madam
                </div>
                <div className="text-[13px] text-[#8a8a8a]">Admin</div>
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-[14px] shadow-[0_10px_32px_rgba(15,23,42,0.12)] min-w-[180px] py-2 z-50">
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-[10px] text-[15px] font-bold text-[#4a4a4a] bg-transparent border-none cursor-pointer hover:bg-[#f7f4ff] transition-colors duration-150"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/');
                  }}
                >
                  <span className="w-[20px] h-[20px] flex-shrink-0">
                    <IconLogout />
                  </span>
                  <span>Sign Out</span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-[10px] text-[15px] font-bold text-[#4a4a4a] bg-transparent border-none cursor-pointer hover:bg-[#f7f4ff] transition-colors duration-150"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/admin/profile');
                  }}
                >
                  <span className="w-[20px] h-[20px] flex-shrink-0">
                    <IconProfile />
                  </span>
                  <span>Edit Profil</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="bg-white rounded-2xl p-[18px] border border-[#f0e8ff] shadow-[0_18px_38px_rgba(15,23,42,0.12)] m-6">
          <div className="flex justify-between items-center gap-3">
            <h2 className="m-0 text-[22px] text-[#1d1d1f] font-bold">
              Forum Diskusi
            </h2>
            <button
              className="border border-[#e4d5ff] bg-[#f7f2ff] text-[#6b53b8] rounded-xl px-3 py-[10px] inline-flex items-center gap-[10px] cursor-pointer font-extrabold hover:bg-[#efe6ff] transition-colors duration-150"
              type="button"
              onClick={() => setMonthOpen((v) => !v)}
              aria-expanded={monthOpen}
            >
              November
              <span
                className={`w-[18px] h-[18px] inline-flex items-center justify-center transition-transform duration-200 ${monthOpen ? 'rotate-180' : ''}`}
              >
                <IconChevron />
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-[14px] mt-3">
            {loading ? (
              <div className="border border-[#f0d7e1] rounded-xl p-[14px] bg-[#fffdfd] shadow-[0_10px_18px_rgba(15,23,42,0.08)] text-[#6b6b6b]">
                Memuat data...
              </div>
            ) : sortedPosts.length === 0 ? (
              <div className="border border-[#f0d7e1] rounded-xl p-[14px] bg-[#fffdfd] shadow-[0_10px_18px_rgba(15,23,42,0.08)] text-[#6b6b6b]">
                Belum ada diskusi.
              </div>
            ) : (
              sortedPosts.map((post) => (
                <article
                  className="border border-[#f0d7e1] rounded-xl p-[14px] bg-[#fffdfd] shadow-[0_10px_18px_rgba(15,23,42,0.08)]"
                  key={post.id}
                >
                  <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-[10px]">
                    <h3 className="m-0 mb-2 sm:mb-0 text-[#2d2d2d] text-[17px] font-bold">
                      "{post.title}"
                    </h3>
                    <div className="flex items-start sm:items-center gap-[10px]">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-[38px] h-[38px] rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col">
                        <div className="font-extrabold text-[#1f1f1f]">
                          {post.author}
                        </div>
                        <div className="flex items-center gap-2 text-[#6b6b6b] font-bold text-sm">
                          <span className="w-4 h-4 flex-shrink-0">
                            <StarIcon />
                          </span>
                          <span>
                            {post.rating?.toFixed?.(1) ?? post.rating}
                          </span>
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </header>
                  <p className="m-0 mt-[10px] leading-[1.6] text-[#2f2f2f]">
                    {post.body}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
