import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./AdminDashboard.css";
import "./AdminUserEdit.css";
import { loadUsers, upsertUser } from "../utils/userStorage";

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

export default function AdminUserEdit() {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const isActive = (current: string, target: string) =>
    target === "/admin" ? current === target : current === target || current.startsWith(`${target}/`);

  const [users, setUsers] = useState(loadUsers());
  const user = useMemo(() => users.find((u) => u.id === Number(params.id)), [params.id, users]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, phone: user.phone, password: user.password || "" });
    } else if (params.id) {
      navigate("/admin/users", { replace: true });
    }
  }, [user, params.id, navigate]);

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
            <button className="au-back-btn" type="button" onClick={() => navigate(-1)} aria-label="Kembali">
              ←
            </button>
            <h1>Edit User</h1>
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

      <section className="aue-card">
        <h2>Edit User</h2>
        <form
          className="aue-form"
          onSubmit={(e) => {
            e.preventDefault();
            const payload = {
              id: user?.id ?? Date.now(),
              name: form.name,
              email: form.email,
              phone: form.phone,
              password: form.password,
            };
            const next = upsertUser(payload);
            setUsers(next);
            setSuccessModal(true);
          }}
        >
            <div className="aue-grid">
              <label className="aue-field">
                <span>Nama Lengkap</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </label>

              <label className="aue-field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </label>

              <label className="aue-field">
                <span>Password</span>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
              </label>

              <label className="aue-field">
                <span>Nomor Telepon</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </label>
            </div>

            <div className="aue-actions">
              <button type="button" className="aue-btn aue-btn-cancel" onClick={() => navigate("/admin/users")}>
                Batalkan
              </button>
              <button type="submit" className="aue-btn aue-btn-save">
                Edit User
              </button>
            </div>
          </form>
        </section>

        {successModal && (
          <div className="au-modal">
            <div className="au-modal-card">
              <div className="au-modal-icon au-modal-icon-success">✓</div>
              <h3>User Berhasil Diperbarui</h3>
              <p>Data user berhasil diperbarui.</p>
              <div className="au-modal-actions">
                <button
                  type="button"
                  className="au-modal-btn confirm"
                  onClick={() => {
                    setSuccessModal(false);
                    navigate("/admin/users");
                  }}
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
