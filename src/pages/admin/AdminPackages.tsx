import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchPackages, type PackageDetail } from '../../api/packages';

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

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M15.5 5.5 18.5 8.5 9 18H6v-3L15.5 5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 7.5 16.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M6 7h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 7v12m6-12v12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 4h4a1 1 0 0 1 1 1v2H9V5a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 7h14v12.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5V7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M5 12.5 10 17.5 19 7"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
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

export default function AdminPackages() {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [packages, setPackages] = useState<PackageDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
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
    fetchPackages()
      .then((data) => {
        if (active) setPackages(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return packages;
    return packages.filter((p) => {
      const haystack = [
        p.name,
        p.location,
        p.periode_start,
        p.maskapai,
        p.bandara,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [packages, query]);

  const handleDelete = (id: number | string) => setConfirmId(Number(id));
  const confirmDelete = () => {
    if (confirmId == null) return;
    setPackages((prev) => prev.filter((p) => Number(p.id) !== confirmId));
    setConfirmId(null);
    setDeleteSuccess(true);
  };

  return (
    <div
      className={`min-h-screen grid grid-cols-1 lg:grid-cols-[250px_1fr] bg-[#fdf7f0] text-[#1d1d1f] ${navOpen ? 'overflow-hidden' : ''}`}
    >
      <div
        className={`fixed inset-0 bg-black/25 z-[15] transition-opacity duration-200 ${navOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setNavOpen(false)}
      />

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] max-w-[82vw] sm:max-w-[90vw] bg-white border-r border-[#f0e8e2] px-[18px] lg:px-[18px] py-6 flex flex-col gap-6 lg:gap-6 z-30 transition-transform duration-[280ms] ease-out overflow-y-auto ${navOpen ? 'translate-x-0 shadow-[18px_0_38px_rgba(15,23,42,0.14)]' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#f4ebff] rounded-[14px] grid place-items-center shadow-[0_10px_30px_rgba(157,129,224,0.2)]">
            <img src="/logo.svg" alt="Saleema" className="w-8 h-8" />
          </div>
          <div>
            <strong className="block text-[17px] sm:text-[15px]">
              Saleema
            </strong>
            <span className="text-[#b08cf2] font-bold text-[14px] sm:text-[12px] tracking-[0.1px]">
              Tour
            </span>
          </div>
        </div>
        <nav className="flex flex-col gap-2 w-full">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`border-0 flex items-center gap-3 px-[14px] py-3 rounded-xl font-bold cursor-pointer transition-all duration-150 whitespace-normal text-left ${
                isActive(location.pathname, item.path)
                  ? 'bg-gradient-to-r from-[#efebff] to-[#f7f1ff] text-[#6f4ab1] shadow-[0_8px_18px_rgba(140,107,214,0.15)]'
                  : 'bg-transparent text-[#4a4a4f] hover:bg-gradient-to-r hover:from-[#efebff] hover:to-[#f7f1ff] hover:text-[#6f4ab1] hover:shadow-[0_8px_18px_rgba(140,107,214,0.15)]'
              } sm:text-[12.5px] sm:px-[10px] sm:py-2 sm:leading-tight`}
              type="button"
              onClick={() => {
                setNavOpen(false);
                navigate(item.path);
              }}
            >
              <span
                className={`w-8 h-8 rounded-[10px] grid place-items-center ${
                  isActive(location.pathname, item.path)
                    ? 'bg-[#d6c2ff] shadow-[0_8px_18px_rgba(140,107,214,0.2)]'
                    : 'bg-[#f7f0ff] shadow-[inset_0_0_0_1px_#efe6fc]'
                }`}
              >
                <NavIcon name={item.key as NavItem['key']} />
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="px-4 sm:px-8 py-7 pb-12 flex flex-col gap-[18px]">
        <header className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-[10px]">
            <button
              className="lg:hidden w-10 h-10 rounded-xl border border-[#e6dafd] bg-[#f7f0ff] p-2 flex flex-col justify-center items-center gap-[5px] shadow-[0_10px_22px_rgba(140,107,214,0.2)] cursor-pointer"
              type="button"
              aria-label="Buka navigasi"
              onClick={() => setNavOpen(true)}
            >
              <span className="block w-full h-[2px] rounded-full bg-[#7b5ad3]" />
              <span className="block w-full h-[2px] rounded-full bg-[#7b5ad3]" />
              <span className="block w-full h-[2px] rounded-full bg-[#7b5ad3]" />
            </button>
            <h1 className="m-0 text-[22px] sm:text-[18px] md:text-[20px] text-[#1f1f28]">
              Manajemen Paket
            </h1>
          </div>
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center gap-[10px] sm:gap-2 bg-white px-3 py-2 rounded-[14px] shadow-[0_12px_30px_rgba(15,23,42,0.12)] border border-[#f2e9ff] cursor-pointer"
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <img
                src="/avatar.jpg"
                alt="Admin"
                className="w-[42px] h-[42px] sm:w-[38px] sm:h-[38px] rounded-full object-cover"
              />
              <div>
                <div className="font-extrabold text-[14px] sm:text-[13px]">
                  Madam
                </div>
                <div className="text-[#9b9aa5] text-xs sm:text-[11px]">
                  Admin
                </div>
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-[#ece9f6] shadow-[0_14px_32px_rgba(0,0,0,0.12)] rounded-xl p-[6px] min-w-[170px] z-[35]">
                <button
                  type="button"
                  className="w-full flex items-center gap-[10px] px-[10px] py-[10px] border-0 bg-transparent font-bold text-[#3a3a3a] rounded-[10px] cursor-pointer transition-colors duration-150 hover:bg-[#f5f2ff]"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/');
                  }}
                >
                  <span className="w-5 h-5 inline-flex items-center justify-center">
                    <IconLogout />
                  </span>
                  <span>Sign Out</span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-[10px] px-[10px] py-[10px] border-0 bg-transparent font-bold text-[#3a3a3a] rounded-[10px] cursor-pointer transition-colors duration-150 hover:bg-[#f5f2ff]"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/admin/profile');
                  }}
                >
                  <span className="w-5 h-5 inline-flex items-center justify-center">
                    <IconProfile />
                  </span>
                  <span>Edit Profil</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="bg-white rounded-2xl p-[18px] sm:p-[14px] shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#f0e8ff]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-[14px]">
            <h2 className="m-0 text-lg text-[#2a2a2a]">Daftar Paket</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[10px] sm:gap-[10px] w-full sm:w-auto flex-wrap sm:justify-end">
              <div className="flex items-center gap-2 bg-white border border-[#e7dff4] px-[10px] py-[7px] rounded-lg min-w-0 w-full sm:w-[320px] sm:max-w-[320px] h-10 sm:flex-[0_0_auto] shadow-[inset_0_0_0_1px_#f5eefc]">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="w-4 h-4 flex-shrink-0"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke="#a6a6a6"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="m15 15 4.5 4.5"
                    stroke="#a6a6a6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Cari Paket"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="border-0 outline-none w-full text-sm bg-transparent text-[#2f2f2f]"
                />
              </div>
              <button
                type="button"
                className="border-0 bg-[#22c6b6] text-white rounded-xl px-[14px] py-[10px] font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap w-full sm:w-auto"
                onClick={() => navigate('/admin/packages/new')}
              >
                <IconPlus />
                Tambahkan Paket
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="grid gap-2 min-w-[980px] lg:min-w-0">
              <div className="hidden lg:grid grid-cols-[0.5fr_2fr_1.6fr_2fr_1.6fr_1.3fr_1fr] bg-[#b28be2] text-white font-extrabold px-[14px] py-3 rounded-xl shadow-[0_12px_24px_rgba(130,94,197,0.2)]">
                <span>ID</span>
                <span>Nama Paket</span>
                <span>Lokasi</span>
                <span>Keberangkatan</span>
                <span>Maskapai</span>
                <span>Harga</span>
                <span>Aksi</span>
              </div>
              {loading ? (
                <div className="grid lg:grid-cols-[0.5fr_2fr_1.6fr_2fr_1.6fr_1.3fr_1fr] grid-cols-1 lg:items-center bg-white border border-[#f0d7e1] rounded-xl px-[14px] py-3 shadow-[0_10px_18px_rgba(15,23,42,0.08)] text-[#323232] font-semibold gap-2">
                  <span data-label="ID">Memuat data...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="grid lg:grid-cols-[0.5fr_2fr_1.6fr_2fr_1.6fr_1.3fr_1fr] grid-cols-1 lg:items-center bg-white border border-[#f0d7e1] rounded-xl px-[14px] py-3 shadow-[0_10px_18px_rgba(15,23,42,0.08)] text-[#323232] font-semibold gap-2">
                  <span data-label="ID">Belum ada paket</span>
                </div>
              ) : (
                filtered.map((p) => (
                  <div
                    className="grid lg:grid-cols-[0.5fr_2fr_1.6fr_2fr_1.6fr_1.3fr_1fr] grid-cols-1 lg:items-center bg-white border border-[#f0d7e1] rounded-xl px-[14px] sm:px-3 py-3 shadow-[0_10px_18px_rgba(15,23,42,0.08)] text-[#323232] font-semibold gap-2 lg:gap-2"
                    key={p.id}
                  >
                    <span
                      data-label="ID"
                      className="overflow-hidden text-ellipsis lg:whitespace-nowrap whitespace-normal before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                    >
                      {p.id}
                    </span>
                    <span
                      data-label="Nama Paket"
                      className="overflow-hidden text-ellipsis lg:whitespace-nowrap whitespace-normal before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                    >
                      {p.name}
                    </span>
                    <span
                      data-label="Lokasi"
                      className="overflow-hidden text-ellipsis lg:whitespace-nowrap whitespace-normal before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                    >
                      {p.location}
                    </span>
                    <span
                      data-label="Keberangkatan"
                      className="overflow-hidden text-ellipsis lg:whitespace-nowrap whitespace-normal before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                    >
                      {p.periode_start}
                    </span>
                    <span
                      data-label="Maskapai"
                      className="overflow-hidden text-ellipsis lg:whitespace-nowrap whitespace-normal before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                    >
                      {p.maskapai}
                    </span>
                    <span
                      data-label="Harga"
                      className="overflow-hidden text-ellipsis lg:whitespace-nowrap whitespace-normal before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                    >
                      {p.price ? `Rp${p.price.toLocaleString('id-ID')}` : '-'}
                    </span>
                    <span
                      className="inline-flex items-center gap-2 lg:justify-end justify-start before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                      data-label="Aksi"
                    >
                      <button
                        type="button"
                        className="w-[34px] h-[34px] sm:w-8 sm:h-8 rounded-[10px] border border-[#d6eaff] bg-[#f4f9ff] grid place-items-center cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.08)] text-sm"
                        aria-label="Lihat paket"
                        onClick={() => navigate(`/admin/packages/${p.id}`)}
                      >
                        <IconEye />
                      </button>
                      <button
                        type="button"
                        className="w-[34px] h-[34px] sm:w-8 sm:h-8 rounded-[10px] border border-[#ffeec2] bg-[#fffaf0] grid place-items-center cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.08)] text-sm"
                        aria-label="Edit paket"
                        onClick={() => navigate(`/admin/packages/${p.id}`)}
                      >
                        <IconPencil />
                      </button>
                      <button
                        type="button"
                        className="w-[34px] h-[34px] sm:w-8 sm:h-8 rounded-[10px] border border-[#ffd6d6] bg-[#fff5f5] grid place-items-center cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.08)] text-sm"
                        aria-label="Hapus paket"
                        onClick={() => handleDelete(Number(p.id))}
                      >
                        <IconTrash />
                      </button>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {confirmId !== null && (
          <div className="fixed inset-0 bg-black/35 grid place-items-center p-4 z-50">
            <div className="bg-white rounded-[18px] px-5 py-6 max-w-[480px] w-full text-center shadow-[0_20px_40px_rgba(15,23,42,0.2)]">
              <div className="w-[92px] h-[92px] rounded-full grid place-items-center mx-auto mb-4 text-[46px] font-extrabold text-white bg-[#f7b5c2]">
                !
              </div>
              <h3 className="m-0 mb-[10px] text-[22px] text-[#414141]">
                Hapus Paket?
              </h3>
              <p className="m-0 mb-4 text-[#5a5a5a] text-base">
                Paket ini akan terhapus dari daftar.
              </p>
              <div className="flex justify-center gap-[10px] flex-wrap">
                <button
                  type="button"
                  className="border-0 rounded-xl px-[22px] py-3 font-extrabold cursor-pointer text-white min-w-[140px] text-[15px] bg-[#f87171]"
                  onClick={() => setConfirmId(null)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="border-0 rounded-xl px-[22px] py-3 font-extrabold cursor-pointer text-white min-w-[140px] text-[15px] bg-[#22c6b6]"
                  onClick={confirmDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteSuccess && (
          <div className="fixed inset-0 bg-black/35 grid place-items-center p-4 z-50">
            <div className="bg-white rounded-[18px] px-5 py-6 max-w-[480px] w-full text-center shadow-[0_20px_40px_rgba(15,23,42,0.2)]">
              <div className="w-[92px] h-[92px] rounded-full grid place-items-center mx-auto mb-4 text-[46px] font-extrabold text-white bg-[#22c6b6]">
                <IconCheck />
              </div>
              <h3 className="m-0 mb-[10px] text-[22px] text-[#414141]">
                Paket Berhasil Dihapus
              </h3>
              <p className="m-0 mb-4 text-[#5a5a5a] text-base">
                Paket telah dihapus dari daftar.
              </p>
              <div className="flex justify-center gap-[10px] flex-wrap">
                <button
                  type="button"
                  className="border-0 rounded-xl px-[22px] py-3 font-extrabold cursor-pointer text-white min-w-[140px] text-[15px] bg-[#22c6b6]"
                  onClick={() => setDeleteSuccess(false)}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
