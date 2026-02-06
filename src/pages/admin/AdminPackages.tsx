import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchPackages, deletePackage } from '../../api/packages';
import type { PackageDetail } from '../../api/packages';
import AdminTable, { TableColumn, TableAction } from '../../components/admin/AdminTable';

export default function AdminPackages() {
  const [packages, setPackages] = useState<PackageDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState<number | string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPackages()
      .then((data) => {
        if (active) setPackages(data);
      })
      .catch((error) => {
        console.error('Error fetching packages:', error);
        if (active) {
          setErrorMessage('Gagal memuat data paket');
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

  const handleDelete = async (packageItem: PackageDetail) => {
    setConfirmId(packageItem.id);
  };

  const handleEdit = (packageItem: PackageDetail) => {
    navigate(`/admin/packages/edit/${packageItem.id}`);
  };

  const handleView = (packageItem: PackageDetail) => {
    navigate(`/admin/packages/${packageItem.id}`);
  };

  const handleAdd = () => {
    navigate('/admin/packages/create');
  };

  const confirmDelete = async () => {
    if (confirmId == null) return;

    try {
      const success = await deletePackage(confirmId);
      
      if (success) {
        setPackages((prev) => prev.filter((p) => p.id !== confirmId));
        setConfirmId(null);
        setDeleteSuccess(true);
      } else {
        setConfirmId(null);
        setErrorMessage('Gagal menghapus paket');
        setDeleteError(true);
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      setConfirmId(null);
      setErrorMessage('Terjadi kesalahan saat menghapus paket');
      setDeleteError(true);
    }
  };

  // Format price to Indonesian currency
  const formatPrice = (price: number | undefined) => {
    if (!price) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Table configuration
  const columns: TableColumn[] = [
    {
      key: 'id',
      label: 'ID',
      width: '200px',
    },
    {
      key: 'name',
      label: 'Nama Paket',
      width: '200px',
    },
    {
      key: 'location',
      label: 'Lokasi',
      width: '150px',
    },
    {
      key: 'periode_start',
      label: 'Keberangkatan',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'maskapai',
      label: 'Maskapai',
      width: '150px',
    },
    {
      key: 'price',
      label: 'Harga',
      width: '150px',
      render: (value) => formatPrice(value),
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
      label: 'Edit Paket',
      color: 'orange',
      onClick: handleEdit,
    },
    {
      type: 'delete',
      label: 'Hapus Paket',
      color: 'red',
      onClick: handleDelete,
    },
  ];

  return (
    <AdminLayout title="Manajemen Paket">
      <AdminTable
        title="Daftar Paket"
        columns={columns}
        data={filtered}
        actions={actions}
        loading={loading}
        emptyMessage={query ? 'Tidak ada paket yang cocok' : 'Belum ada data paket'}
        searchValue={query}
        onSearch={setQuery}
        searchPlaceholder="Cari Paket"
        onAdd={handleAdd}
        addButtonText="+ Tambahkan Paket"
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
                Apakah Anda yakin ingin menghapus paket ini? Tindakan ini tidak dapat dibatalkan.
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
              <p className="text-gray-600">Paket berhasil dihapus</p>
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