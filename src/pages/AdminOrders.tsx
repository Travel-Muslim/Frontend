import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import "./AdminPackages.css";
import "./AdminOrders.css";
import type { OrderRow } from "../api/orders";
import { fetchOrders } from "../api/orders";

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

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14 5h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4" fill="none" stroke="#7b5ad3" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 5v14" fill="none" stroke="#7b5ad3" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 12h9" fill="none" stroke="#7b5ad3" strokeWidth="2" strokeLinecap="round" />
      <path d="m13 9-3 3 3 3" fill="none" stroke="#7b5ad3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="9" r="4" fill="none" stroke="#7b5ad3" strokeWidth="2" />
      <path d="M6 20c0-3.5 3-6 6-6s6 2.5 6 6" fill="none" stroke="#7b5ad3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6" stroke="#a6a6a6" strokeWidth="2" fill="none" />
      <path d="m15 15 4.5 4.5" stroke="#a6a6a6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StatusBadge({ status }: { status: OrderRow["status"] }) {
  return <span className={`ao-status ao-status-${status.toLowerCase()}`}>{status}</span>;
}

export default function AdminOrders() {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (current: string, target: string) =>
    target === "/admin" ? current === target : current === target || current.startsWith(`${target}/`);

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

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchOrders()
      .then((list) => {
        if (active) setOrders(list);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return orders;
    return orders.filter((o) => [o.id, o.name, o.packageName].some((v) => v.toLowerCase().includes(term)));
  }, [orders, query]);

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
            <button className="ad-menu-toggle" type="button" aria-label="Buka navigasi" onClick={() => setNavOpen(true)}>
              <span />
              <span />
              <span />
            </button>
            <h1>Manajemen Order</h1>
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
                  <span className="ad-user-menu-icon">
                    <IconLogout />
                  </span>
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
                  <span className="ad-user-menu-icon">
                    <IconProfile />
                  </span>
                  <span>Edit Profil</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="ap-card">
          <div className="ap-card-head ao-head">
            <h2>Daftar Order</h2>
            <div className="ao-search">
              <IconSearch />
              <input type="text" placeholder="Cari Order" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>

          <div className="ap-table-wrap">
            <div className="ap-table ao-table">
              <div className="ao-thead">
                <span>Tour ID</span>
                <span>Nama Lengkap</span>
                <span>Nama Paket</span>
                <span>Tanggal</span>
                <span>Status</span>
                <span>Pembayaran</span>
              </div>
              {loading ? (
                <div className="ao-row">
                  <span data-label="Tour ID">Memuat...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="ao-row">
                  <span data-label="Tour ID">Belum ada order</span>
                </div>
              ) : (
                filtered.map((order) => (
                  <div className="ao-row" key={order.id}>
                    <span data-label="Tour ID">{order.id}</span>
                    <span data-label="Nama Lengkap">{order.name}</span>
                    <span data-label="Nama Paket">{order.packageName}</span>
                    <span data-label="Tanggal">
                      {order.date} {order.time}
                    </span>
                    <span data-label="Status">
                      <StatusBadge status={order.status} />
                    </span>
                    <span data-label="Pembayaran" className="ao-payment">
                      {order.payment}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
