// src/pages/SignUp.tsx
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { register as registerApi } from "../api/auth"; // axios helper

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // bisa disimpan ke FE saja dulu
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!agree) {
      alert("Harap setujui kebijakan privasi terlebih dahulu");
      return;
    }

    if (password !== confirm) {
      alert("Password dan konfirmasi tidak sama");
      return;
    }

    try {
      setLoading(true);

      // kirim ke backend (phone bisa ditambahkan kalau BE siap)
      await registerApi(fullName, email, password);

      alert("Registrasi berhasil, silakan login");
      navigate("/login");
    } catch (err: any) {
      alert(err.message || "Registrasi gagal");
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
            <h1 className="auth-title">Sign Up</h1>

            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-field">
                <span className="auth-label">Nama Lengkap</span>
                <div className="auth-input-wrap">
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <img
                    src="/icon-user.svg"
                    alt=""
                    className="auth-input-icon"
                  />
                </div>
              </label>

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
                <span className="auth-label">Nomor Telepon</span>
                <div className="auth-input-wrap">
                  <input
                    type="tel"
                    placeholder="Masukkan nomor telepon..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <img
                    src="/icon-phone.svg"
                    alt=""
                    className="auth-input-icon"
                  />
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

              <label className="auth-field">
                <span className="auth-label">Konfirmasi Password</span>
                <div className="auth-input-wrap">
                  <input
                    type="password"
                    placeholder="Masukkan kembali password..."
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
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
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    required
                  />
                  <span>
                    Saya setuju dengan semua kebijakan privasi yang ada
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Sign Up"}
              </button>

              <div className="auth-row auth-row-center auth-bottom-text">
                <span>Sudah punya akun? </span>
                <Link to="/login" className="auth-link">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
