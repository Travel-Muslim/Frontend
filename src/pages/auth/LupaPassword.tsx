import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../../components/ui/input/Input';
import Button from '../../components/ui/button/Button';
import { requestPasswordReset, resetPassword } from '../../api/users';
import { ToastContainer, ToastItem } from '../../components/ui/toast/Toast';
import {
  BgForgotPasswordEmailImage,
  BgForgotPasswordImage,
  LogoImage,
} from '../../assets/images';
import { EmailIcon } from '../../assets/icon';

type Step = 'email' | 'reset';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<Step>(() => {
    // Check if there's a token in the URL to determine the current step
    return searchParams.get('token') ? 'reset' : 'email';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Use the token from URL if available
  const tokenFromUrl = searchParams.get('token') || '';

  const validateEmail = (val: string) => /^\S+@\S+\.\S+$/.test(val);

  const addToast = (
    message: string,
    variant: 'success' | 'error' | 'warning' | 'info' | 'pink' = 'info',
    title?: string
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, variant, title }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      addToast('Format email tidak valid', 'error', 'Email Tidak Valid');
      return;
    }

    setLoading(true);

    try {
      const result = await requestPasswordReset(email);
      if (result) {
        addToast(
          'Instruksi pengaturan ulang kata sandi telah dikirim ke email Anda',
          'success',
          'Instruksi Dikirim'
        );
      } else {
        addToast(
          'Terjadi kesalahan saat mengirim email instruksi',
          'error',
          'Gagal Mengirim'
        );
      }
    } catch (err: any) {
      addToast(
        err.message || 'Terjadi kesalahan saat mengirim email instruksi',
        'error',
        'Gagal Mengirim'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().length < 8) {
      addToast(
        'Password minimal harus 8 karakter',
        'error',
        'Panjang Password'
      );
      return;
    }
    if (password !== confirm) {
      addToast(
        'Password konfirmasi tidak cocok',
        'error',
        'Konfirmasi Tidak Cocok'
      );
      return;
    }

    setLoading(true);

    try {
      // Use the actual token from URL parameters
      const result = await resetPassword(tokenFromUrl, password);
      if (result) {
        addToast(
          'Password Anda telah berhasil diperbarui',
          'success',
          'Password Diperbarui'
        );
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirect after 2 seconds to let user see success message
      } else {
        addToast(
          'Terjadi kesalahan saat mengatur ulang password',
          'error',
          'Gagal Memperbarui'
        );
      }
    } catch (err: any) {
      addToast(
        err.message || 'Terjadi kesalahan saat mengatur ulang password',
        'error',
        'Gagal Memperbarui'
      );
    } finally {
      setLoading(false);
    }
  };

  // Get background image based on current step
  const heroImage =
    step === 'email' ? BgForgotPasswordImage : BgForgotPasswordEmailImage;
  const heroTitle = step === 'email' ? 'Masukkan Email' : 'Buat Password Baru';
  const heroCopy =
    step === 'email'
      ? 'Temukan destinasi terbaik yang telah dikurasi, bekali diri dengan panduan perjalanan terlengkap.'
      : 'Akses kurasi destinasi halal, dan perluas jejaring Anda dengan komunitas Muslimah yang inspiratif.';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 bg-gradient-to-br from-[#faf3ea] to-[#fde8e8]">
      <div className="w-full max-w-5xl bg-white rounded-3xl p-8 md:p-8 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-7 shadow-2xl">
        {/* Hero Section */}
        <div
          className="rounded-xl overflow-hidden relative bg-cover bg-center min-h-[500px]"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-black/65" />

          {/* Brand Section */}
          <div className="relative z-10 flex items-center gap-3 p-7">
            <Link to="/">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center cursor-pointer hover:shadow-lg transition">
                <img src={LogoImage} alt="Saleema Tour" className="w-24 h-24" />
              </div>
            </Link>
            <div className="flex flex-col text-white leading-tight">
              <span className="text-2xl font-bold">Saleema</span>
              <span className="text-base font-bold">Tour</span>
            </div>
          </div>

          {/* Copy Section */}
          <div className="relative z-10 px-7 pb-8 text-white max-w-xs mt-20">
            <p className="text-xl leading-relaxed font-semibold">{heroCopy}</p>
            <span className="inline-block w-28 h-0.5 bg-white rounded-full mt-4" />
          </div>
        </div>

        {/* Form Section */}
        <div className="flex items-stretch w-full">
          <div className="bg-white border-2 border-pink-300 rounded-2xl p-8 md:p-10 flex flex-col justify-center flex-1 shadow-lg">
            <h1 className="text-3xl text-center mb-7 font-bold text-gray-900">
              {heroTitle}
            </h1>

            <form
              onSubmit={
                step === 'email' ? handleEmailSubmit : handleResetSubmit
              }
              className="flex flex-col gap-4"
            >
              {step === 'email' && (
                <Input
                  label="Email"
                  type="email"
                  placeholder="Masukkan email.."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={EmailIcon}
                />
              )}

              {step === 'reset' && (
                <>
                  <Input
                    label="Password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Masukkan password baru..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    showPasswordToggle
                    onPasswordToggle={() => setShowPwd(!showPwd)}
                    isPasswordVisible={showPwd}
                  />

                  <Input
                    label="Konfirmasi Password"
                    type={showConfirmPwd ? 'text' : 'password'}
                    placeholder="Masukkan ulang password baru.."
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    showPasswordToggle
                    onPasswordToggle={() => setShowConfirmPwd(!showConfirmPwd)}
                    isPasswordVisible={showConfirmPwd}
                  />
                </>
              )}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="light-pink-hover-dark-pink"
                  disabled={loading}
                  className="text-sm"
                >
                  {loading
                    ? step === 'email'
                      ? 'Mengirim...'
                      : 'Mengatur Ulang...'
                    : step === 'email'
                      ? 'Kirim Link Reset'
                      : 'Atur Ulang Password'}
                </Button>
              </div>
            </form>

            {step === 'email' && (
              <div className="text-center mt-4 text-sm flex justify-center gap-1">
                <span>Belum punya akun? </span>
                <Link
                  to="/signup"
                  className="text-red-400 font-semibold hover:text-red-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
