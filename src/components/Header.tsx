import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import avatarDefault from "../assets/icon/avatar-default.svg";
import "./Header.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const forceSolid =
    location.pathname === "/wishlist" ||
    location.pathname.startsWith("/artikel/") ||
    location.pathname === "/riwayat" ||
    location.pathname === "/unduh" ||
    location.pathname === "/review";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`st-header ${scrolled || forceSolid ? "st-header--solid" : "st-header--transparent"}`}>
      <div className="st-header-inner">

        <div className="st-header-left">
          <Link to="/" className="st-logo-circle" onClick={() => setMenuOpen(false)}>
            <img src="/logo.svg" alt="Saleema Tour" />
          </Link>

          <div className="st-divider" />

          <div className="st-brand">
            <Link to="/" className="st-brand-link">
              <span className="st-brand-title">Saleema</span>
              <span className="st-brand-sub">Tour</span>
            </Link>
          </div>
        </div>

        <nav className={`st-nav ${menuOpen ? "st-nav--open" : ""}`}>
          <NavLink to="/home" className="st-nav-link">Home</NavLink>
          <NavLink to="/cari-destinasi" className="st-nav-link">Destinasi</NavLink>
          <NavLink to="/wishlist" className="st-nav-link">Wishlist</NavLink>
          <NavLink to="/riwayat" className="st-nav-link">Riwayat</NavLink>
          <NavLink to="/artikel" className="st-nav-link">Artikel</NavLink>
          <NavLink to="/komunitas" className="st-nav-link">Komunitas</NavLink>
        </nav>

        {menuOpen && (
          <div className="st-drawer-overlay" onClick={() => setMenuOpen(false)} />
        )}

        <div className="st-header-right">
          <button className="st-avatar" onClick={() => navigate("/login")}>
            <img src={avatarDefault} alt="Avatar Default" />
          </button>

          <button className="st-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
            <span />
          </button>
        </div>

      </div>
    </header>
  );
}
