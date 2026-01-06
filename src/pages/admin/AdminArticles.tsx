import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Article } from '../../api/articles';
import { deleteArticle, loadArticles } from '../../utils/articleStorage';
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

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState<string | number | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadArticles()
      .then((data) => {
        if (active) setArticles(data);
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
    if (!term) return articles;
    return articles.filter((a) => a.title.toLowerCase().includes(term));
  }, [articles, query]);

  const handleDelete = (id: string | number) => setConfirmId(id);
  const confirmDelete = async () => {
    if (confirmId == null) return;
    const next = await deleteArticle(confirmId);
    setArticles(next);
    setConfirmId(null);
    setDeleteSuccess(true);
  };

  return (
    <AdminLayout title="Manajemen Artikel">
      <section className="m-6 bg-white rounded-[18px] shadow-[0_10px_32px_rgba(15,23,42,0.08)] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-[#f0f0f0]">
          <h2 className="m-0 text-xl font-bold text-[#2a2a2a]">
            Daftar Artikel
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none"
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
                placeholder="Cari Artikel"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full sm:w-[260px] pl-10 pr-4 py-[11px] border border-[#e0e0e0] rounded-[10px] text-[15px] outline-none transition-all duration-150 focus:border-[#8b6bd6] focus:shadow-[0_0_0_3px_rgba(139,107,214,0.1)]"
              />
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-[#22c6b6] text-white border border-[#16b3a6] rounded-[10px] px-5 py-[11px] font-bold text-[15px] cursor-pointer shadow-[0_10px_22px_rgba(34,198,182,0.2)] transition-transform duration-150 hover:scale-105"
              onClick={() => navigate('/admin/articles/new')}
            >
              <span className="w-[16px] h-[16px] flex-shrink-0">
                <IconPlus />
              </span>
              Tambahkan Artikel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div
              className="hidden md:grid gap-0 bg-gradient-to-r from-[#8b6bd6] to-[#7557c9] text-white font-bold text-[15px] px-4"
              style={{ gridTemplateColumns: '0.4fr 2.6fr 1.5fr 1fr 1fr' }}
            >
              <span className="py-4">ID</span>
              <span className="py-4">Judul Artikel</span>
              <span className="py-4">Tanggal Terbit</span>
              <span className="py-4">Status</span>
              <span className="py-4">Aksi</span>
            </div>
            {loading ? (
              <div
                className="flex flex-col md:grid gap-0 px-4 py-5 border-b border-[#f0f0f0] items-center"
                style={{ gridTemplateColumns: '0.4fr 2.6fr 1.5fr 1fr 1fr' }}
              >
                <span className="text-[15px] text-[#4a4a4a]">
                  Memuat data...
                </span>
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="flex flex-col md:grid gap-0 px-4 py-5 border-b border-[#f0f0f0] items-center"
                style={{ gridTemplateColumns: '0.4fr 2.6fr 1.5fr 1fr 1fr' }}
              >
                <span className="text-[15px] text-[#4a4a4a]">
                  Belum ada artikel
                </span>
              </div>
            ) : (
              filtered.map((article) => (
                <div
                  className="grid gap-0 px-4 py-5 border-b border-[#f0f0f0] items-center hover:bg-[#fafafa] transition-colors duration-150"
                  style={{ gridTemplateColumns: '0.4fr 2.6fr 1.5fr 1fr 1fr' }}
                  key={article.id}
                >
                  <span className="text-[15px] text-[#4a4a4a]">
                    {article.id}
                  </span>
                  <span className="text-[15px] text-[#2e2e2e] font-bold leading-[1.35]">
                    {article.title}
                  </span>
                  <span className="inline-flex flex-col gap-1 text-[#3d3d3d] font-bold text-[14px]">
                    <span>{article.displayDate}</span>
                    <span>{article.time}</span>
                  </span>
                  <span className="inline-flex">
                    <span className="inline-flex items-center gap-[6px] bg-[#ecfdf4] text-[#2a9e64] border border-[#c8f0da] rounded-lg px-[14px] py-2 font-extrabold text-[13px]">
                      {article.status}
                    </span>
                  </span>
                  <span className="flex gap-2">
                    <button
                      type="button"
                      className="w-[38px] h-[38px] rounded-[10px] border border-[#d6eaff] bg-[#f4f9ff] text-[#5b9dd6] cursor-pointer transition-all duration-150 hover:bg-[#e8f4ff] grid place-items-center"
                      aria-label="Lihat artikel"
                      onClick={() => navigate(`/admin/articles/${article.id}`)}
                    >
                      <span className="w-[18px] h-[18px]">
                        <IconEye />
                      </span>
                    </button>
                    <button
                      type="button"
                      className="w-[38px] h-[38px] rounded-[10px] border border-[#ffedc2] bg-[#fffaf0] text-[#e8a944] cursor-pointer transition-all duration-150 hover:bg-[#fff5e0] grid place-items-center"
                      aria-label="Edit artikel"
                      onClick={() => navigate(`/admin/articles/${article.id}`)}
                    >
                      <span className="w-[18px] h-[18px]">
                        <IconPencil />
                      </span>
                    </button>
                    <button
                      type="button"
                      className="w-[38px] h-[38px] rounded-[10px] border border-[#ffd6d6] bg-[#fff7f7] text-[#f87171] cursor-pointer transition-all duration-150 hover:bg-[#ffecec] grid place-items-center"
                      aria-label="Hapus artikel"
                      onClick={() => handleDelete(article.id)}
                    >
                      <span className="w-[18px] h-[18px]">
                        <IconTrash />
                      </span>
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {confirmId !== null && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-[9999] p-4">
          <div className="bg-white rounded-[18px] p-8 text-center shadow-[0_10px_32px_rgba(0,0,0,0.15)] max-w-[380px] w-full">
            <div className="w-[92px] h-[92px] rounded-full bg-[#fff4e6] grid place-items-center mx-auto mb-[18px] shadow-[0_10px_26px_rgba(255,152,0,0.18)]">
              <span className="text-[48px] font-extrabold text-[#ff9800]">
                !
              </span>
            </div>
            <h3 className="m-0 mb-2 text-xl text-[#2a2a2a] font-bold">
              Hapus Artikel?
            </h3>
            <p className="text-[#757575] mb-6 text-[15px]">
              Artikel ini akan terhapus dari daftar.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 border border-[#e0e0e0] bg-white text-[#6a6a6a] px-5 py-[14px] rounded-[10px] font-bold cursor-pointer transition-all duration-150 hover:bg-[#f5f5f5]"
                onClick={() => setConfirmId(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="flex-1 border border-[#f87171] bg-[#f87171] text-white px-5 py-[14px] rounded-[10px] font-bold cursor-pointer shadow-[0_10px_22px_rgba(248,113,113,0.2)] transition-transform duration-150 hover:scale-105"
                onClick={confirmDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteSuccess && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-[9999] p-4">
          <div className="bg-white rounded-[18px] p-8 text-center shadow-[0_10px_32px_rgba(0,0,0,0.15)] max-w-[380px] w-full">
            <div className="w-[92px] h-[92px] rounded-full bg-[#22c6b6] grid place-items-center mx-auto mb-[18px] shadow-[0_10px_26px_rgba(34,198,182,0.28)]">
              <span className="w-[48px] h-[48px]">
                <IconCheck />
              </span>
            </div>
            <h3 className="m-0 mb-2 text-xl text-[#2a2a2a] font-bold">
              Artikel Berhasil Dihapus
            </h3>
            <p className="text-[#757575] mb-6 text-[15px]">
              Artikel telah dihapus dari daftar.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                className="w-full border border-[#16b3a6] bg-[#22c6b6] text-white px-5 py-[14px] rounded-[10px] font-bold cursor-pointer shadow-[0_10px_22px_rgba(34,198,182,0.2)] transition-transform duration-150 hover:scale-105"
                onClick={() => setDeleteSuccess(false)}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
