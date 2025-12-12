import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminDashboard.css";
import "./AdminUsers.css";
import avatarDefault from "../assets/icon/avatar-default.svg";
import { fetchUsers, deleteUser } from "../api/users";
import type { AdminUser } from "../api/users";

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

type UserRow = AdminUser & { password?: string; registered?: string };

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

export default function AdminUsers() {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
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
    fetchUsers()
      .then((list) => {
        if (active) setUsers(list);
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
    if (!q) return users;
    return users.filter((u) => [u.name, u.email, u.phone].some((v) => (v || "").toLowerCase().includes(q)));
  }, [query, users]);

  const handleDelete = (id: number) => {
    setConfirmId(id);
  };

  const confirmDelete = async () => {
    if (confirmId == null) return;
    await deleteUser(confirmId);
    setUsers((prev) => prev.filter((u) => u.id !== confirmId));
    setConfirmId(null);
    setDeleteSuccess(true);
  };

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
            <h1>Manajemen User</h1>
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

        <section className="au-card">
          <div className="au-card-head">
            <h2>Daftar User</h2>
            <div className="au-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6" stroke="#a6a6a6" strokeWidth="2" fill="none" />
                <path d="m15 15 4.5 4.5" stroke="#a6a6a6" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Cari User"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="au-table-wrap">
            <div className="au-table" role="table">
              <div className="au-thead" role="row">
                <span>ID</span>
                <span>Nama Lengkap</span>
                <span>Email</span>
                <span>Telepon</span>
                <span>Password</span>
                <span>Tanggal Daftar</span>
                <span>Aksi</span>
              </div>
              {loading ? (
                <div className="au-row" role="row">
                  <span data-label="ID">Memuat...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="au-row" role="row">
                  <span data-label="ID">Belum ada user</span>
                </div>
              ) : (
                filtered.map((u) => (
                  <div key={u.id} className="au-row" role="row">
                    <span data-label="ID">{u.id}</span>
                    <span data-label="Nama Lengkap">{u.name}</span>
                    <span data-label="Email">{u.email}</span>
                    <span data-label="Telepon">{u.phone}</span>
                    <span data-label="Password">{u.password}</span>
                    <span data-label="Tanggal Daftar">{u.registered}</span>
                    <span className="au-actions" data-label="Aksi">
                      <button
                        type="button"
                        className="au-btn au-btn-edit"
                        aria-label="Edit user"
                        onClick={() => navigate(`/admin/users/${u.id}/edit`)}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M14.5 5.5 18.5 9.5 9 19H5v-4L14.5 5.5Z" fill="none" stroke="#eab308" strokeWidth="2" />
                          <path d="M12 7 16 11" stroke="#eab308" strokeWidth="2" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="au-btn au-btn-delete"
                        aria-label="Hapus user"
                        onClick={() => handleDelete(Number(u.id))}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M6 7h12" stroke="#f87171" strokeWidth="2" />
                          <path d="M10 11v6M14 11v6" stroke="#f87171" strokeWidth="2" />
                          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#f87171" strokeWidth="2" />
                          <rect x="5" y="7" width="14" height="13" rx="2" stroke="#f87171" strokeWidth="2" fill="none" />
                        </svg>
                      </button>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {confirmId !== null && (
          <div className="au-modal">
            <div className="au-modal-card">
              <div className="au-modal-icon au-modal-icon-alert">!</div>
              <h3>Hapus User?</h3>
              <p>User ini akan terhapus dari daftar user.</p>
              <div className="au-modal-actions">
                <button type="button" className="au-modal-btn cancel" onClick={() => setConfirmId(null)}>
                  Batal
                </button>
                <button type="button" className="au-modal-btn confirm" onClick={confirmDelete}>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteSuccess && (
          <div className="au-modal">
            <div className="au-modal-card">
              <div className="au-modal-icon au-modal-icon-success">✓</div>
              <h3>User Berhasil Dihapus</h3>
              <p>User berhasil dihapus dari daftar user.</p>
              <div className="au-modal-actions">
                <button type="button" className="au-modal-btn confirm" onClick={() => setDeleteSuccess(false)}>
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
