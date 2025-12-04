import { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const defaultAvatar = "/avatar-default.svg";
  const avatar = user?.avatar || defaultAvatar;

  const handleAvatarClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <header
      className={`st-header ${
        scrolled ? "st-header--solid" : "st-header--transparent"
      }`}
    >
      <div className="st-header-inner">
        <div className="st-header-left">
          <div className="st-logo-circle">
            <img src="/logo.svg" alt="Saleema Tour" />
          </div>
          <div className="st-brand">
            <span className="st-brand-title">Saleema</span>
            <span className="st-brand-sub">Tour</span>
          </div>
        </div>

        <nav className="st-nav">
          <a href="/home">Home</a>
          <a href="/wishlist">Wishlist</a>
          <a href="/riwayat">Riwayat</a>
          <a href="/artikel">Artikel</a>
          <a href="/komunitas">Komunitas</a>

          <div className="st-avatar" onClick={handleAvatarClick}>
            <img
              src={avatar}
              onError={(e) => (e.currentTarget.src = defaultAvatar)}
              alt="User Avatar"
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
