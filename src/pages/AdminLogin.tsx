import React, { useState, FormEvent } from "react";
import "./AdminLogin.css";
import { useNavigate, useLocation } from "react-router-dom";
import { login as loginApi } from "../api/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      setError("");
      await loginApi(email, password);
      localStorage.setItem("isLoggedIn", "1");
      navigate((location.state as any)?.from ?? "/admin");
    } catch (err: any) {
      setError(err?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alogin-root">
      <div className="alogin-card">
        <div className="alogin-brand">
          <div className="alogin-logo">
            <img src="/logo.svg" alt="Saleema" />
          </div>
          <div>
            <div className="alogin-title">Saleema Tour</div>
            <div className="alogin-sub">Admin Panel</div>
          </div>
        </div>

        <h1 className="alogin-head">Admin Sign In</h1>
        <p className="alogin-desc">Masuk ke dashboard admin untuk mengelola pengguna, paket, artikel, dan komunitas.</p>

        <form className="alogin-form" onSubmit={handleSubmit}>
          <label className="alogin-field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@saleema.test" />
          </label>
          <label className="alogin-field">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Masukkan password" />
          </label>
          {error && <div className="alogin-error">{error}</div>}
          <button type="submit" className="alogin-btn" disabled={loading}>
            {loading ? "Memproses..." : "Masuk Admin"}
          </button>
          <button type="button" className="alogin-link" onClick={() => navigate("/login")}>
            Masuk sebagai User
          </button>
        </form>
      </div>
      <div className="alogin-illustration">
        <div className="alogin-illus-card">
          <h3>Kontrol penuh</h3>
          <p>Kelola konten, pesanan, komunitas, dan pengguna dari satu tempat.</p>
        </div>
      </div>
    </div>
  );
}