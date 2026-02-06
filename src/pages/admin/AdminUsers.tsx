import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarDefault from '../../assets/icon/avatar-default.svg';
import { fetchUsers, deleteUser } from '../../api/users';
import type { AdminUser } from '../../api/users';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable, { TableColumn, TableAction } from '../../components/admin/AdminTable';

type UserRow = AdminUser & { password?: string; registered?: string };

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
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
    fetchUsers()
      .then((list) => {
        if (active) {
          // Add password field for display
          const mappedUsers = list.map((user) => ({
            ...user,
            password: '********',
          }));
          setUsers(mappedUsers);
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        if (active) {
          setErrorMessage('Gagal memuat data pengguna');
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
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.email, u.phone].some((v) =>
        (v || '').toLowerCase().includes(q)
      )
    );
  }, [query, users]);

  const handleDelete = async (user: UserRow) => {
    setConfirmId(user.id);
  };

  const handleEdit = (user: UserRow) => {
    navigate(`/admin/users/${user.id}/edit`);
  };

  const handleView = (user: UserRow) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleAdd = () => {
    navigate('/admin/users/create');
  };

  const confirmDelete = async () => {
    if (confirmId == null) return;

    try {
      const success = await deleteUser(confirmId);

      if (success) {
        setUsers((prev) => prev.filter((u) => u.id !== confirmId));
        setConfirmId(null);
        setDeleteSuccess(true);
      } else {
        setConfirmId(null);
        setErrorMessage('Gagal menghapus pengguna');
        setDeleteError(true);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setConfirmId(null);
      setErrorMessage('Terjadi kesalahan saat menghapus pengguna');
      setDeleteError(true);
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
      key: 'name',
      label: 'Nama Lengkap',
      width: '200px',
    },
    {
      key: 'email',
      label: 'Email',
      width: '200px',
    },
    {
      key: 'phone',
      label: 'Telepon',
      width: '150px',
    },
    {
      key: 'password',
      label: 'Password',
      width: '120px',
    },
    {
      key: 'registered',
      label: 'Tanggal Daftar',
      width: '150px',
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
      label: 'Edit User',
      color: 'orange',
      onClick: handleEdit,
    },
    {
      type: 'delete',
      label: 'Hapus User',
      color: 'red',
      onClick: handleDelete,
    },
  ];

  return (
    <AdminLayout title="Manajemen User">
      <AdminTable
        title="Daftar User"
        columns={columns}
        data={filtered}
        actions={actions}
        loading={loading}
        emptyMessage={query ? 'Tidak ada user yang cocok' : 'Belum ada data user'}
        searchValue={query}
        onSearch={setQuery}
        searchPlaceholder="Cari User"
        onAdd={handleAdd}
        addButtonText="+ Tambahkan User"
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
                Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.
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
              <p className="text-gray-600">User berhasil dihapus</p>
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