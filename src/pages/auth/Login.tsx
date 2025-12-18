import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login as loginApi } from '../../api/auth';
import Input from '../../components/ui/input/Input';
import Button from '../../components/ui/button/Button';
import { ToastContainer, ToastItem } from '../../components/ui/toast/Toast';
import { EmailIcon } from '../../assets/icon';
import { LoginPng, LogoImage } from '../../assets/images';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle password visibility
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

    try {
      setLoading(true);
      await loginApi(email, password);

      if (remember) {
        localStorage.setItem('remember_email', email);
      } else {
        localStorage.removeItem('remember_email');
      }

      localStorage.setItem('isLoggedIn', '1');
      const redirectTarget =
        email === 'admin@saleema.test' ? '/admin' : location.state?.from;
      const bookingIntent = location.state?.booking;
      navigate(redirectTarget ?? '/home', {
        state: bookingIntent ? { booking: true } : undefined,
      });
    } catch (err: any) {
      addToast(
        err.message || 'Login gagal, silakan coba lagi',
        'error',
        'Login Gagal'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf3ea] flex items-center justify-center px-4 sm:px-8 py-10 box-border">
      <div className="w-full max-w-[1180px] bg-white rounded-[24px] p-8 sm:p-8 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-7 shadow-[0_24px_60px_rgba(15,23,42,0.16)] box-border">
        {/* Hero Section */}
        <div className="hidden lg:block bg-black rounded-[10px] overflow-hidden">
          <div
            className="relative h-[500px] bg-cover bg-center px-7 pt-7 pb-8 flex flex-col justify-start items-start text-white"
            style={{
              backgroundImage: `url(${LoginPng})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-black/65" />

            {/* Brand */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-[100px] h-[100px] flex-shrink-0">
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
              <p className="text-[20px] leading-[1.9] font-[580]">
                Temukan destinasi terbaik, panduan lengkap, hingga komunitas
                muslimah yang siap mendukung perjalananmu!
              </p>
              <div className="w-[110px] h-[2px] bg-white rounded-full mt-[18px]" />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex items-stretch w-full">
          <div className="bg-white border-[1.5px] border-[#ffbdcb] rounded-[20px] px-10 sm:px-10 py-8 flex-1 shadow-[0_20px_45px_rgba(0,0,0,0.08)] box-border w-full">
            <h1 className="text-[28px] text-center mb-7">Sign In</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
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

              <div className="flex justify-between items-center mt-1">
                <label className="inline-flex items-center gap-[6px] text-xs text-[#6b7280]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="accent-[#ff8fb1]"
                  />
                  <span>Ingat saya</span>
                </label>
                <button
                  type="button"
                  className="border-none bg-none p-0 text-xs text-[#f97373] hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/forgot-password')}
                >
                  Lupa Password?
                </button>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="light-pink-hover-dark-pink"
                >
                  {loading ? 'Memproses...' : 'Sign In'}
                </Button>
              </div>

              <div className="flex justify-center items-center gap-1 text-xs mt-1">
                <span>Belum punya akun? </span>
                <Link
                  to="/signup"
                  className="text-[#f97373] font-semibold hover:opacity-80 transition-opacity"
                >
                  Sign Up
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
