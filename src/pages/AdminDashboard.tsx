import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./AdminDashboard.css";
import avatarDefault from "../assets/icon/avatar-default.svg";
import Dest1 from "../assets/Dest1.png";
import Dest2 from "../assets/Dest2.png";
import Dest3 from "../assets/Dest3.png";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchDashboard as fetchDashboardApi, type DashboardPayload, type Stat, type StatKey, type PackageStat, type Buyer, type StatusSegment, type TripRow } from "../api/dashboard";

const BASE_STATS: Stat[] = [
  { key: "booking", label: "Total Booking", value: 200 },
  { key: "profit", label: "Profit", value: 20000000 },
  { key: "active", label: "Pembeli Aktif", value: 489 },
];

const BASE_PACKAGES: PackageStat[] = [
  { title: "Paket Tour Korea", image: Dest1, progress: 75 },
  { title: "Paket Tour Japan", image: Dest2, progress: 55 },
  { title: "Paket Tour Eropa", image: Dest3, progress: 35 },
];

const BASE_BUYERS: Buyer[] = [
  { name: "Sonya Nur Fadillah", bookings: 22, reviews: 20 },
  { name: "Elsa Marta Saputri", bookings: 20, reviews: 20 },
  { name: "Rinda Dwi Rahmawati", bookings: 18, reviews: 18 },
  { name: "Mutiara Rengganis", bookings: 15, reviews: 15 },
  { name: "Anisya Putri Niken", bookings: 12, reviews: 12 },
  { name: "Farikh Assalsabila", bookings: 10, reviews: 10 },
];

const BASE_STATUS: StatusSegment[] = [
  { label: "Paket Halal Tour Asia", value: 86, color: "#55c0f6" },
  { label: "Paket Halal Tour Eropa", value: 70, color: "#f776b9" },
  { label: "Paket Halal Tour Australia", value: 42, color: "#aabdf5" },
  { label: "Paket Halal Tour Afrika", value: 75, color: "#61d4a5" },
];

const BASE_TRIPS: TripRow[] = [
  { buyer: "Sonya Nur", tour: "Uzbekistan", price: 21500000 },
  { buyer: "Elsa Marta", tour: "Japan", price: 17000000 },
  { buyer: "Rinda Dwi", tour: "Eropa", price: 25000000 },
];

interface NavItem {
  key: string;
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", path: "/admin" },
  { key: "users", label: "Manajemen User", path: "/admin/users" },
  { key: "packages", label: "Manajemen Paket", path: "/admin/packages" },
  { key: "articles", label: "Manajemen Artikel", path: "/admin/articles" },
  { key: "community", label: "Manajemen Komunitas", path: "/admin/community" },
  { key: "orders", label: "Manajemen Order", path: "/admin/orders" },
];

function NavIcon({ name }: { name: NavItem["key"] }) {
  const stroke = "#8b6bd6";
  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="8" height="8" rx="2" stroke={stroke} strokeWidth="2" fill="none" />
          <rect x="13" y="3" width="8" height="5" rx="2" stroke={stroke} strokeWidth="2" fill="none" />
          <rect x="3" y="13" width="5" height="8" rx="2" stroke={stroke} strokeWidth="2" fill="none" />
          <rect x="10" y="13" width="11" height="8" rx="2" stroke={stroke} strokeWidth="2" fill="none" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="9" cy="8" r="4" stroke={stroke} strokeWidth="2" fill="none" />
          <path d="M3 20c0-3.5 3-6 6-6" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="18" cy="9" r="3" stroke={stroke} strokeWidth="2" fill="none" />
          <path d="M15.5 15.5c1.5 0 5.5 1 5.5 4.5" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "packages":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z" stroke={stroke} strokeWidth="2" fill="none" />
          <path d="M4 7.5v9l8 4.5 8-4.5v-9" stroke={stroke} strokeWidth="2" fill="none" />
          <path d="M12 12v9" stroke={stroke} strokeWidth="2" fill="none" />
        </svg>
      );
    case "articles":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="4" width="14" height="16" rx="2" stroke={stroke} strokeWidth="2" fill="none" />
          <path d="M8 8h8M8 12h8M8 16h5" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "community":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="7" cy="9" r="3" stroke={stroke} strokeWidth="2" fill="none" />
          <circle cx="17" cy="9" r="3" stroke={stroke} strokeWidth="2" fill="none" />
          <path d="M3 18c0-3 3-5 7-5" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M21 18c0-3-3-5-7-5" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "orders":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke={stroke} strokeWidth="2" fill="none" />
          <path d="M7 9h10M7 13h7" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function StatIcon({ name }: { name: StatKey }) {
  const fill = "#b595eb";
  switch (name) {
    case "booking":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke={fill} strokeWidth="2" />
          <path d="M3 9h18" stroke={fill} strokeWidth="2" />
          <circle cx="8" cy="13" r="1.5" fill={fill} />
          <circle cx="12" cy="13" r="1.5" fill={fill} />
          <circle cx="16" cy="13" r="1.5" fill={fill} />
        </svg>
      );
    case "profit":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12.5 9.5 17 19 7.5" fill="none" stroke={fill} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M14 7.5H19V12" fill="none" stroke={fill} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "active":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" fill="none" stroke={fill} strokeWidth="2" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(value)
    .replace("Rp", "Rp. ");

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

  const totalStatus = useMemo(
    () => (dashboardData.status || []).reduce((sum, s) => sum + s.value, 0),
    [dashboardData.status]
  );

  const isActive = (current: string, target: string) =>
    target === "/admin" ? current === target : current === target || current.startsWith(`${target}/`);

  const loadDashboard = useCallback(async () => {
    try {
      const payload = await fetchDashboardApi();
      setDashboardData((prev) => ({
        stats: payload.stats && payload.stats.length ? payload.stats : prev.stats || BASE_STATS,
        packages: payload.packages && payload.packages.length ? payload.packages : prev.packages || BASE_PACKAGES,
        buyers: payload.buyers && payload.buyers.length ? payload.buyers : prev.buyers || BASE_BUYERS,
        status: payload.status && payload.status.length ? payload.status : prev.status || BASE_STATUS,
        trips: payload.trips && payload.trips.length ? payload.trips : prev.trips || BASE_TRIPS,
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
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener("click", close);
    }
    return () => document.removeEventListener("click", close);
  }, [profileOpen]);

  return (
    <div className={`ad-root ${navOpen ? "nav-open" : ""}`}>
      <div className={`ad-nav-backdrop ${navOpen ? "show" : ""}`} onClick={() => setNavOpen(false)} />

      <aside className={`ad-sidebar ${navOpen ? "is-open" : ""}`}>
        <div className="ad-logo">
          <div className="ad-logo-badge">
            <img src="/logo.svg" alt="Saleema" />
          </div>
          <div className="ad-logo-text">
            <strong>Saleema</strong>
            <span>Tour</span>
          </div>
        </div>
        <nav className="ad-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`ad-nav-item ${isActive(location.pathname, item.path) ? "active" : ""}`}
              type="button"
              onClick={() => {
                setNavOpen(false);
                navigate(item.path);
              }}
            >
              <span className="ad-nav-icon">
                <NavIcon name={item.key as NavItem["key"]} />
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="ad-main">
        <header className="ad-topbar">
          <div className="ad-topbar-left">
            <button
              className="ad-menu-toggle"
              type="button"
              aria-label="Buka navigasi"
              onClick={() => setNavOpen(true)}
            >
              <span />
            <span />
            <span />
          </button>
          <h1>Dashboard Admin</h1>
        </div>
          <div className="ad-user-wrapper" ref={userMenuRef}>
            <button className="ad-user" type="button" onClick={() => setProfileOpen((v) => !v)}>
              <img src="/avatar.jpg" alt="Admin" />
              <div>
                <div className="ad-user-name">Madam</div>
                <div className="ad-user-role">Admin</div>
              </div>
            </button>
            {profileOpen && (
              <div className="ad-user-menu">
                <button
                  type="button"
                  className="ad-user-menu-item"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/");
                  }}
                >
                  <span className="ad-user-menu-icon">↩</span>
                  <span>Sign Out</span>
                </button>
                <button
                  type="button"
                  className="ad-user-menu-item"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/admin/profile");
                  }}
                >
                  <span className="ad-user-menu-icon">👤</span>
                  <span>Edit Profil</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="ad-stat-row">
          {(dashboardData.stats || []).map((s) => (
            <div key={s.key} className="ad-stat-card">
              <div className="ad-stat-icon">
                <StatIcon name={s.key} />
              </div>
              <div className="ad-stat-label">{s.label}</div>
              <div className="ad-stat-value">
                {s.key === "profit" ? formatCurrency(s.value) : s.value}
                {s.suffix}
              </div>
            </div>
          ))}
        </section>

        <section className="ad-grid">
          <div className="ad-card ad-packages">
            <h3>Paket Tour Teratas</h3>
            <div className="ad-package-list">
              {(dashboardData.packages || []).map((p) => (
                <div key={p.title} className="ad-package-item">
                  <img src={p.image} alt={p.title} />
                    <div className="ad-package-info">
                    <div className="ad-package-title">{p.title}</div>
                    <div className="ad-progress">
                      <div className="ad-progress-bar">
                        <span style={{ width: `${Math.min(100, p.progress ?? 0)}%` }} />
                      </div>
                      <div className="ad-progress-value">{p.progress ?? 0}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ad-card ad-buyers">
            <div className="ad-card-head">Pembeli Teratas</div>
            <div className="ad-buyer-list">
              {(dashboardData.buyers || []).map((b) => (
                <div key={b.name} className="ad-buyer-item">
                  <img src={b.avatar || avatarDefault} alt={b.name} />
                  <div className="ad-buyer-info">
                    <div className="ad-buyer-name">{b.name}</div>
                    <div className="ad-buyer-meta">
                      {b.bookings} Booking • {b.reviews} Ulasan
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ad-grid ad-bottom">
          <div className="ad-card ad-status">
            <h3>Status Booking</h3>
            <div className="ad-status-content">
              <div className="ad-donut">
                <svg viewBox="0 0 120 120">
                  <circle className="ad-donut-bg" cx="60" cy="60" r="42" />
                  {(dashboardData.status || []).reduce<{ offset: number; nodes: React.ReactNode[] }>(
                    (acc, seg) => {
                      const pct = totalStatus ? (seg.value / totalStatus) * 100 : 0;
                      const dash = (pct * 2 * Math.PI * 42) / 100;
                      const gap = 2 * Math.PI * 42 - dash;
                      acc.nodes.push(
                        <circle
                          key={seg.label}
                          className="ad-donut-seg"
                          stroke={seg.color}
                          cx="60"
                          cy="60"
                          r="42"
                          strokeDasharray={`${dash} ${gap}`}
                          strokeDashoffset={acc.offset}
                        />
                      );
                      acc.offset -= dash;
                      return acc;
                    },
                    { offset: 0, nodes: [] }
                  ).nodes}
                </svg>
                <div className="ad-donut-center">
                  <div className="ad-donut-number">
                    {(dashboardData.status || []).reduce((sum, s) => sum + s.value, 0)}
                  </div>
                </div>
              </div>
              <div className="ad-legend">
                {(dashboardData.status || []).map((s) => (
                  <div key={s.label} className="ad-legend-item">
                    <span className="ad-legend-dot" style={{ background: s.color }} />
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ad-card ad-trips">
            <div className="ad-card-head">Perjalanan Terbaru</div>
            <div className="ad-trip-table">
              <div className="ad-trip-head">
                <span>Pembeli</span>
                <span>Paket Tour</span>
                <span>Harga</span>
              </div>
              {(dashboardData.trips || []).map((t) => (
                <div key={t.buyer + t.tour} className="ad-trip-row">
                  <div className="ad-trip-buyer">
                    <img src={avatarDefault} alt={t.buyer} />
                    <span>{t.buyer}</span>
                  </div>
                  <span>{t.tour}</span>
                  <span>{formatCurrency(t.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
