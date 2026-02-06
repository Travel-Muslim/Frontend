import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchArticles, deleteArticle } from '../../api/articles';
import type { Article } from '../../api/articles';
import AdminTable, { TableColumn, TableAction } from '../../components/admin/AdminTable';

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState<string | number | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchArticles()
      .then((data) => {
        if (active) setArticles(data);
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
        if (active) {
          setErrorMessage('Gagal memuat data artikel');
        }
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

  const handleDelete = async (article: Article) => {
    setConfirmId(article.id);
  };

  const handleEdit = (article: Article) => {
    navigate(`/admin/articles/edit/${article.id}`);
  };

  const handleView = (article: Article) => {
    navigate(`/admin/articles/${article.id}`);
  };

  const handleAdd = () => {
    navigate('/admin/articles/create');
  };

  const confirmDelete = async () => {
    if (confirmId == null) return;

    try {
      const success = await deleteArticle(confirmId);
      
      if (success) {
        setArticles((prev) => prev.filter((a) => a.id !== confirmId));
        setConfirmId(null);
        setDeleteSuccess(true);
      } else {
        setConfirmId(null);
        setErrorMessage('Gagal menghapus artikel');
        setDeleteError(true);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      setConfirmId(null);
      setErrorMessage('Terjadi kesalahan saat menghapus artikel');
      setDeleteError(true);
    }
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '-';
    }
  };

  // Table configuration
  const columns: TableColumn[] = [
    {
      key: 'id',
      label: 'ID',
      width: '200px',
    },
    {
      key: 'title',
      label: 'Judul Artikel',
      width: '500px',
    },
    {
      key: 'createdAt',
      label: 'Tanggal Terbit',
      width: '200px',
      render: (value) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (value, row) => {
        const status = value || 'Selesai';
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            status === 'Selesai' 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }`}>
            {status}
          </span>
        );
      },
    },
  ];

  const actions: TableAction[] = [
    {
      type: 'view',
      label: 'Lihat Detail',
      color: 'blue',
      onClick: handleView,
    },
    {
      type: 'edit',
      label: 'Edit Artikel',
      color: 'orange',
      onClick: handleEdit,
    },
    {
      type: 'delete',
      label: 'Hapus Artikel',
      color: 'red',
      onClick: handleDelete,
    },
  ];

  return (
    <AdminLayout title="Manajemen Artikel">
      <AdminTable
        title="Daftar Artikel"
        columns={columns}
        data={filtered}
        actions={actions}
        loading={loading}
        emptyMessage={query ? 'Tidak ada artikel yang cocok' : 'Belum ada data artikel'}
        searchValue={query}
        onSearch={setQuery}
        searchPlaceholder="Cari Artikel"
        onAdd={handleAdd}
        addButtonText="+ Tambahkan Artikel"
      />

      {/* Delete Confirmation Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 z-[100] grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[420px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600">
                Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmId(null)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {deleteSuccess && (
        <div className="fixed inset-0 bg-black/50 z-[100] grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[380px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Berhasil!</h3>
              <p className="text-gray-600">Artikel berhasil dihapus</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setDeleteSuccess(false)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {deleteError && (
        <div className="fixed inset-0 bg-black/50 z-[100] grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[380px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error!</h3>
              <p className="text-gray-600">{errorMessage}</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setDeleteError(false)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}