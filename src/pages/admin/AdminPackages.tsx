import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPackages, type PackageDetail } from '../../api/packages';
import AdminLayout from '../../components/admin/AdminLayout';

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

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M15.5 5.5 18.5 8.5 9 18H6v-3L15.5 5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 7.5 16.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M6 7h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 7v12m6-12v12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 4h4a1 1 0 0 1 1 1v2H9V5a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 7h14v12.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5V7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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

export default function AdminPackages() {
  const [packages, setPackages] = useState<PackageDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPackages()
      .then((data) => {
        if (active) setPackages(data);
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
    if (!q) return packages;
    return packages.filter((p) => {
      const haystack = [
        p.name,
        p.location,
        p.periode_start,
        p.maskapai,
        p.bandara,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [packages, query]);

  const handleDelete = (id: number | string) => setConfirmId(Number(id));
  const confirmDelete = () => {
    if (confirmId == null) return;
    setPackages((prev) => prev.filter((p) => Number(p.id) !== confirmId));
    setConfirmId(null);
    setDeleteSuccess(true);
  };

  return (
    <AdminLayout title="Manajemen Paket">
      <section className="bg-white rounded-2xl p-[18px] sm:p-[14px] shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#f0e8ff]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-[14px]">
          <h2 className="m-0 text-lg text-[#2a2a2a]">Daftar Paket</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[10px] sm:gap-[10px] w-full sm:w-auto flex-wrap sm:justify-end">
            <div className="flex items-center gap-2 bg-white border border-[#e7dff4] px-[10px] py-[7px] rounded-lg min-w-0 w-full sm:w-[320px] sm:max-w-[320px] h-10 sm:flex-[0_0_auto] shadow-[inset_0_0_0_1px_#f5eefc]">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-4 h-4 flex-shrink-0"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="#a6a6a6"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="m15 15 4.5 4.5"
                  stroke="#a6a6a6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Cari Paket"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 outline-none w-full text-sm bg-transparent text-[#2f2f2f]"
              />
            </div>
            <button
              type="button"
              className="border-0 bg-[#22c6b6] text-white rounded-xl px-[14px] py-[10px] font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap w-full sm:w-auto"
              onClick={() => navigate('/admin/packages/new')}
            >
              <IconPlus />
              Tambahkan Paket
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="grid gap-2 min-w-[980px] lg:min-w-0">
            <div className="hidden lg:grid grid-cols-[0.5fr_2fr_1.6fr_2fr_1.6fr_1.3fr_1fr] bg-[#b28be2] text-white font-extrabold px-[14px] py-3 rounded-xl shadow-[0_12px_24px_rgba(130,94,197,0.2)]">
              <span>ID</span>
              <span>Nama Paket</span>
              <span>Lokasi</span>
              <span>Keberangkatan</span>
              <span>Maskapai</span>
              <span>Harga</span>
              <span>Aksi</span>
            </div>
            {loading ? (
              <div className="grid lg:grid-cols-[0.5fr_2fr_1.6fr_2fr_1.6fr_1.3fr_1fr] grid-cols-1 lg:items-center bg-white border border-[#f0d7e1] rounded-xl px-[14px] py-3 shadow-[0_10px_18px_rgba(15,23,42,0.08)] text-[#323232] font-semibold gap-2">
                <span data-label="ID">Memuat data...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="grid lg:grid-cols-[0.5fr_2fr_1.6fr_2fr_1.6fr_1.3fr_1fr] grid-cols-1 lg:items-center bg-white border border-[#f0d7e1] rounded-xl px-[14px] py-3 shadow-[0_10px_18px_rgba(15,23,42,0.08)] text-[#323232] font-semibold gap-2">
                <span data-label="ID">Belum ada paket</span>
              </div>
            ) : (
              filtered.map((p) => (
                <div
                  className="grid lg:grid-cols-[0.5fr_2fr_1.6fr_2fr_1.6fr_1.3fr_1fr] grid-cols-1 lg:items-center bg-white border border-[#f0d7e1] rounded-xl px-[14px] sm:px-3 py-3 shadow-[0_10px_18px_rgba(15,23,42,0.08)] text-[#323232] font-semibold gap-2 lg:gap-2"
                  key={p.id}
                >
                  <span
                    data-label="ID"
                    className="overflow-hidden text-ellipsis lg:whitespace-nowrap whitespace-normal before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                  >
                    {p.id}
                  </span>
                  <span
                    data-label="Nama Paket"
                    className="overflow-hidden text-ellipsis lg:whitespace-nowrap whitespace-normal before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                  >
                    {p.name}
                  </span>
                  <span
                    data-label="Lokasi"
                    className="overflow-hidden text-ellipsis lg:whitespace-nowrap whitespace-normal before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                  >
                    {p.location}
                  </span>
                  <span
                    data-label="Keberangkatan"
                    className="overflow-hidden text-ellipsis lg:whitespace-nowrap whitespace-normal before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                  >
                    {p.periode_start}
                  </span>
                  <span
                    data-label="Maskapai"
                    className="overflow-hidden text-ellipsis lg:whitespace-nowrap whitespace-normal before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                  >
                    {p.maskapai}
                  </span>
                  <span
                    data-label="Harga"
                    className="overflow-hidden text-ellipsis lg:whitespace-nowrap whitespace-normal before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                  >
                    {p.price ? `Rp${p.price.toLocaleString('id-ID')}` : '-'}
                  </span>
                  <span
                    className="inline-flex items-center gap-2 lg:justify-end justify-start before:content-[attr(data-label)':_'] before:font-bold before:text-[#5a5275] lg:before:content-none"
                    data-label="Aksi"
                  >
                    <button
                      type="button"
                      className="w-[34px] h-[34px] sm:w-8 sm:h-8 rounded-[10px] border border-[#d6eaff] bg-[#f4f9ff] grid place-items-center cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.08)] text-sm"
                      aria-label="Lihat paket"
                      onClick={() => navigate(`/admin/packages/${p.id}`)}
                    >
                      <IconEye />
                    </button>
                    <button
                      type="button"
                      className="w-[34px] h-[34px] sm:w-8 sm:h-8 rounded-[10px] border border-[#ffeec2] bg-[#fffaf0] grid place-items-center cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.08)] text-sm"
                      aria-label="Edit paket"
                      onClick={() => navigate(`/admin/packages/${p.id}`)}
                    >
                      <IconPencil />
                    </button>
                    <button
                      type="button"
                      className="w-[34px] h-[34px] sm:w-8 sm:h-8 rounded-[10px] border border-[#ffd6d6] bg-[#fff5f5] grid place-items-center cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.08)] text-sm"
                      aria-label="Hapus paket"
                      onClick={() => handleDelete(Number(p.id))}
                    >
                      <IconTrash />
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {confirmId !== null && (
          <div className="fixed inset-0 bg-black/35 grid place-items-center p-4 z-50">
            <div className="bg-white rounded-[18px] px-5 py-6 max-w-[480px] w-full text-center shadow-[0_20px_40px_rgba(15,23,42,0.2)]">
              <div className="w-[92px] h-[92px] rounded-full grid place-items-center mx-auto mb-4 text-[46px] font-extrabold text-white bg-[#f7b5c2]">
                !
              </div>
              <h3 className="m-0 mb-[10px] text-[22px] text-[#414141]">
                Hapus Paket?
              </h3>
              <p className="m-0 mb-4 text-[#5a5a5a] text-base">
                Paket ini akan terhapus dari daftar.
              </p>
              <div className="flex justify-center gap-[10px] flex-wrap">
                <button
                  type="button"
                  className="border-0 rounded-xl px-[22px] py-3 font-extrabold cursor-pointer text-white min-w-[140px] text-[15px] bg-[#f87171]"
                  onClick={() => setConfirmId(null)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="border-0 rounded-xl px-[22px] py-3 font-extrabold cursor-pointer text-white min-w-[140px] text-[15px] bg-[#22c6b6]"
                  onClick={confirmDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteSuccess && (
          <div className="fixed inset-0 bg-black/35 grid place-items-center p-4 z-50">
            <div className="bg-white rounded-[18px] px-5 py-6 max-w-[480px] w-full text-center shadow-[0_20px_40px_rgba(15,23,42,0.2)]">
              <div className="w-[92px] h-[92px] rounded-full grid place-items-center mx-auto mb-4 text-[46px] font-extrabold text-white bg-[#22c6b6]">
                <IconCheck />
              </div>
              <h3 className="m-0 mb-[10px] text-[22px] text-[#414141]">
                Paket Berhasil Dihapus
              </h3>
              <p className="m-0 mb-4 text-[#5a5a5a] text-base">
                Paket telah dihapus dari daftar.
              </p>
              <div className="flex justify-center gap-[10px] flex-wrap">
                <button
                  type="button"
                  className="border-0 rounded-xl px-[22px] py-3 font-extrabold cursor-pointer text-white min-w-[140px] text-[15px] bg-[#22c6b6]"
                  onClick={() => setDeleteSuccess(false)}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
