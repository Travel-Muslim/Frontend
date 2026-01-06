import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarDefault from '../../assets/icon/avatar-default.svg';
import { fetchUsers, deleteUser } from '../../api/users';
import type { AdminUser } from '../../api/users';
import AdminLayout from '../../components/admin/AdminLayout';

type UserRow = AdminUser & { password?: string; registered?: string };

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);
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
          // Map to include password field (placeholder) and format registered date
          const mappedUsers = list.map((user) => ({
            ...user,
            password: '********', // Placeholder for security
            registered: user.registered
              ? new Date(user.registered).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '-',
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

  const handleDelete = (id: number) => {
    setConfirmId(id);
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

  return (
    <AdminLayout title="Manajemen User">
      <div className="bg-white rounded-[14px] p-4 sm:p-3 shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#f0e8ff] flex flex-col gap-[14px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Cari berdasarkan nama, email atau nomor HP..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2 border border-[#e6dafd] rounded-xl bg-[#fdfbff] text-[#2c2c32] placeholder:text-[#a19fb2] focus:outline-none focus:ring-2 focus:ring-[#8b6bd6] w-full sm:w-[400px]"
            />
          </div>
          <button
            type="button"
            className="px-[18px] py-2 bg-gradient-to-r from-[#b28be2] to-[#caa8f3] text-white font-extrabold rounded-xl shadow-[0_10px_24px_rgba(130,94,197,0.3)] hover:shadow-[0_12px_28px_rgba(130,94,197,0.4)] transition-all duration-150"
            onClick={() => navigate('/admin/users/create')}
          >
            + Tambah User Baru
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#f0e8ff] border-t-[#8b6bd6] rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-[#9b9aa5]">
            {query ? 'Tidak ada user yang cocok' : 'Belum ada data user'}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#f0e8ff]">
                  <th className="px-3 py-3 text-left text-[#6f4ab1] font-extrabold text-sm">
                    Nama
                  </th>
                  <th className="px-3 py-3 text-left text-[#6f4ab1] font-extrabold text-sm">
                    Email
                  </th>
                  <th className="px-3 py-3 text-left text-[#6f4ab1] font-extrabold text-sm">
                    No HP
                  </th>
                  <th className="px-3 py-3 text-left text-[#6f4ab1] font-extrabold text-sm">
                    Password
                  </th>
                  <th className="px-3 py-3 text-left text-[#6f4ab1] font-extrabold text-sm">
                    Terdaftar
                  </th>
                  <th className="px-3 py-3 text-center text-[#6f4ab1] font-extrabold text-sm">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#f9f7fc] hover:bg-[#fdfbff] transition-colors"
                  >
                    <td className="px-3 py-3 text-[#34343b] font-bold flex items-center gap-[10px]">
                      <img
                        src={avatarDefault}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      {user.name}
                    </td>
                    <td className="px-3 py-3 text-[#34343b]">{user.email}</td>
                    <td className="px-3 py-3 text-[#34343b]">
                      {user.phone || '-'}
                    </td>
                    <td className="px-3 py-3 text-[#34343b]">
                      {user.password}
                    </td>
                    <td className="px-3 py-3 text-[#34343b]">
                      {user.registered}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="px-3 py-1 bg-[#f7f0ff] text-[#6f4ab1] font-bold rounded-lg hover:bg-[#efebff] transition-colors"
                          onClick={() =>
                            navigate(`/admin/users/edit/${user.id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1 bg-[#ffecf0] text-[#d32f2f] font-bold rounded-lg hover:bg-[#ffe0e6] transition-colors"
                          onClick={() => handleDelete(user.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 z-[100] grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[420px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <h3 className="text-[20px] font-extrabold text-[#252525] mb-3">
              Konfirmasi Hapus
            </h3>
            <p className="text-[#6a6a72] mb-6">
              Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-[#f7f0ff] text-[#6f4ab1] font-bold rounded-xl hover:bg-[#efebff] transition-colors"
                onClick={() => setConfirmId(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#e63946] to-[#d32f2f] text-white font-bold rounded-xl shadow-[0_8px_18px_rgba(211,47,47,0.3)] hover:shadow-[0_10px_22px_rgba(211,47,47,0.4)] transition-all"
                onClick={confirmDelete}
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
            <div className="w-16 h-16 bg-[#d4edda] rounded-full grid place-items-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#28a745]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-center text-[20px] font-extrabold text-[#252525] mb-2">
              Berhasil Dihapus!
            </h3>
            <p className="text-center text-[#6a6a72] mb-6">
              Pengguna telah berhasil dihapus dari sistem.
            </p>
            <button
              type="button"
              className="w-full px-4 py-2 bg-gradient-to-r from-[#b28be2] to-[#caa8f3] text-white font-bold rounded-xl shadow-[0_8px_18px_rgba(130,94,197,0.3)] hover:shadow-[0_10px_22px_rgba(130,94,197,0.4)] transition-all"
              onClick={() => setDeleteSuccess(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {deleteError && (
        <div className="fixed inset-0 bg-black/50 z-[100] grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[380px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="w-16 h-16 bg-[#f8d7da] rounded-full grid place-items-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#d32f2f]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-center text-[20px] font-extrabold text-[#252525] mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-center text-[#6a6a72] mb-6">
              {errorMessage || 'Gagal menghapus pengguna. Silakan coba lagi.'}
            </p>
            <button
              type="button"
              className="w-full px-4 py-2 bg-gradient-to-r from-[#b28be2] to-[#caa8f3] text-white font-bold rounded-xl shadow-[0_8px_18px_rgba(130,94,197,0.3)] hover:shadow-[0_10px_22px_rgba(130,94,197,0.4)] transition-all"
              onClick={() => {
                setDeleteError(false);
                setErrorMessage('');
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
