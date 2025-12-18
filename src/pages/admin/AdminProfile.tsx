import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import "./AdminProfile.css";

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

const STORAGE_KEY = "profile_admin";

export default function AdminProfile() {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (current: string, target: string) =>
    target === "/admin" ? current === target : current === target || current.startsWith(`${target}/`);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setName(parsed.name || "");
        setEmail(parsed.email || "");
        setPhone(parsed.phone || "");
        setPassword(parsed.password || "");
        setAvatar(parsed.avatar || "");
      }
    } catch (err) {
      console.error("Failed to load admin profile", err);
    }
  }, []);

  const handleSave = () => {
    const payload = { name, email, phone, password, avatar };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem("user", JSON.stringify({ fullname: name, email, role: "admin", avatar_url: avatar }));
    setSuccess(true);
  };

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

      <main className="ad-main ap-main">
        <header className="ad-topbar">
          <div className="ad-topbar-left">
            <button className="ad-menu-toggle" type="button" aria-label="Buka navigasi" onClick={() => setNavOpen(true)}>
              <span />
              <span />
              <span />
            </button>
            <h1>Edit Profil</h1>
          </div>
          <div className="ad-user-wrapper" ref={userMenuRef}>
            <button className="ad-user" type="button" onClick={() => setProfileOpen((v) => !v)}>
              <img src={avatar || "/avatar.jpg"} alt="Admin" />
              <div>
                <div className="ad-user-name">{name || "Admin"}</div>
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
          <div className="ap-card-head">
            <h2>Informasi Profil</h2>
          </div>
          <div className="ap-avatar-row">
            <div className="ap-avatar" onClick={() => fileInputRef.current?.click()}>
              {avatar ? <img src={avatar} alt="Avatar" /> : <span className="ap-avatar-placeholder">📷</span>}
            </div>
            <div className="ap-avatar-actions">
              <button type="button" className="ap-btn ap-btn-save" onClick={() => fileInputRef.current?.click()}>
                Unggah Foto Profil
              </button>
              <button type="button" className="ap-btn ap-btn-danger" onClick={() => setAvatar("")}>
                Hapus
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setAvatar(url);
                  }
                }}
              />
            </div>
          </div>

          <div className="ap-divider" />

          <div className="ap-grid">
            <label className="ap-field">
              <span>Nama</span>
              <input type="text" placeholder="Masukkan nama..." value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="ap-field">
              <span>Email</span>
              <input type="email" placeholder="Masukkan email..." value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="ap-field">
              <span>No Telepon</span>
              <input type="tel" placeholder="Masukkan nomor telepon..." value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="ap-field">
              <span>Password</span>
              <input
                type="password"
                placeholder="Masukkan password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          <div className="ap-actions">
            <button type="button" className="ap-btn ap-btn-save" onClick={handleSave}>
              Simpan Perubahan
            </button>
          </div>
        </section>
      </main>

      {success && (
        <div className="ap-modal">
          <div className="ap-modal-card">
            <div className="ap-modal-icon">✓</div>
            <h3>Perubahan Berhasil Disimpan</h3>
            <div className="ap-modal-actions">
              <button
                type="button"
                className="ap-modal-btn confirm"
                onClick={() => {
                  setSuccess(false);
                }}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
