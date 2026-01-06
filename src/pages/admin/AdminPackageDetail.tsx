import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
            <button
              className="border-0 bg-[#f7f0ff] rounded-[10px] px-3 py-2 font-extrabold cursor-pointer shadow-[0_10px_22px_rgba(140,107,214,0.18)]"
              type="button"
              onClick={() => navigate('/admin/packages')}
              aria-label="Kembali"
            >
              <IconArrowLeft />
              <span>Kembali</span>
            </button>
            <h1 className="m-0 text-[22px] sm:text-[18px] md:text-[20px] text-[#1f1f28]">
              {pageTitle}
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

        <section className="bg-[#fffaf5] rounded-[18px] px-6 py-6 pb-[30px] shadow-[0_18px_38px_rgba(15,23,42,0.08)] border border-[#f2e3d7] w-full max-w-[1180px] mx-auto mt-[14px] lg:px-6 md:px-4 sm:px-4">
          <h2 className="m-0 mb-[6px] text-xl text-[#2b2b2b] font-extrabold">
            Tambah Detail Paket
          </h2>
          <p className="m-0 mb-[14px] text-[#8a8a8a] text-sm">
            Isi kolom di bawah ini secara lengkap untuk membuat paket destinasi
            baru.
          </p>
          <form
            className="flex flex-col gap-[18px]"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-y-4 gap-x-5">
              <label className="flex flex-col gap-2 font-bold text-[#4a4a4a]">
                <span>Nama Paket*</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full border border-[#f5b5be] rounded-[10px] px-[14px] py-3 min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                />
              </label>
              <label className="flex flex-col gap-2 font-bold text-[#4a4a4a]">
                <span>Lokasi*</span>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                  required
                  className="w-full border border-[#f5b5be] rounded-[10px] px-[14px] py-3 min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                />
              </label>
              <label className="flex flex-col gap-2 font-bold text-[#4a4a4a]">
                <span>Benua*</span>
                <input
                  type="text"
                  value={form.continent}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, continent: e.target.value }))
                  }
                  required
                  className="w-full border border-[#f5b5be] rounded-[10px] px-[14px] py-3 min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                />
              </label>
              <label className="flex flex-col gap-2 font-bold text-[#4a4a4a]">
                <span>Maskapai*</span>
                <input
                  type="text"
                  value={form.airline}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, airline: e.target.value }))
                  }
                  required
                  className="w-full border border-[#f5b5be] rounded-[10px] px-[14px] py-3 min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                />
              </label>
              <label className="flex flex-col gap-2 font-bold text-[#4a4a4a]">
                <span>Bandara*</span>
                <input
                  type="text"
                  value={form.airport}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, airport: e.target.value }))
                  }
                  required
                  className="w-full border border-[#f5b5be] rounded-[10px] px-[14px] py-3 min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                />
              </label>
              <label className="flex flex-col gap-2 font-bold text-[#4a4a4a]">
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
                  className="w-full border border-[#f5b5be] rounded-[10px] px-[14px] py-3 min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                />
              </label>
              <label className="flex flex-col gap-2 font-bold text-[#4a4a4a]">
                <span>Harga*</span>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  required
                  className="w-full border border-[#f5b5be] rounded-[10px] px-[14px] py-3 min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                />
              </label>
            </div>

            <div className="flex flex-col gap-[10px]">
              <h3>Gambar Paket</h3>
              <div
                className={`border-dashed border-[#f5b5be] rounded-xl p-[14px] bg-gradient-to-b from-[#fff8f3] to-white min-h-[280px] grid place-items-center text-center relative cursor-pointer transition-all duration-150 ${imageSrc ? 'border-solid border-[#f2d5db] shadow-[0_16px_32px_rgba(242,181,190,0.18)]' : 'border-[1.2px]'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={form.name || 'Paket'}
                    className="w-full max-w-[520px] rounded-[10px] block mx-auto"
                  />
                ) : (
                  <div className="grid place-items-center gap-2 text-[#c77482]">
                    <div className="w-[50px] h-[50px] rounded-xl bg-[#ffe8ee] grid place-items-center shadow-[0_10px_22px_rgba(242,139,149,0.15)]">
                      <IconUpload />
                    </div>
                    <p className="m-0 font-extrabold text-[#d16d7d]">
                      Unggah gambar paket
                    </p>
                    <small className="text-[#b0848d]">
                      PNG atau JPG, maksimal 2MB
                    </small>
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
                  className="mt-[10px] border border-[#e4d5ff] bg-[#f7f0ff] text-[#6b53b8] px-[14px] py-[10px] rounded-[10px] cursor-pointer font-bold transition-all duration-150 hover:bg-[#efdfff]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Pilih Gambar
                </button>
              </div>
            </div>

            <div className="bg-[#fffaf7] border border-[#f3e4d9] rounded-[14px] p-4 flex flex-col gap-[10px] shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
              <h3 className="m-0 text-base text-[#3a3a3a]">
                Tambah Destinasi Itenary
              </h3>
              <p className="m-0 mb-[14px] text-[#8a8a8a] text-sm">
                Isi kolom di bawah ini secara lengkap untuk menambahkan
                destinasi pada itenary paket.
              </p>
              {form.itinerary.destination.map((v, idx) => (
                <label
                  className="flex flex-col gap-2 font-bold text-[#4a4a4a]"
                  key={`dest-${idx}`}
                >
                  <span>Hari {idx + 1}*</span>
                  <input
                    type="text"
                    value={v}
                    onChange={(e) =>
                      updateItinerary('destination', idx, e.target.value)
                    }
                    className="w-full border border-[#f5b5be] rounded-[10px] px-[14px] py-3 min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                  />
                </label>
              ))}
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="bg-[#fff7f7] text-[#f15b6c] border border-[#ffd1d7] rounded-lg px-3 py-2 font-bold cursor-pointer inline-flex items-center gap-2"
                  onClick={() => removeDay('destination')}
                >
                  <span className="w-[18px] h-[18px] grid place-items-center">
                    <IconMinus />
                  </span>
                  Hapus Hari
                </button>
                <button
                  type="button"
                  className="bg-[#22c6b6] text-white border border-[#16b3a6] rounded-lg px-3 py-2 font-bold cursor-pointer shadow-[0_10px_22px_rgba(34,198,182,0.16)] inline-flex items-center gap-2"
                  onClick={() => addDay('destination')}
                >
                  <span className="w-[18px] h-[18px] grid place-items-center">
                    <IconPlus />
                  </span>
                  Tambahkan Hari
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="border border-[#16b3a6] rounded-[10px] px-5 py-3 font-extrabold cursor-pointer text-white min-w-[200px] text-[15px] bg-[#22c6b6] shadow-[0_10px_22px_rgba(34,198,182,0.2)] transition-transform duration-150 hover:scale-105"
                  onClick={() => setSuccessModal(true)}
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>

            <div className="bg-[#fffaf7] border border-[#f3e4d9] rounded-[14px] p-4 flex flex-col gap-[10px] shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
              <h3 className="m-0 text-base text-[#3a3a3a]">
                Tambah Tempat Makan Itenary
              </h3>
              <p className="m-0 mb-[14px] text-[#8a8a8a] text-sm">
                Isi kolom di bawah ini secara lengkap untuk menambahkan tempat
                makan pada itenary paket.
              </p>
              {form.itinerary.food.map((v, idx) => (
                <label
                  className="flex flex-col gap-2 font-bold text-[#4a4a4a]"
                  key={`food-${idx}`}
                >
                  <span>Hari {idx + 1}*</span>
                  <input
                    type="text"
                    value={v}
                    onChange={(e) =>
                      updateItinerary('food', idx, e.target.value)
                    }
                    className="w-full border border-[#f5b5be] rounded-[10px] px-[14px] py-3 min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                  />
                </label>
              ))}
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="bg-[#fff7f7] text-[#f15b6c] border border-[#ffd1d7] rounded-lg px-3 py-2 font-bold cursor-pointer inline-flex items-center gap-2"
                  onClick={() => removeDay('food')}
                >
                  <span className="w-[18px] h-[18px] grid place-items-center">
                    <IconMinus />
                  </span>
                  Hapus Hari
                </button>
                <button
                  type="button"
                  className="bg-[#22c6b6] text-white border border-[#16b3a6] rounded-lg px-3 py-2 font-bold cursor-pointer shadow-[0_10px_22px_rgba(34,198,182,0.16)] inline-flex items-center gap-2"
                  onClick={() => addDay('food')}
                >
                  <span className="w-[18px] h-[18px] grid place-items-center">
                    <IconPlus />
                  </span>
                  Tambahkan Hari
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="border border-[#16b3a6] rounded-[10px] px-5 py-3 font-extrabold cursor-pointer text-white min-w-[200px] text-[15px] bg-[#22c6b6] shadow-[0_10px_22px_rgba(34,198,182,0.2)] transition-transform duration-150 hover:scale-105"
                  onClick={() => setSuccessModal(true)}
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>

            <div className="bg-[#fffaf7] border border-[#f3e4d9] rounded-[14px] p-4 flex flex-col gap-[10px] shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
              <h3 className="m-0 text-base text-[#3a3a3a]">
                Tambah Masjid Itenary
              </h3>
              <p className="m-0 mb-[14px] text-[#8a8a8a] text-sm">
                Isi kolom di bawah ini secara lengkap untuk menambahkan masjid
                pada itenary paket.
              </p>
              {form.itinerary.mosque.map((v, idx) => (
                <label
                  className="flex flex-col gap-2 font-bold text-[#4a4a4a]"
                  key={`mosque-${idx}`}
                >
                  <span>Hari {idx + 1}*</span>
                  <input
                    type="text"
                    value={v}
                    onChange={(e) =>
                      updateItinerary('mosque', idx, e.target.value)
                    }
                    className="w-full border border-[#f5b5be] rounded-[10px] px-[14px] py-3 min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                  />
                </label>
              ))}
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="bg-[#fff7f7] text-[#f15b6c] border border-[#ffd1d7] rounded-lg px-3 py-2 font-bold cursor-pointer inline-flex items-center gap-2"
                  onClick={() => removeDay('mosque')}
                >
                  <span className="w-[18px] h-[18px] grid place-items-center">
                    <IconMinus />
                  </span>
                  Hapus Hari
                </button>
                <button
                  type="button"
                  className="bg-[#22c6b6] text-white border border-[#16b3a6] rounded-lg px-3 py-2 font-bold cursor-pointer shadow-[0_10px_22px_rgba(34,198,182,0.16)] inline-flex items-center gap-2"
                  onClick={() => addDay('mosque')}
                >
                  <span className="w-[18px] h-[18px] grid place-items-center">
                    <IconPlus />
                  </span>
                  Tambahkan Hari
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="border border-[#16b3a6] rounded-[10px] px-5 py-3 font-extrabold cursor-pointer text-white min-w-[200px] text-[15px] bg-[#22c6b6] shadow-[0_10px_22px_rgba(34,198,182,0.2)] transition-transform duration-150 hover:scale-105"
                  onClick={() => setSuccessModal(true)}
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>

            <div className="bg-[#fffaf7] border border-[#f3e4d9] rounded-[14px] p-4 flex flex-col gap-[10px] shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
              <h3 className="m-0 text-base text-[#3a3a3a]">
                Tambah Transportasi Itenary
              </h3>
              <p className="m-0 mb-[14px] text-[#8a8a8a] text-sm">
                Isi kolom di bawah ini secara lengkap untuk menambahkan
                transportasi pada itenary paket.
              </p>
              {form.itinerary.transport.map((v, idx) => (
                <label
                  className="flex flex-col gap-2 font-bold text-[#4a4a4a]"
                  key={`transport-${idx}`}
                >
                  <span>Hari {idx + 1}*</span>
                  <input
                    type="text"
                    value={v}
                    onChange={(e) =>
                      updateItinerary('transport', idx, e.target.value)
                    }
                    className="w-full border border-[#f5b5be] rounded-[10px] px-[14px] py-3 min-h-[46px] text-[15px] bg-[#fffdfd] outline-none box-border focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.15)]"
                  />
                </label>
              ))}
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="bg-[#fff7f7] text-[#f15b6c] border border-[#ffd1d7] rounded-lg px-3 py-2 font-bold cursor-pointer inline-flex items-center gap-2"
                  onClick={() => removeDay('transport')}
                >
                  <span className="w-[18px] h-[18px] grid place-items-center">
                    <IconMinus />
                  </span>
                  Hapus Hari
                </button>
                <button
                  type="button"
                  className="bg-[#22c6b6] text-white border border-[#16b3a6] rounded-lg px-3 py-2 font-bold cursor-pointer shadow-[0_10px_22px_rgba(34,198,182,0.16)] inline-flex items-center gap-2"
                  onClick={() => addDay('transport')}
                >
                  <span className="w-[18px] h-[18px] grid place-items-center">
                    <IconPlus />
                  </span>
                  Tambahkan Hari
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="border border-[#16b3a6] rounded-[10px] px-5 py-3 font-extrabold cursor-pointer text-white min-w-[200px] text-[15px] bg-[#22c6b6] shadow-[0_10px_22px_rgba(34,198,182,0.2)] transition-transform duration-150 hover:scale-105"
                  onClick={() => setSuccessModal(true)}
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>

            <div className="flex gap-[10px] justify-end flex-wrap">
              <button
                type="button"
                className="border border-[#afd5ff] bg-white text-[#5e97d1] px-5 py-3 rounded-[10px] font-bold cursor-pointer transition-all duration-150 hover:bg-[#f0f7ff]"
                onClick={() => setPreviewOpen(true)}
              >
                Tampilkan Detail Preview
              </button>
              <button
                type="button"
                className="border border-[#ffb5be] bg-[#fff7f7] text-[#f87171] px-5 py-3 rounded-[10px] font-bold cursor-pointer transition-all duration-150 hover:bg-[#ffecee]"
                onClick={() => navigate('/admin/packages')}
              >
                {cancelCta}
              </button>
              <button
                type="button"
                className="border border-[#16b3a6] bg-[#22c6b6] text-white px-5 py-3 rounded-[10px] font-bold cursor-pointer shadow-[0_10px_22px_rgba(34,198,182,0.2)] transition-transform duration-150 hover:scale-105"
                onClick={handleSave}
              >
                {primaryCta}
              </button>
            </div>
          </form>
        </section>

        {successModal && (
          <div className="fixed inset-0 bg-black/40 grid place-items-center z-[9999] p-4">
            <div className="bg-white rounded-[18px] p-8 text-center shadow-[0_10px_32px_rgba(0,0,0,0.15)] max-w-[380px] w-full">
              <div className="w-[92px] h-[92px] rounded-full bg-[#22c6b6] grid place-items-center mx-auto mb-[18px] shadow-[0_10px_26px_rgba(34,198,182,0.28)]">
                <IconCheck />
              </div>
              <h3 className="m-0 mb-2 text-xl text-[#2a2a2a] font-bold">
                {successTitle}
              </h3>
              <p className="text-[#757575] mb-6 text-[15px]">{successDesc}</p>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="w-full border border-[#16b3a6] bg-[#22c6b6] text-white px-5 py-[14px] rounded-[10px] font-bold cursor-pointer shadow-[0_10px_22px_rgba(34,198,182,0.2)] transition-transform duration-150 hover:scale-105"
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
          <div className="fixed inset-0 bg-black/50 grid place-items-center z-[9999] p-4">
            <div className="bg-white rounded-[18px] p-6 max-w-[920px] w-full max-h-[85vh] overflow-y-auto relative shadow-[0_10px_32px_rgba(0,0,0,0.15)]">
              <button
                className="absolute top-4 right-4 w-[38px] h-[38px] rounded-full bg-[#f3f3f3] grid place-items-center cursor-pointer text-[#8a8a8a] transition-all duration-150 hover:bg-[#e4e4e4]"
                type="button"
                onClick={() => setPreviewOpen(false)}
              >
                <IconClose />
              </button>
              <h3 className="m-0 mb-5 text-xl font-bold text-[#2a2a2a]">
                Detail Preview
              </h3>
              <div className="flex flex-col sm:flex-row gap-5 mb-6">
                <div className="w-full sm:w-1/2 rounded-[14px] overflow-hidden">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={form.name || 'Paket'}
                      className="w-full h-[280px] object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  <h4 className="m-0 text-lg font-bold text-[#3a3a3a]">
                    {form.name || pkg?.name || 'Paket Baru'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <strong className="text-sm text-[#8a8a8a]">Lokasi</strong>
                      <span className="text-[#4a4a4a]">{form.location}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <strong className="text-sm text-[#8a8a8a]">Durasi</strong>
                      <span className="text-[#4a4a4a]">6 Hari 4 Malam</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <strong className="text-sm text-[#8a8a8a]">
                        Periode
                      </strong>
                      <span className="text-[#4a4a4a]">
                        {form.periode_start} - {form.periode_end}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <strong className="text-sm text-[#8a8a8a]">
                        Maskapai
                      </strong>
                      <span className="text-[#4a4a4a]">{form.airline}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <strong className="text-sm text-[#8a8a8a]">
                        Bandara
                      </strong>
                      <span className="text-[#4a4a4a]">{form.airport}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <strong className="text-sm text-[#8a8a8a]">Harga</strong>
                      <span className="text-lg font-bold text-[#22c6b6]">
                        {form.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#fffbf8] border-l-4 border-[#22c6b6] rounded-lg p-4 mb-5">
                <h4 className="m-0 mb-1 text-base font-bold text-[#3a3a3a]">
                  {form.name || pkg?.name || 'Paket Baru'}
                </h4>
                <div className="text-sm text-[#8a8a8a]">
                  {form.periode_start || '10 Desember 2025 - 16 Desember 2025'}
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[600px] border border-[#e7e7e7] rounded-lg overflow-hidden">
                  <div className="grid grid-cols-5 bg-[#22c6b6] text-white font-bold text-sm">
                    <span className="px-4 py-3 border-r border-[#16b3a6]">
                      Hari
                    </span>
                    <span className="px-4 py-3 border-r border-[#16b3a6]">
                      Destinasi
                    </span>
                    <span className="px-4 py-3 border-r border-[#16b3a6]">
                      Makan
                    </span>
                    <span className="px-4 py-3 border-r border-[#16b3a6]">
                      Masjid
                    </span>
                    <span className="px-4 py-3">Transportasi</span>
                  </div>
                  {Array.from({ length: maxDays }).map((_, idx) => (
                    <div
                      className="grid grid-cols-5 border-t border-[#e7e7e7] text-sm"
                      key={`preview-${idx}`}
                    >
                      <span className="px-4 py-3 border-r border-[#e7e7e7] font-bold text-[#4a4a4a]">{`Hari ${idx + 1}`}</span>
                      <span className="px-4 py-3 border-r border-[#e7e7e7] text-[#5a5a5a]">
                        {form.itinerary.destination[idx] || ''}
                      </span>
                      <span className="px-4 py-3 border-r border-[#e7e7e7] text-[#5a5a5a]">
                        {form.itinerary.food[idx] || ''}
                      </span>
                      <span className="px-4 py-3 border-r border-[#e7e7e7] text-[#5a5a5a]">
                        {form.itinerary.mosque[idx] || ''}
                      </span>
                      <span className="px-4 py-3 text-[#5a5a5a]">
                        {form.itinerary.transport[idx] || ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
