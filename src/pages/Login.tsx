import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { login as loginApi } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await loginApi(email, password);

      if (remember) {
        localStorage.setItem("remember_email", email);
      } else {
        localStorage.removeItem("remember_email");
      }

      localStorage.setItem("isLoggedIn", "1");
      const redirectTarget = email === "admin@saleema.test" ? "/admin" : location.state?.from;
      const bookingIntent = location.state?.booking;
      navigate(redirectTarget ?? "/home", {
        state: bookingIntent ? { booking: true } : undefined,
      });
    } catch (err: any) {
      alert(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <div className="auth-hero-brand">
              <div className="auth-hero-logo">
                <img src="/logo.svg" alt="Saleema Tour" />
              </div>
              <div className="auth-hero-textbrand">
                <span className="auth-hero-title">Saleema</span>
                <span className="auth-hero-sub">Tour</span>
              </div>
            </div>

            <div className="auth-hero-copy">
              <p>
                Temukan destinasi terbaik, panduan lengkap, hingga komunitas
                muslimah yang siap mendukung perjalananmu!
              </p>
              <span className="auth-hero-line" />
            </div>
          </div>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-form-card">
            <h1 className="auth-title">Sign In</h1>

            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-field">
                <span className="auth-label">Email</span>
                <div className="auth-input-wrap">
                  <input
                    type="email"
                    placeholder="Masukkan email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <img src="/icon-mail.svg" alt="" className="auth-input-icon" />
                </div>
              </label>

              <label className="auth-field">
                <span className="auth-label">Password</span>
                <div className="auth-input-wrap">
                  <input
                    type="password"
                    placeholder="Masukkan password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <img
                    src="/icon-eye-off.svg"
                    alt=""
                    className="auth-input-icon"
                  />
                </div>
              </label>

              <div className="auth-row auth-row-small">
                <label className="auth-remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Ingat saya</span>
                </label>
                <button
                  type="button"
                  className="auth-link-button auth-forgot"
                  onClick={() => navigate("/forgot-password")}
                >
                  Lupa Password?
                </button>
              </div>

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Sign In"}
              </button>

              <div className="auth-row auth-row-center auth-bottom-text">
                <span>Belum punya akun? </span>
                <Link to="/signup" className="auth-link">
                  Sign Up
                </Link>
              </div>

              <div className="auth-or">atau login dengan</div>

              <div className="auth-social-row">
                <button type="button" className="auth-social-btn">
                  <img src="/icon-google.svg" alt="Google" />
                </button>
                <button type="button" className="auth-social-btn">
                  <img src="/icon-instagram.svg" alt="Instagram" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
