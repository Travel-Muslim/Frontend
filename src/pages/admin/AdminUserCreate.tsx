import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createUser } from '../../api/users';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/button/Button';
import Input from '../../components/ui/input/Input';

interface UserForm {
  namaLengkap: string;
  email: string;
  password: string;
  telepon: string;
}

export default function AdminUserCreate() {
  const [form, setForm] = useState<UserForm>({
    namaLengkap: '',
    email: '',
    password: '',
    telepon: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const success = await createUser(form);
      
      if (success) {
        setSuccessModal(true);
      } else {
        setErrorMessage('Gagal membuat user');
        setErrorModal(true);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setErrorMessage('Terjadi kesalahan saat membuat user');
      setErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate('/admin/users');
  };

  const handleSuccessClose = () => {
    setSuccessModal(false);
    navigate('/admin/users');
  };

  return (
    <AdminLayout title="Tambah User">
      <div className="bg-white rounded-[18px] px-7 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] border border-[#f0f0f0] max-w-[1000px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Tambah User</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <Input
              label="Nama Lengkap"
              type="text"
              name="namaLengkap"
              value={form.namaLengkap}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap"
              required
            />

            {/* Email */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="Masukkan email"
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              placeholder="Masukkan password"
              showPasswordToggle
              required
            />

            {/* Nomor Telepon */}
            <Input
              label="Nomor Telepon"
              type="tel"
              name="telepon"
              value={form.telepon}
              onChange={handleInputChange}
              placeholder="Masukkan nomor telepon"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              onClick={handleBack}
              variant="light-pink-hover-dark-pink"
              className="px-8"
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              variant="light-teal-hover-dark-teal"
              className="px-8"
            >
              {submitting ? 'Menyimpan...' : 'Tambah User'}
            </Button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[380px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Berhasil!</h3>
              <p className="text-gray-600">User berhasil dibuat</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSuccessClose}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal && (
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
                onClick={() => setErrorModal(false)}
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