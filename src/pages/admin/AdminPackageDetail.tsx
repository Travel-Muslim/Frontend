import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './AdminDashboard.css';
import './AdminPackageDetail.css';
import { fetchPackage, savePackage } from '../../api/packages';
import { formatHelper } from '@/helper/format';

interface NavItem {
  key: string;
  label: string;
  path: string;
}

interface PackageFormState {
  name: string;
  location: string;
  continent: string;
  airline: string;
  airport: string;
  periode_start: string;
  periode_end: string;
  price: string;
  itinerary: {
    destination: string[];
    food: string[];
    mosque: string[];
    transport: string[];
  };
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

function IconArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M14.5 6.5 8 12l6.5 5.5"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M8.5 12H19"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 16V5.5"
        fill="none"
        stroke="#f28b95"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="m8.5 9 3.5-3.5L15.5 9"
        fill="none"
        stroke="#f28b95"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M6 16.5v2.5h12v-2.5"
        fill="none"
        stroke="#f28b95"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
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

function IconMinus() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
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

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="m7 7 10 10M17 7 7 17"
        fill="none"
        stroke="#4a4a4a"
        strokeWidth="2.2"
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

const createEmptyForm = (): PackageFormState => ({
  name: '',
  location: '',
  continent: '',
  airline: '',
  airport: '',
  periode_start: '',
  periode_end: '',
  price: '',
  itinerary: {
    destination: Array.from({ length: 3 }, () => ''),
    food: Array.from({ length: 3 }, () => ''),
    mosque: Array.from({ length: 3 }, () => ''),
    transport: Array.from({ length: 3 }, () => ''),
  },
});

export default function AdminPackageDetail() {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [form, setForm] = useState<PackageFormState>(() => createEmptyForm());
  const [successModal, setSuccessModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const isActive = (current: string, target: string) =>
    target === '/admin'
      ? current === target
      : current === target || current.startsWith(`${target}/`);

  const pkgId = Number(params.id);
  const isCreateMode = !params.id || params.id === 'new' || Number.isNaN(pkgId);
  const [pkg, setPkg] = useState<any | null>(null);

  useEffect(() => {
    if (isCreateMode) {
      setForm(createEmptyForm());
      setImageSrc('');
      return;
    }
    let active = true;
    fetchPackage(pkgId).then((data) => {
      if (!active || !data) return;
      setPkg(data);
      setForm({
        name: data.name ?? '',
        location: data.location ?? '',
        continent: data.benua ?? '',
        airline: data.maskapai ?? '',
        airport: data.bandara ?? '',
        periode_start: data.periode_start ?? '',
        periode_end: data.periode_end ?? '',
        price: data.price ? `Rp${data.price.toLocaleString('id-ID')}` : '',
        itinerary: {
          destination: data.itinerary
            ?.map((d) => d.destinasi?.join(', ') || '')
            .filter(Boolean) ?? [''],
          food: data.itinerary
            ?.map((d) => d.makan?.join(', ') || '')
            .filter(Boolean) ?? [''],
          mosque: data.itinerary
            ?.map((d) => d.masjid?.join(', ') || '')
            .filter(Boolean) ?? [''],
          transport: data.itinerary
            ?.map((d) => d.transportasi?.join(', ') || '')
            .filter(Boolean) ?? [''],
        },
      });
      setImageSrc(data.image ?? '');
    });
    return () => {
      active = false;
    };
  }, [isCreateMode, pkgId]);

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

  const updateItinerary = (
    key: keyof typeof form.itinerary,
    idx: number,
    value: string
  ) => {
    setForm((prev) => {
      const arr = [...(prev.itinerary[key] as string[])];
      arr[idx] = value;
      return { ...prev, itinerary: { ...prev.itinerary, [key]: arr } };
    });
  };

  const addDay = (key: keyof typeof form.itinerary) => {
    setForm((prev) => {
      const arr = [...(prev.itinerary[key] as string[]), ''];
      return { ...prev, itinerary: { ...prev.itinerary, [key]: arr } };
    });
  };

  const removeDay = (key: keyof typeof form.itinerary) => {
    setForm((prev) => {
      const arr = [...(prev.itinerary[key] as string[])];
      if (arr.length > 1) {
        arr.pop();
      }
      return { ...prev, itinerary: { ...prev.itinerary, [key]: arr } };
    });
  };

  const maxDays = useMemo(
    () =>
      Math.max(
        form.itinerary.destination.length,
        form.itinerary.food.length,
        form.itinerary.mosque.length,
        form.itinerary.transport.length
      ),
    [form.itinerary]
  );

  const pageTitle = isCreateMode ? 'Tambahkan Paket' : 'Lihat Detail Paket';
  const primaryCta = isCreateMode ? 'Tambahkan Paket Tour' : 'Edit Paket';
  const cancelCta = isCreateMode
    ? 'Batalkan Paket Tour'
    : 'Batalkan Edit Paket';
  const successTitle = isCreateMode
    ? 'Paket Berhasil Ditambahkan'
    : 'Paket Berhasil Diperbarui';
  const successDesc = isCreateMode
    ? 'Data paket baru sudah tersimpan.'
    : 'Data paket berhasil diperbarui.';

  const handleSave = async () => {
    const priceNumber = Number(String(form.price).replace(/[^0-9]/g, ''));
    const itinerary = Array.from({ length: maxDays }).map((_, idx) => ({
      day: `Hari ${idx + 1}`,
      destinasi: form.itinerary.destination[idx]
        ? [form.itinerary.destination[idx]]
        : [],
      makan: form.itinerary.food[idx] ? [form.itinerary.food[idx]] : [],
      masjid: form.itinerary.mosque[idx] ? [form.itinerary.mosque[idx]] : [],
      transportasi: form.itinerary.transport[idx]
        ? [form.itinerary.transport[idx]]
        : [],
    }));
    await savePackage(
      {
        name: form.name,
        location: form.location,
        benua: form.continent,
        maskapai: form.airline,
        bandara: form.airport,
        periode_start: form.periode_start,
        periode_end: form.periode_end,
        harga: priceNumber,
        image: imageSrc,
        itinerary,
      },
      isCreateMode ? undefined : pkgId
    );
    setSuccessModal(true);
  };

  return (
    <div className={`ad-root ${navOpen ? 'nav-open' : ''}`}>
      <div
        className={`ad-nav-backdrop ${navOpen ? 'show' : ''}`}
        onClick={() => setNavOpen(false)}
      />

      <aside className={`ad-sidebar ${navOpen ? 'is-open' : ''}`}>
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
              className={`ad-nav-item ${isActive(location.pathname, item.path) ? 'active' : ''}`}
              type="button"
              onClick={() => {
                setNavOpen(false);
                navigate(item.path);
              }}
            >
              <span className="ad-nav-icon">
                <NavIcon name={item.key as NavItem['key']} />
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
            <button
              className="ap-back-btn"
              type="button"
              onClick={() => navigate('/admin/packages')}
              aria-label="Kembali"
            >
              <IconArrowLeft />
              <span>Kembali</span>
            </button>
            <h1>{pageTitle}</h1>
          </div>
          <div className="ad-user-wrapper" ref={userMenuRef}>
            <button
              className="ad-user"
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
            >
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
                    navigate('/');
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
                    navigate('/admin/profile');
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

        <section className="apd-card">
          <h2>Tambah Detail Paket</h2>
          <p className="apd-sub">
            Isi kolom di bawah ini secara lengkap untuk membuat paket destinasi
            baru.
          </p>
          <form
            className="apd-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="apd-grid">
              <label className="apd-field">
                <span>Nama Paket*</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </label>
              <label className="apd-field">
                <span>Lokasi*</span>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                  required
                />
              </label>
              <label className="apd-field">
                <span>Benua*</span>
                <input
                  type="text"
                  value={form.continent}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, continent: e.target.value }))
                  }
                  required
                />
              </label>
              <label className="apd-field">
                <span>Maskapai*</span>
                <input
                  type="text"
                  value={form.airline}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, airline: e.target.value }))
                  }
                  required
                />
              </label>
              <label className="apd-field">
                <span>Bandara*</span>
                <input
                  type="text"
                  value={form.airport}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, airport: e.target.value }))
                  }
                  required
                />
              </label>
              <label className="apd-field">
                <span>Periode Keberangkatan*</span>
                <input
                  type="text"
                  value={form.periode_start}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      periode_start: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label className="apd-field">
                <span>Harga*</span>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  required
                />
              </label>
            </div>

            <div className="apd-image-block">
              <h3>Gambar Paket</h3>
              <div
                className={`apd-image-placeholder ${imageSrc ? 'has-image' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {imageSrc ? (
                  <img src={imageSrc} alt={form.name || 'Paket'} />
                ) : (
                  <div className="apd-upload-empty">
                    <div className="apd-upload-icon">
                      <IconUpload />
                    </div>
                    <p>Unggah gambar paket</p>
                    <small>PNG atau JPG, maksimal 2MB</small>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setImageSrc(url);
                    }
                  }}
                />
                <button
                  type="button"
                  className="apd-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Pilih Gambar
                </button>
              </div>
            </div>

            <div className="apd-section">
              <h3>Tambah Destinasi Itenary</h3>
              <p className="apd-sub">
                Isi kolom di bawah ini secara lengkap untuk menambahkan
                destinasi pada itenary paket.
              </p>
              {form.itinerary.destination.map((v, idx) => (
                <label className="apd-field" key={`dest-${idx}`}>
                  <span>Hari {idx + 1}*</span>
                  <input
                    type="text"
                    value={v}
                    onChange={(e) =>
                      updateItinerary('destination', idx, e.target.value)
                    }
                  />
                </label>
              ))}
              <div className="apd-section-actions">
                <button
                  type="button"
                  className="apd-btn-ghost"
                  onClick={() => removeDay('destination')}
                >
                  <span className="apd-btn-icon">
                    <IconMinus />
                  </span>
                  Hapus Hari
                </button>
                <button
                  type="button"
                  className="apd-btn-outline"
                  onClick={() => addDay('destination')}
                >
                  <span className="apd-btn-icon">
                    <IconPlus />
                  </span>
                  Tambahkan Hari
                </button>
              </div>
              <div className="apd-actions apd-actions-inline">
                <button
                  type="button"
                  className="apd-btn apd-btn-save"
                  onClick={() => setSuccessModal(true)}
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>

            <div className="apd-section">
              <h3>Tambah Tempat Makan Itenary</h3>
              <p className="apd-sub">
                Isi kolom di bawah ini secara lengkap untuk menambahkan tempat
                makan pada itenary paket.
              </p>
              {form.itinerary.food.map((v, idx) => (
                <label className="apd-field" key={`food-${idx}`}>
                  <span>Hari {idx + 1}*</span>
                  <input
                    type="text"
                    value={v}
                    onChange={(e) =>
                      updateItinerary('food', idx, e.target.value)
                    }
                  />
                </label>
              ))}
              <div className="apd-section-actions">
                <button
                  type="button"
                  className="apd-btn-ghost"
                  onClick={() => removeDay('food')}
                >
                  <span className="apd-btn-icon">
                    <IconMinus />
                  </span>
                  Hapus Hari
                </button>
                <button
                  type="button"
                  className="apd-btn-outline"
                  onClick={() => addDay('food')}
                >
                  <span className="apd-btn-icon">
                    <IconPlus />
                  </span>
                  Tambahkan Hari
                </button>
              </div>
              <div className="apd-actions apd-actions-inline">
                <button
                  type="button"
                  className="apd-btn apd-btn-save"
                  onClick={() => setSuccessModal(true)}
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>

            <div className="apd-section">
              <h3>Tambah Masjid Itenary</h3>
              <p className="apd-sub">
                Isi kolom di bawah ini secara lengkap untuk menambahkan masjid
                pada itenary paket.
              </p>
              {form.itinerary.mosque.map((v, idx) => (
                <label className="apd-field" key={`mosque-${idx}`}>
                  <span>Hari {idx + 1}*</span>
                  <input
                    type="text"
                    value={v}
                    onChange={(e) =>
                      updateItinerary('mosque', idx, e.target.value)
                    }
                  />
                </label>
              ))}
              <div className="apd-section-actions">
                <button
                  type="button"
                  className="apd-btn-ghost"
                  onClick={() => removeDay('mosque')}
                >
                  <span className="apd-btn-icon">
                    <IconMinus />
                  </span>
                  Hapus Hari
                </button>
                <button
                  type="button"
                  className="apd-btn-outline"
                  onClick={() => addDay('mosque')}
                >
                  <span className="apd-btn-icon">
                    <IconPlus />
                  </span>
                  Tambahkan Hari
                </button>
              </div>
              <div className="apd-actions apd-actions-inline">
                <button
                  type="button"
                  className="apd-btn apd-btn-save"
                  onClick={() => setSuccessModal(true)}
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>

            <div className="apd-section">
              <h3>Tambah Transportasi Itenary</h3>
              <p className="apd-sub">
                Isi kolom di bawah ini secara lengkap untuk menambahkan
                transportasi pada itenary paket.
              </p>
              {form.itinerary.transport.map((v, idx) => (
                <label className="apd-field" key={`transport-${idx}`}>
                  <span>Hari {idx + 1}*</span>
                  <input
                    type="text"
                    value={v}
                    onChange={(e) =>
                      updateItinerary('transport', idx, e.target.value)
                    }
                  />
                </label>
              ))}
              <div className="apd-section-actions">
                <button
                  type="button"
                  className="apd-btn-ghost"
                  onClick={() => removeDay('transport')}
                >
                  <span className="apd-btn-icon">
                    <IconMinus />
                  </span>
                  Hapus Hari
                </button>
                <button
                  type="button"
                  className="apd-btn-outline"
                  onClick={() => addDay('transport')}
                >
                  <span className="apd-btn-icon">
                    <IconPlus />
                  </span>
                  Tambahkan Hari
                </button>
              </div>
              <div className="apd-actions apd-actions-inline">
                <button
                  type="button"
                  className="apd-btn apd-btn-save"
                  onClick={() => setSuccessModal(true)}
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>

            <div className="apd-footer-actions">
              <button
                type="button"
                className="apd-btn apd-btn-secondary"
                onClick={() => setPreviewOpen(true)}
              >
                Tampilkan Detail Preview
              </button>
              <button
                type="button"
                className="apd-btn apd-btn-cancel"
                onClick={() => navigate('/admin/packages')}
              >
                {cancelCta}
              </button>
              <button
                type="button"
                className="apd-btn apd-btn-save"
                onClick={handleSave}
              >
                {primaryCta}
              </button>
            </div>
          </form>
        </section>

        {successModal && (
          <div className="ap-modal">
            <div className="ap-modal-card">
              <div className="ap-modal-icon ap-modal-icon-success">
                <IconCheck />
              </div>
              <h3>{successTitle}</h3>
              <p>{successDesc}</p>
              <div className="ap-modal-actions">
                <button
                  type="button"
                  className="ap-modal-btn confirm"
                  onClick={() => {
                    setSuccessModal(false);
                    navigate('/admin/packages');
                  }}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}

        {previewOpen && (
          <div className="ap-preview-modal">
            <div className="ap-preview-card">
              <button
                className="ap-preview-close"
                type="button"
                onClick={() => setPreviewOpen(false)}
              >
                <IconClose />
              </button>
              <h3>Detail Preview</h3>
              <div className="ap-preview-hero">
                <div className="ap-preview-img">
                  {imageSrc ? (
                    <img src={imageSrc} alt={form.name || 'Paket'} />
                  ) : null}
                </div>
                <div className="ap-preview-meta">
                  <h4>{form.name || pkg?.name || 'Paket Baru'}</h4>
                  <div className="ap-preview-grid">
                    <div>
                      <strong>Lokasi</strong>
                      <span>{form.location}</span>
                    </div>
                    <div>
                      <strong>Durasi</strong>
                      <span>6 Hari 4 Malam</span>
                    </div>
                    <div>
                      <strong>Periode</strong>
                      <span>
                        {form.periode_start} - {form.periode_end}
                      </span>
                    </div>
                    <div>
                      <strong>Maskapai</strong>
                      <span>{form.airline}</span>
                    </div>
                    <div>
                      <strong>Bandara</strong>
                      <span>{form.airport}</span>
                    </div>
                    <div className="ap-preview-price">
                      <strong>Harga</strong>
                      <span>{form.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ap-preview-titleblock">
                <h4>{form.name || pkg?.name || 'Paket Baru'}</h4>
                <div className="ap-preview-date">
                  {form.periode_start || '10 Desember 2025 - 16 Desember 2025'}
                </div>
              </div>

              <div className="ap-preview-table">
                <div className="ap-preview-head">
                  <span>Hari</span>
                  <span>Destinasi</span>
                  <span>Makan</span>
                  <span>Masjid</span>
                  <span>Transportasi</span>
                </div>
                {Array.from({ length: maxDays }).map((_, idx) => (
                  <div className="ap-preview-row" key={`preview-${idx}`}>
                    <span>{`Hari ${idx + 1}`}</span>
                    <span>{form.itinerary.destination[idx] || ''}</span>
                    <span>{form.itinerary.food[idx] || ''}</span>
                    <span>{form.itinerary.mosque[idx] || ''}</span>
                    <span>{form.itinerary.transport[idx] || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
