// import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/button/Button';
import Input from '../../components/ui/input/Input';
import PopupNotifikasi from '../../components/ui/popup-notifikasi/PopupNotifikasi';
import {
  EmailIcon,
  IconPlaceholderProfileIcon,
  ProfileIcon,
  TelephoneIcon,
} from '../../assets/icon';
import { getProfile, User } from '../../api/auth';
import api from '../../api/axios';
import { apiRoutes } from '../../api/routes';
import { uploadAvatar } from '../../api/users';
import { useEffect, useRef, useState } from 'react';

interface UserProfile {
  fullname: string;
  email: string;
  phone: string;
  avatar_url: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupVariant, setPopupVariant] = useState<'success' | 'error'>(
    'success'
  );
  const [popupMessage, setPopupMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userData = await getProfile();
        setName(userData.fullname);
        setEmail(userData.email);
        setPhone(userData.phone);
        setAvatar(userData.avatar_url || '');
      } catch (error) {
        console.error('Gagal mengambil data profil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        nama: name,
        email: email,
        noTelepon: phone,
        ...(password && { password }), // hanya kirim password jika ada
      };

      await api.put(apiRoutes.profile, payload);

      // Perbarui data di localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.fullname = name;
      userData.email = email;
      if (avatar) userData.avatar_url = avatar;
      localStorage.setItem('user', JSON.stringify(userData));

      // Tampilkan popup success
      setPopupVariant('success');
      setPopupMessage('Perubahan profil berhasil disimpan.');
      setPopupOpen(true);
    } catch (error) {
      console.error('Gagal menyimpan profil:', error);

      // Tampilkan popup error
      setPopupVariant('error');
      setPopupMessage('Gagal menyimpan perubahan profil. Silakan coba lagi.');
      setPopupOpen(true);
    }
  };

  const uploadAvatarImage = async (file: File) => {
    try {
      setUploading(true);

      const response = await uploadAvatar(file);

      if (!response.success) {
        setPopupVariant('error');
        setPopupMessage(
          response.message || 'Gagal mengunggah avatar. Silakan coba lagi.'
        );
        setPopupOpen(true);
        return;
      }

      // Ambil URL avatar baru dari response
      const avatarUrl = response.data?.avatarUrl;
      setAvatar(avatarUrl);

      // Update juga di localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.avatar_url = avatarUrl;
      localStorage.setItem('user', JSON.stringify(userData));

      // Tampilkan success popup
      setPopupVariant('success');
      setPopupMessage('Avatar berhasil diunggah!');
      setPopupOpen(true);
    } catch (error) {
      console.error('Gagal mengunggah avatar:', error);
      setPopupVariant('error');
      setPopupMessage('Gagal mengunggah avatar. Silakan coba lagi.');
      setPopupOpen(true);
    } finally {
      setUploading(false);
    }
  };

  const deleteAvatar = async () => {
    try {
      await api.delete(apiRoutes.deleteAvatar);
      setAvatar('');

      // Update juga di localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.avatar_url = '';
      localStorage.setItem('user', JSON.stringify(userData));

      // Tampilkan success popup
      setPopupVariant('success');
      setPopupMessage('Avatar berhasil dihapus!');
      setPopupOpen(true);
    } catch (error) {
      console.error('Gagal menghapus avatar:', error);
      setPopupVariant('error');
      setPopupMessage('Gagal menghapus avatar. Silakan coba lagi.');
      setPopupOpen(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.match('image.*')) {
        setPopupVariant('error');
        setPopupMessage('Silakan pilih file gambar (JPG, PNG, GIF, dll)');
        setPopupOpen(true);
        return;
      }

      // Validasi ukuran file (maksimal 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setPopupVariant('error');
        setPopupMessage('File terlalu besar. Maksimal 5MB.');
        setPopupOpen(true);
        return;
      }

      uploadAvatarImage(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-profileBg px-4 py-8 pb-12">
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-profileText">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-profileBg px-4 py-8 pb-12">
      <header className="max-w-5xl mx-auto mb-4.5 mt-2 flex flex-col gap-1.5">
        <div>
          <h1 className="mb-1 text-4xl text-[#444444] font-semibold">
            Edit Profil
          </h1>
          <p className="mb-8 text-[#444444] text-lg">
            Lengkapi dan perbarui data diri anda untuk pengalaman yang lebih
            maksimal.
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto bg-white rounded-3xl border border-[#FFB4C4] shadow-lg p-6 grid gap-4.5">
        <div className="font-semibold text-xl text-gray-profileLabel mb-6">
          Informasi Profil
        </div>

        <div className="flex items-center gap-12 flex-wrap">
          <div
            className="w-36 h-36 border-2 border-[#FFB4C4] rounded-full grid place-items-center bg-white cursor-pointer overflow-hidden"
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-pink-accent">
                <img
                  src={IconPlaceholderProfileIcon}
                  style={{
                    background: '#FFB4C4',
                    borderRadius: '5px',
                    width: '2.5rem',
                    height: '2.5rem',
                    padding: '0.5rem',
                  }}
                  alt="profile"
                />
              </span>
            )}
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <Button
              type="button"
              variant="light-teal-hover-dark-teal"
              onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: '15px' }}
              disabled={uploading}
            >
              {uploading ? 'Mengunggah...' : 'Unggah Foto Profil'}
            </Button>
            {avatar && (
              <Button
                type="button"
                variant="light-pink-hover-dark-pink"
                onClick={deleteAvatar}
                style={{ fontSize: '15px' }}
                disabled={uploading}
              >
                {uploading ? 'Menghapus...' : 'Hapus'}
              </Button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
        </div>

        <div className="border-b border-[#FFB4C4] my-2" />

        <div className="font-semibold text-gray-profileLabel text-xl mb-6">
          Informasi Detail
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 gap-x-4">
          <label className="flex flex-col gap-1.5 font-normal text-gray-profileText">
            <span>Nama</span>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              icon={ProfileIcon}
            />
          </label>
          <label className="flex flex-col gap-1.5 font-normal text-gray-profileText">
            <span>Email</span>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              icon={EmailIcon}
            />
          </label>
          <label className="flex flex-col gap-1.5 font-normal text-gray-profileText">
            <span>No Telepon</span>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Masukkan nomor telepon"
              icon={TelephoneIcon}
            />
          </label>
          <label className="flex flex-col gap-1.5 font-normal text-gray-profileText">
            <span>Password</span>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              showPasswordToggle
              onPasswordToggle={togglePasswordVisibility}
              isPasswordVisible={showPassword}
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 flex-wrap mt-4">
          <Button
            type="button"
            variant="light-pink-hover-dark-pink"
            onClick={() => navigate(-1)}
            style={{ fontSize: '15px' }}
          >
            Batalkan Perubahan
          </Button>
          <Button
            type="button"
            variant="light-teal-hover-dark-teal"
            onClick={handleSave}
            style={{ fontSize: '15px' }}
          >
            Simpan Perubahan
          </Button>
        </div>
      </section>

      <PopupNotifikasi
        variant={popupVariant}
        title={
          popupVariant === 'success'
            ? 'Perubahan Berhasil Disimpan'
            : 'Gagal Menyimpan'
        }
        description={popupMessage}
        buttonText={popupVariant === 'success' ? 'Oke' : 'Tutup'}
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onButtonClick={() => {
          setPopupOpen(false);
          // Hanya redirect ke home jika ini adalah success save profile (bukan upload avatar)
          if (
            popupVariant === 'success' &&
            popupMessage.includes('profil berhasil disimpan')
          ) {
            navigate('/');
          }
        }}
      />

      {success && (
        <div className="fixed inset-0 bg-black/35 grid place-items-center px-4 z-80">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl grid gap-3">
            <div className="w-24 h-24 rounded-full grid place-items-center mx-auto mb-1.5 text-5xl font-black text-white bg-pink-profileModal">
              ✓
            </div>
            <h3 className="m-0 text-2xl text-gray-profileText">
              Perubahan Berhasil Disimpan
            </h3>
            <button
              type="button"
              className="bg-teal-light text-white border-none rounded-lg px-6 py-2 font-semibold cursor-pointer transition-colors hover:opacity-90"
              onClick={() => {
                setSuccess(false);
                navigate('/');
              }}
            >
              Kembali ke Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
