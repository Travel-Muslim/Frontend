import React, { useEffect, useRef, useState } from "react";
import "./Profile.css";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
};

const STORAGE_KEY = "profile_user";

const loadProfile = (): ProfileData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ProfileData;
  } catch (err) {
    console.error("Failed to load user profile", err);
  }
  return { name: "", email: "", phone: "", password: "", avatar: "" };
};

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const data = loadProfile();
    setName(data.name);
    setEmail(data.email);
    setPhone(data.phone);
    setPassword(data.password);
    setAvatar(data.avatar);
  }, []);

  const handleSave = () => {
    const payload: ProfileData = { name, email, phone, password, avatar };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem("user", JSON.stringify({ fullname: name, email, role: "user", avatar_url: avatar }));
    setSuccess(true);
  };

  return (
    <div className="profile-page user-profile-page">
      <header className="profile-hero">
        <div>
          <h1>Edit Profil</h1>
          <p>Lengkapi dan perbarui data diri anda untuk pengalaman yang lebih maksimal.</p>
        </div>
      </header>

      <section className="profile-card">
        <div className="profile-card-head">Informasi Profil</div>

        <div className="profile-avatar-row">
          <div className="profile-avatar" onClick={() => fileInputRef.current?.click()}>
            {avatar ? <img src={avatar} alt="Avatar" /> : <span className="profile-avatar-placeholder">📷</span>}
          </div>
          <div className="profile-avatar-actions">
            <button type="button" className="profile-btn primary" onClick={() => fileInputRef.current?.click()}>
              Unggah Foto Profil
            </button>
            <button type="button" className="profile-btn danger" onClick={() => setAvatar("")}>
              Hapus
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setAvatar(url);
                }
              }}
            />
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-detail-head">Informasi Detail</div>

        <div className="profile-grid">
          <label className="profile-field">
            <span>Nama</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama lengkap" />
          </label>
          <label className="profile-field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan email" />
          </label>
          <label className="profile-field">
            <span>No Telepon</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Masukkan nomor telepon" />
          </label>
          <label className="profile-field">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" />
          </label>
        </div>

        <div className="profile-actions">
          <button type="button" className="profile-btn danger" onClick={() => window.history.back()}>
            Batalkan Perubahan
          </button>
          <button type="button" className="profile-btn primary" onClick={handleSave}>
            Simpan Perubahan
          </button>
        </div>
      </section>

      {success && (
        <div className="profile-modal">
          <div className="profile-modal-card">
            <div className="profile-modal-icon">✓</div>
            <h3>Perubahan Berhasil Disimpan</h3>
            <button type="button" className="profile-btn primary" onClick={() => setSuccess(false)}>
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
