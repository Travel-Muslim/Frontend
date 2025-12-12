import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import "./AdminCommunity.css";
import type { CommunityPost } from "../api/community";
import { fetchCommunityPosts } from "../api/community";

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

function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m8 10 4 4 4-4" fill="none" stroke="#7b5ad3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m12 4 2.2 4.4 4.8.7-3.5 3.4.8 4.8L12 14.8 7.7 17.3l.8-4.8L5 9.1l4.8-.7Z" fill="#f4b400" stroke="#e3a200" />
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
            <h1>Manajemen Komunitas</h1>
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

        <section className="ac-card">
          <div className="ac-head">
            <h2>Forum Diskusi</h2>
            <button className="ac-month" type="button" onClick={() => setMonthOpen((v) => !v)} aria-expanded={monthOpen}>
              December
              <span className={`ac-month-icon ${monthOpen ? "open" : ""}`}>
                <IconChevron />
              </span>
            </button>
          </div>

          <div className="ac-list">
            {loading ? (
              <div className="ac-item">Memuat data...</div>
            ) : sortedPosts.length === 0 ? (
              <div className="ac-item">Belum ada diskusi.</div>
            ) : (
              sortedPosts.map((post) => (
                <article className="ac-item" key={post.id}>
                  <header className="ac-item-head">
                    <h3>"{post.title}"</h3>
                    <div className="ac-meta">
                      <img src={post.avatar} alt={post.author} />
                      <div>
                        <div className="ac-author">{post.author}</div>
                        <div className="ac-rating">
                          <StarIcon />
                          <span>{post.rating?.toFixed?.(1) ?? post.rating}</span>
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </header>
                  <p className="ac-body">{post.body}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
