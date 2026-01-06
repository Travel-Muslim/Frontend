import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { loadUsers, upsertUser } from '../../utils/userStorage';

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

export default function AdminUserEdit() {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const isActive = (current: string, target: string) =>
    target === '/admin'
      ? current === target
      : current === target || current.startsWith(`${target}/`);

  const [users, setUsers] = useState(loadUsers());
  const user = useMemo(
    () => users.find((u) => u.id === Number(params.id)),
    [params.id, users]
  );

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password || '',
      });
    } else if (params.id) {
      navigate('/admin/users', { replace: true });
    }
  }, [user, params.id, navigate]);

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
            <button
              className="border-none bg-[#f7f0ff] rounded-[10px] px-3 py-2 font-extrabold cursor-pointer shadow-[0_10px_22px_rgba(140,107,214,0.18)] text-[#7b5ad3] hover:bg-[#efe6ff] transition-colors duration-150"
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Kembali"
            >
              ←
            </button>
            <h1 className="text-[22px] font-bold text-[#1d1d1f] m-0">
              Edit User
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
                  <span className="w-[20px] h-[20px] flex-shrink-0">↩</span>
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
                  <span className="w-[20px] h-[20px] flex-shrink-0">👤</span>
                  <span>Edit Profil</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="bg-white rounded-[18px] px-7 py-[26px] pb-[30px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#f1e9ff] max-w-[1100px] w-full mx-auto mt-2">
          <h2 className="m-0 mb-5 text-[22px] text-[#2b2b2b] font-extrabold">
            Edit User
          </h2>
          <form
            className="flex flex-col gap-[18px]"
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
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[18px_22px] w-full">
              <label className="flex flex-col gap-2 font-bold text-[#4a4a4a] text-lg">
                <span>Nama Lengkap</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full border border-[#f5b5be] rounded-[10px] px-4 py-[13px] min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border break-words focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                />
              </label>

              <label className="flex flex-col gap-2 font-bold text-[#4a4a4a] text-lg">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full border border-[#f5b5be] rounded-[10px] px-4 py-[13px] min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border break-words focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                />
              </label>

              <label className="flex flex-col gap-2 font-bold text-[#4a4a4a] text-lg">
                <span>Password</span>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                  className="w-full border border-[#f5b5be] rounded-[10px] px-4 py-[13px] min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border break-words focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                />
              </label>

              <label className="flex flex-col gap-2 font-bold text-[#4a4a4a] text-lg">
                <span>Nomor Telepon</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  required
                  className="w-full border border-[#f5b5be] rounded-[10px] px-4 py-[13px] min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border break-words focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-[14px] mt-[10px]">
              <button
                type="button"
                className="border-none rounded-[10px] px-5 py-3 font-extrabold cursor-pointer text-white min-w-[140px] text-[15px] bg-[#f87171] hover:bg-[#ef4444] transition-colors duration-150 w-full sm:w-auto"
                onClick={() => navigate('/admin/users')}
              >
                Batalkan
              </button>
              <button
                type="submit"
                className="border-none rounded-[10px] px-5 py-3 font-extrabold cursor-pointer text-white min-w-[140px] text-[15px] bg-[#22c6b6] hover:bg-[#1eab9d] transition-colors duration-150 w-full sm:w-auto"
              >
                Edit User
              </button>
            </div>
          </form>
        </section>

        {successModal && (
          <div className="fixed inset-0 bg-black/35 grid place-items-center p-4 z-50">
            <div className="bg-white rounded-[18px] px-5 py-6 pb-[22px] max-w-[480px] w-full text-center shadow-[0_20px_40px_rgba(15,23,42,0.2)]">
              <div className="w-[92px] h-[92px] rounded-full grid place-items-center mx-auto mb-4 text-[46px] font-extrabold text-white bg-[#f7b5c2]">
                ✓
              </div>
              <h3 className="m-0 mb-[10px] text-[22px] text-[#414141] font-bold">
                User Berhasil Diperbarui
              </h3>
              <p className="m-0 mb-4 text-[#5a5a5a] text-base">
                Data user berhasil diperbarui.
              </p>
              <div className="flex justify-center gap-[10px] flex-wrap">
                <button
                  type="button"
                  className="border-none rounded-xl px-[22px] py-3 font-extrabold cursor-pointer text-white min-w-[140px] text-[15px] bg-[#f7b5c2] hover:bg-[#f59cad] transition-colors duration-150"
                  onClick={() => {
                    setSuccessModal(false);
                    navigate('/admin/users');
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
