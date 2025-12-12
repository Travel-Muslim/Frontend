import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

type Step = "email" | "reset";

const HERO_CONTENT = {
  email: {
    image: "/bg 1 1.svg",
    title: "Masukkan Email",
    copy:
      "Temukan destinasi terbaik yang telah dikurasi, bekali diri dengan panduan perjalanan terlengkap.",
  },
  reset: {
    image: "/bg 6 1.svg",
    title: "Buat Password Baru",
    copy:
      "Akses kurasi destinasi halal, dan perluas jejaring Anda dengan komunitas Muslimah yang inspiratif.",
  },
};

const mailIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z"
      stroke="#f391a5"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M5 8l7 5 7-5" stroke="#f391a5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const eyeIcon = (hidden: boolean) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {hidden ? (
      <>
        <path
          d="M3 3l18 18"
          stroke="#f391a5"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.7 10.7A2 2 0 0113.3 13.3M9.9 5.1a8.5 8.5 0 018 1.3 12.5 12.5 0 013.2 3.3 1.4 1.4 0 010 1.6 12.5 12.5 0 01-2 2.3M5.3 5.3a12.6 12.6 0 00-2.2 2.4 1.4 1.4 0 000 1.6 12.5 12.5 0 003.2 3.3 8.5 8.5 0 004.2 1.5"
          stroke="#f391a5"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <path
          d="M2.1 12.5a1.3 1.3 0 010-1c2.7-5.8 9.1-7.5 13.7-4a9.8 9.8 0 013.2 4 1.3 1.3 0 010 1c-2.7 5.8-9.1 7.5-13.7 4a9.8 9.8 0 01-3.2-4z"
          stroke="#f391a5"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.5" stroke="#f391a5" strokeWidth="1.6" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState("");

  const hero = useMemo(() => HERO_CONTENT[step], [step]);

  const validateEmail = (val: string) => /^\S+@\S+\.\S+$/.test(val);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Email tidak valid");
      return;
    }
    setError("");
    setStep("reset");
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok");
      return;
    }
    setError("");
    alert("Password berhasil diatur ulang. Silakan login.");
    navigate("/login");
  };

  return (
    <div className="fp-root">
      <div className="fp-shell">
        <div className="fp-hero" style={{ backgroundImage: `url(${hero.image})` }}>
          <div className="fp-hero-overlay" />
          <div className="fp-hero-brand">
            <div className="fp-logo-circle">
              <img src="/logo.svg" alt="Saleema" />
            </div>
            <div className="fp-brand-text">
              <span className="fp-brand-title">Saleema</span>
              <span className="fp-brand-sub">Tour</span>
            </div>
          </div>
          <div className="fp-hero-copy">
            <p>{hero.copy}</p>
            <span className="fp-hero-line" />
          </div>
        </div>

        <div className="fp-form-pane">
          <div className="fp-form-card">
            <h1 className="fp-title">{hero.title}</h1>
            <form onSubmit={step === "email" ? handleEmailSubmit : handleResetSubmit} className="fp-form">
              {step === "email" && (
                <label className="fp-field">
                  <span className="fp-label">Email</span>
                  <div className="fp-input">
                    <input
                      type="email"
                      placeholder="Masukkan email.."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <span className="fp-icon">{mailIcon}</span>
                  </div>
                </label>
              )}

              {step === "reset" && (
                <>
                  <label className="fp-field">
                    <span className="fp-label">Password</span>
                    <div className="fp-input">
                      <input
                        type={showPwd ? "text" : "password"}
                        placeholder="Masukkan password baru..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="fp-icon-btn"
                        onClick={() => setShowPwd((s) => !s)}
                        aria-label={showPwd ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        {eyeIcon(!showPwd)}
                      </button>
                    </div>
                  </label>

                  <label className="fp-field">
                    <span className="fp-label">Konfirmasi Password</span>
                    <div className="fp-input">
                      <input
                        type={showConfirmPwd ? "text" : "password"}
                        placeholder="Masukkan ulang password baru.."
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="fp-icon-btn"
                        onClick={() => setShowConfirmPwd((s) => !s)}
                        aria-label={showConfirmPwd ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        {eyeIcon(!showConfirmPwd)}
                      </button>
                    </div>
                  </label>
                </>
              )}

              {error && <div className="fp-error">{error}</div>}

              <button type="submit" className="fp-primary-btn">
                {step === "email" ? "Selanjutnya" : "Atur Ulang Password"}
              </button>
            </form>

            <div className="fp-bottom">
              <span>Belum punya akun?</span>
              <Link to="/signup" className="fp-link">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
