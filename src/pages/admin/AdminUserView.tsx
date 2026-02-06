import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getUserById } from '../../api/users';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/button/Button';

interface UserDetail {
  id: string;
  namaLengkap: string;
  email: string;
  telepon: string;
  tanggalDaftar: string;
  role: string;
}

export default function AdminUserView() {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (!params.id) {
      navigate('/admin/users', { replace: true });
      return;
    }

    let active = true;
    setLoading(true);

    getUserById(params.id)
      .then((userData) => {
        if (!active) return;

        if (userData) {
          const data = userData.data || userData.results || userData;
          setUser({
            id: data.id || params.id,
            namaLengkap: data.namaLengkap || data.fullname || data.name || '-',
            email: data.email || '-',
            telepon: data.telepon || data.phone || data.telephone || '-',
            tanggalDaftar: data.tanggalDaftar || data.created_at || data.registered_at || '-',
            role: data.role || data.roles || 'user',
          });
        } else {
          setErrorMessage('User tidak ditemukan');
          setTimeout(() => navigate('/admin/users', { replace: true }), 2000);
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        if (active) {
          setErrorMessage('Gagal memuat data user');
          setTimeout(() => navigate('/admin/users', { replace: true }), 2000);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.id, navigate]);

  const handleBack = () => {
    navigate('/admin/users');
  };

  const handleEdit = () => {
    navigate(`/admin/users/${params.id}/edit`);
  };

  if (loading) {
    return (
      <AdminLayout title="Detail User">
        <div className="bg-white rounded-[18px] px-7 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] border border-[#f0f0f0] max-w-[1000px] w-full mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Memuat data user...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (errorMessage) {
    return (
      <AdminLayout title="Detail User">
        <div className="bg-white rounded-[18px] px-7 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] border border-[#f0f0f0] max-w-[1000px] w-full mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-red-500">{errorMessage}</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AdminLayout title="Detail User">
      <div className="bg-white rounded-[18px] px-7 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] border border-[#f0f0f0] max-w-[1000px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Detail User</h1>
        </div>

        {/* User Info */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Nama Lengkap
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {user.namaLengkap}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Email
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {user.email}
              </div>
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Nomor Telepon
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {user.telepon}
              </div>
            </div>

            {/* Tanggal Daftar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tanggal Daftar
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {user.tanggalDaftar}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Role
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {user.role}
              </div>
            </div>

            {/* ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                User ID
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-mono text-sm">
                {user.id}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              onClick={handleBack}
              variant="white-hover-light-purple"
              className="px-8"
            >
              Kembali
            </Button>
            <Button
              onClick={handleEdit}
              variant="light-teal-hover-dark-teal"
              className="px-8"
            >
              Edit User
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}