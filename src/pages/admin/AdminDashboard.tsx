import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import avatarDefault from '@/assets/icon/avatar-default.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  fetchDashboard as fetchDashboardApi,
  type DashboardPayload,
  type Stat,
  type StatKey,
  type PackageStat,
  type Buyer,
  type StatusSegment,
  type TripRow,
  type DashboardStats,
  type BookingStatus,
} from '../../api/dashboard';
import { Dest1Image, Dest2Image, Dest3Image } from '@/assets/images';

const BASE_STATS: DashboardStats = {
  totalBooking: 200,
  profit: 20000000,
  pembeliAktif: 489,
};

const BASE_PACKAGES: PackageStat[] = [
  { name: 'Paket Tour Korea', percentage: 75, imageUrl: Dest1Image },
  { name: 'Paket Tour Japan', percentage: 55, imageUrl: Dest2Image },
  { name: 'Paket Tour Eropa', percentage: 35, imageUrl: Dest3Image },
];

const BASE_BUYERS: Buyer[] = [
  { nama: 'Sonya Nur Fadillah', totalBooking: 22, totalUlasan: 20 },
  { nama: 'Elsa Marta Saputri', totalBooking: 20, totalUlasan: 20 },
  { nama: 'Rinda Dwi Rahmawati', totalBooking: 18, totalUlasan: 18 },
  { nama: 'Mutiara Rengganis', totalBooking: 15, totalUlasan: 15 },
  { nama: 'Anisya Putri Niken', totalBooking: 12, totalUlasan: 12 },
  { nama: 'Farikh Assalsabila', totalBooking: 10, totalUlasan: 10 },
];

const BASE_STATUS: BookingStatus = {
  asia: 86,
  eropa: 70,
  australia: 42,
  afrika: 75,
};

const BASE_TRIPS: TripRow[] = [
  { buyer: 'Sonya Nur', tour: 'Uzbekistan', price: 21500000 },
  { buyer: 'Elsa Marta', tour: 'Japan', price: 17000000 },
  { buyer: 'Rinda Dwi', tour: 'Eropa', price: 25000000 },
];

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

function StatIcon({ name }: { name: StatKey }) {
  const fill = '#b595eb';
  switch (name) {
    case 'booking':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="3"
            fill="none"
            stroke={fill}
            strokeWidth="2"
          />
          <path d="M3 9h18" stroke={fill} strokeWidth="2" />
          <circle cx="8" cy="13" r="1.5" fill={fill} />
          <circle cx="12" cy="13" r="1.5" fill={fill} />
          <circle cx="16" cy="13" r="1.5" fill={fill} />
        </svg>
      );
    case 'profit':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 12.5 9.5 17 19 7.5"
            fill="none"
            stroke={fill}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M14 7.5H19V12"
            fill="none"
            stroke={fill}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'active':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="12"
            cy="8"
            r="4"
            fill="none"
            stroke={fill}
            strokeWidth="2"
          />
          <path
            d="M4 20c0-4 4-6 8-6s8 2 8 6"
            fill="none"
            stroke={fill}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace('Rp', 'Rp. ');

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardPayload>({
    stats: BASE_STATS,
    packages: BASE_PACKAGES,
    buyers: BASE_BUYERS,
    status: BASE_STATUS,
    trips: BASE_TRIPS,
  });
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const totalStatus = useMemo(() => {
    const statusValues = dashboardData.status;
    if (!statusValues) return 0;
    return Object.values(statusValues).reduce(
      (sum, value) => sum + (value || 0),
      0
    );
  }, [dashboardData.status]);

  const isActive = (current: string, target: string) =>
    target === '/admin'
      ? current === target
      : current === target || current.startsWith(`${target}/`);

  const loadDashboard = useCallback(async () => {
    try {
      const payload = await fetchDashboardApi();
      setDashboardData((prev) => ({
        stats: payload.stats ? payload.stats : prev.stats || BASE_STATS,
        packages:
          payload.packages &&
          Array.isArray(payload.packages) &&
          payload.packages.length
            ? payload.packages
            : prev.packages || BASE_PACKAGES,
        buyers:
          payload.buyers &&
          Array.isArray(payload.buyers) &&
          payload.buyers.length
            ? payload.buyers
            : prev.buyers || BASE_BUYERS,
        status: payload.status ? payload.status : prev.status || BASE_STATUS,
        trips:
          payload.trips && Array.isArray(payload.trips) && payload.trips.length
            ? payload.trips
            : prev.trips || BASE_TRIPS,
      }));
    } catch {
      setDashboardData((prev) => ({
        stats: prev.stats || BASE_STATS,
        packages: prev.packages || BASE_PACKAGES,
        buyers: prev.buyers || BASE_BUYERS,
        status: prev.status || BASE_STATUS,
        trips: prev.trips || BASE_TRIPS,
      }));
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    const id = setInterval(loadDashboard, 12000);
    return () => clearInterval(id);
  }, [loadDashboard]);

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
              Dashboard Admin
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
                  <span className="text-base inline-flex items-center justify-center w-5 h-5 text-center">
                    ↩
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
                  <span className="text-base inline-flex items-center justify-center w-5 h-5 text-center">
                    👤
                  </span>
                  <span>Edit Profil</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-[14px] sm:gap-3">
          {(dashboardData.stats
            ? [
                {
                  key: 'booking',
                  label: 'Total Booking',
                  value: dashboardData.stats.totalBooking,
                },
                {
                  key: 'profit',
                  label: 'Profit',
                  value: dashboardData.stats.profit,
                },
                {
                  key: 'active',
                  label: 'Pembeli Aktif',
                  value: dashboardData.stats.pembeliAktif,
                },
              ]
            : []
          ).map((s) => (
            <div
              key={s.key}
              className="bg-white p-4 sm:p-3 rounded-[14px] sm:rounded-2xl shadow-[0_16px_36px_rgba(15,23,42,0.12)] border border-[#f0e8ff] grid gap-2 content-start xs:grid-cols-[auto_1fr] xs:items-center"
            >
              <div className="w-12 h-12 xs:w-11 xs:h-11 rounded-xl bg-[#f2e9ff] grid place-items-center shadow-[inset_0_0_0_1px_#eadfff] xs:row-span-2">
                <StatIcon name={s.key as StatKey} />
              </div>
              <div className="text-[#7a7a80] font-bold leading-tight xs:col-start-2 text-sm">
                {s.label}
              </div>
              <div className="block text-[clamp(17px,4vw,22px)] xs:text-lg font-extrabold text-[#222222] leading-tight whitespace-normal break-words overflow-anywhere max-w-full xs:col-start-2">
                {s.key === 'profit' ? formatCurrency(s.value) : s.value}
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
          <div className="bg-white rounded-[14px] p-4 shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#f0e8ff]">
            <h3 className="m-0 mb-[14px] text-[17px] text-[#252525]">
              Paket Tour Teratas
            </h3>
            <div className="flex flex-col gap-[14px]">
              {(dashboardData.packages || []).map((p, index) => (
                <div
                  key={p.name || index}
                  className="grid grid-cols-1 md:grid-cols-[130px_1fr] gap-3 items-center"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full md:w-[130px] h-[180px] md:h-[90px] object-cover rounded-xl shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                  />
                  <div>
                    <div className="font-extrabold mb-2 text-[#2c2c2c]">
                      {p.name}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-[#ede7f6] h-[10px] rounded-full w-full overflow-hidden">
                        <span
                          className="block h-full bg-gradient-to-r from-[#b99cec] to-[#8e6bdd] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, p.percentage)}%` }}
                        />
                      </div>
                      <div className="font-extrabold text-[#4c4c55]">
                        {p.percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-4 shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#f0e8ff]">
            <div className="bg-gradient-to-r from-[#b28be2] to-[#caa8f3] text-white px-[14px] py-3 rounded-[10px] font-extrabold -mx-4 -mt-4 mb-[14px] shadow-[0_12px_24px_rgba(130,94,197,0.25)]">
              Pembeli Teratas
            </div>
            <div className="flex flex-col gap-3">
              {(dashboardData.buyers || []).map((b, index) => (
                <div
                  key={b.nama || index}
                  className="flex items-center gap-[10px] px-1 py-2 rounded-xl"
                >
                  <img
                    src={b.profileImage || avatarDefault}
                    alt={b.nama}
                    className="w-10 h-10 rounded-full object-cover bg-[#f5eefb]"
                  />
                  <div>
                    <div className="font-extrabold text-[#2c2c32]">
                      {b.nama}
                    </div>
                    <div className="text-[#8b8894] text-xs">
                      {b.totalBooking} Booking • {b.totalUlasan} Ulasan
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-4 sm:gap-3">
          <div className="bg-white rounded-[14px] p-4 shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#f0e8ff]">
            <h3 className="m-0 mb-[14px] text-[17px] text-[#252525]">
              Status Booking
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-items-center">
              <div className="relative w-[190px] h-[190px] sm:w-[160px] sm:h-[160px]">
                <svg
                  viewBox="0 0 120 120"
                  className="w-[190px] h-[190px] sm:w-[160px] sm:h-[160px] -rotate-90"
                >
                  <circle
                    className="fill-none stroke-[#f1e9ff] stroke-[12]"
                    cx="60"
                    cy="60"
                    r="42"
                  />
                  {Object.entries(dashboardData.status || {}).map(
                    ([label, value], index, arr) => {
                      const total = Object.values(
                        dashboardData.status || {}
                      ).reduce((sum, val) => sum + val, 0);
                      const pct = total ? (value / total) * 100 : 0;
                      const dash = (pct * 2 * Math.PI * 42) / 100;
                      const gap = 2 * Math.PI * 42 - dash;

                      const colors = [
                        '#55c0f6',
                        '#f776b9',
                        '#aabdf5',
                        '#61d4a5',
                      ];
                      const color = colors[index % colors.length];

                      const prevSegments = arr.slice(0, index);
                      const prevTotal = prevSegments.reduce(
                        (sum, [_, val]) => sum + (val / total) * 100,
                        0
                      );
                      const offset = -(prevTotal * 2 * Math.PI * 42) / 100;

                      return (
                        <circle
                          key={label}
                          className="fill-none stroke-[12] [stroke-linecap:round]"
                          stroke={color}
                          cx="60"
                          cy="60"
                          r="42"
                          strokeDasharray={`${dash} ${gap}`}
                          strokeDashoffset={offset}
                        />
                      );
                    }
                  )}
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-2xl font-extrabold text-[#252525]">
                    {Object.values(dashboardData.status || {}).reduce(
                      (sum, val) => sum + val,
                      0
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[10px]">
                {Object.entries(dashboardData.status || {}).map(
                  ([label, value], index) => {
                    const colors = ['#55c0f6', '#f776b9', '#aabdf5', '#61d4a5'];
                    const color = colors[index % colors.length];
                    return (
                      <div
                        key={label}
                        className="flex items-center gap-[10px] font-bold text-[#3b3b42]"
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span>
                          {label.charAt(0).toUpperCase() + label.slice(1)}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-4 shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#f0e8ff]">
            <div className="bg-gradient-to-b from-[#b58ee4] to-[#caa8f3] text-white px-[14px] py-3 rounded-[14px] font-extrabold -mx-4 -mt-4 mb-[14px] shadow-[0_12px_24px_rgba(130,94,197,0.25)]">
              Perjalanan Terbaru
            </div>
            <div className="grid gap-3">
              <div className="grid grid-cols-[1.3fr_1fr_1fr] sm:grid-cols-2 bg-gradient-to-b from-[#b58ee4] to-[#caa8f3] text-white px-[14px] sm:px-3 py-3 sm:py-[11px] rounded-[14px] font-extrabold shadow-[0_12px_24px_rgba(130,94,197,0.25)] text-left sm:text-[13px] sm:gap-y-1">
                <span>Pembeli</span>
                <span>Paket Tour</span>
                <span className="text-right justify-self-end sm:col-span-2">
                  Harga
                </span>
              </div>
              {(dashboardData.trips || []).map((t, index) => (
                <div
                  key={`${t.buyer}-${index}`}
                  className="grid grid-cols-[1.3fr_1fr_1fr] sm:grid-cols-2 items-start sm:items-center px-3 sm:px-[10px] py-3 bg-[#fffaf6] border border-[#f1e8ff] rounded-xl font-bold text-[#34343b] shadow-[0_10px_22px_rgba(0,0,0,0.06)] gap-2 sm:gap-[6px]"
                >
                  <div className="flex items-center gap-[10px]">
                    <img
                      src={avatarDefault}
                      alt={t.buyer}
                      className="w-8 h-8 rounded-full object-cover bg-[#f5eefb] shadow-[inset_0_0_0_1px_#efe6fc]"
                    />
                    <span>{t.buyer}</span>
                  </div>
                  <span>{t.tour}</span>
                  <span className="font-extrabold text-[#2f2f35] whitespace-normal overflow-anywhere text-right justify-self-end sm:col-span-2">
                    {formatCurrency(t.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
