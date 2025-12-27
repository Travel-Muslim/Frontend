// src/pages/SignUp.tsx
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../api/auth'; // axios helper
import Input from '../../components/ui/input/Input';
import Button from '../../components/ui/button/Button';
import { ToastContainer, ToastItem } from '../../components/ui/toast/Toast';
import { EmailIcon, ProfileIcon, TelephoneIcon } from '../../assets/icon';
import { BgRegisterImage, LogoImage } from '../../assets/images';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!agree) {
      addToast(
        'Silakan setujui kebijakan privasi terlebih dahulu',
        'error',
        'Kebijakan Privasi'
      );
      return;
    }

    if (password !== confirm) {
      addToast(
        'Password dan konfirmasi tidak sama',
        'error',
        'Konfirmasi Password'
      );
      return;
    }

    try {
      setLoading(true);

      // kirim ke backend with all required fields
      await registerApi(fullName, email, password, agree, phone);

      addToast(
        'Akun Anda telah berhasil dibuat',
        'success',
        'Registrasi Berhasil'
      );
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect after 2 seconds to let user see success message
    } catch (err: any) {
      addToast(
        err.message || 'Registrasi gagal, silakan coba lagi',
        'error',
        'Registrasi Gagal'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf3ea] flex items-center justify-center px-4 sm:px-8 py-10 box-border">
      <div className="w-full max-w-295 bg-white rounded-3xl p-8 sm:p-8 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-7 shadow-[0_24px_60px_rgba(15,23,42,0.16)] box-border">
        {/* Hero Section */}
        <div className="hidden lg:block bg-black rounded-[10px] overflow-hidden">
          <div
            className="relative h-full bg-cover bg-center px-7 pt-7 pb-8 flex flex-col justify-start items-start text-white "
            style={{
              backgroundImage: `url(${BgRegisterImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/20 to-transparent" />

            {/* Brand */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-25 h-25 shrink-0">
                <Link to="/">
                  <img
                    src={LogoImage}
                    alt="Saleema Tour"
                    className="w-full h-full cursor-pointer"
                  />
                </Link>
              </div>
              <div className="flex flex-col leading-[1.1]">
                <span className="text-[30px] font-bold">Saleema</span>
                <span className="text-[18px] font-bold">Tour</span>
              </div>
            </div>

            {/* Copy */}
            <div className="relative z-10 mt-20 max-w-[320px]">
              <p className="text-[20px] leading-[1.9] font-[580] shadow-lg">
                Temukan destinasi terbaik, panduan lengkap, hingga komunitas
                muslimah yang siap mendukung perjalananmu!
              </p>
              <div className="w-27.5 h-0.5 bg-white rounded-full mt-4.5" />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex items-stretch w-full">
          <div className="bg-white border-[1.5px] border-[#ffbdcb] rounded-[20px] px-10 sm:px-10 py-8 flex-1 shadow-[0_20px_45px_rgba(0,0,0,0.08)] box-border w-full">
            <h1 className="text-[28px] text-center mb-7">Sign Up</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
              <Input
                label="Nama Lengkap"
                type="text"
                placeholder="Masukkan nama lengkap..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                icon={ProfileIcon}
              />

              <Input
                label="Email"
                type="email"
                placeholder="Masukkan email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={EmailIcon}
              />

              <Input
                label="Nomor Telepon"
                type="tel"
                placeholder="Masukkan nomor telepon..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={TelephoneIcon}
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                showPasswordToggle
                onPasswordToggle={togglePasswordVisibility}
                isPasswordVisible={showPassword}
              />

              <Input
                label="Konfirmasi Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kembali password..."
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                showPasswordToggle
                onPasswordToggle={togglePasswordVisibility}
                isPasswordVisible={showPassword}
              />

              <div className="flex items-start gap-1.5 text-xs text-[#6b7280] mt-1">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  required
                  className="accent-[#ff8fb1] mt-0.5 shrink-0"
                />
                <label className="leading-relaxed">
                  Saya setuju dengan semua kebijakan privasi yang ada
                </label>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="light-pink-hover-dark-pink"
                >
                  {loading ? 'Memproses...' : 'Sign Up'}
                </Button>
              </div>

              <div className="flex justify-center items-center gap-1 text-xs mt-1">
                <span>Sudah punya akun? </span>
                <Link
                  to="/login"
                  className="text-[#f97373] font-semibold hover:opacity-80 transition-opacity"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
