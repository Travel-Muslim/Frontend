import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, NavLink, useNavigate, matchPath } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AvatarDefaultIcon, ProfileOutlineIcon } from '@/assets/icon';
import { getProfile, type User } from '@api/auth';
import DropdownProfile from '../../ui/dropdown/DropdownProfile';
import Button from '../../ui/button/Button';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      setLoadingUser(true);
      const userData = await getProfile();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [fetchUser]);

  useEffect(() => {
    const path = location.pathname;

    const transparentRoutes = [
      '/artikel/:id',
      '/wishlist',
      '/riwayat',
      '/pembayaran-pesanan/:id',
    ];

    const isTransparentPage = transparentRoutes.some((route) =>
      matchPath(route, path)
    );

    if (isTransparentPage) {
      setScrolled(true);
      return;
    }

    setScrolled(window.scrollY > 80);

    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
    }
  };

  const profileMenuItems = [
    {
      id: 'wishlist',
      label: 'Wishlist',
      action: 'custom' as const,
      onClick: () => navigate('/wishlist'),
    },
    {
      id: 'riwayat',
      label: 'Riwayat',
      action: 'custom' as const,
      onClick: () => navigate('/riwayat'),
    },
    {
      id: 'edit',
      label: 'Edit Profil',
      icon: 'edit' as const,
      action: 'edit-profile' as const,
    },
    {
      id: 'signout',
      label: 'Sign Out',
      icon: 'logout' as const,
      action: 'logout' as const,
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full max-w-full overflow-visible z-[1000] transition-all duration-300 ${
        scrolled
          ? 'bg-[#6d4891] shadow-lg'
          : 'bg-transparent backdrop-filter-none'
      }`}
    >
      <div className="max-w-[1728px] w-full mx-auto px-[clamp(1rem,3vw,3.125rem)] py-[clamp(0.75rem,1.5vh,1.25rem)] flex items-center justify-between gap-[clamp(1rem,2.5vw,3rem)] box-border overflow-visible">
        <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
          <Link
            to="/"
            className="w-[clamp(46px,5vw,62px)] h-[clamp(48px,5.2vw,65px)] min-w-[46px] rounded-full bg-transparent flex items-center justify-center overflow-hidden flex-shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src="/logo.svg"
              alt="Saleema Tour"
              className="w-full h-full object-contain"
            />
          </Link>

          <div className="w-[clamp(1.5px,0.3vw,2px)] h-[clamp(52px,6vh,76px)] bg-white opacity-80 flex-shrink-0" />

          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="inline-flex flex-col gap-1 text-inherit no-underline"
            >
              <span className="font-semibold text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(1rem,1.2vw+0.2rem,1.25rem)]">
                Saleema
              </span>
              <span className="font-semibold text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(0.9rem,1vw+0.1rem,1.125rem)]">
                Tour
              </span>
            </Link>
          </div>
        </div>

        <nav
          className={`hidden lg:flex items-center gap-[clamp(1rem,2vw,1.938rem)] flex-1 justify-center min-w-0`}
        >
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `text-white font-normal text-[clamp(0.95rem,1.1vw+0.1rem,1.25rem)] tracking-[0.06rem] no-underline px-[clamp(0.625rem,1vw,0.875rem)] py-[clamp(0.5rem,1vh,0.75rem)] transition-all duration-300 ease-in-out hover:opacity-80 relative ${isActive ? 'font-bold' : 'font-normal'}`
            }
          >
            {({ isActive }) => (
              <>
                Home
                {isActive && (
                  <motion.span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                )}
              </>
            )}
          </NavLink>
          <NavLink
            to="/cari-destinasi"
            className={({ isActive }) =>
              `text-white font-normal text-[clamp(0.95rem,1.1vw+0.1rem,1.25rem)] tracking-[0.06rem] no-underline px-[clamp(0.625rem,1vw,0.875rem)] py-[clamp(0.5rem,1vh,0.75rem)] transition-all duration-300 ease-in-out hover:opacity-80 relative ${isActive ? 'font-bold' : 'font-normal'}`
            }
          >
            {({ isActive }) => (
              <>
                Destinasi
                {isActive && (
                  <motion.span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                )}
              </>
            )}
          </NavLink>
          <NavLink
            to="/rekomendasi-destinasi"
            className={({ isActive }) =>
              `text-white font-normal text-[clamp(0.95rem,1.1vw+0.1rem,1.25rem)] tracking-[0.06rem] no-underline px-[clamp(0.625rem,1vw,0.875rem)] py-[clamp(0.5rem,1vh,0.75rem)] transition-all duration-300 ease-in-out hover:opacity-80 relative ${isActive ? 'font-bold' : 'font-normal'}`
            }
          >
            {({ isActive }) => (
              <>
                Rekomendasi
                {isActive && (
                  <motion.span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                )}
              </>
            )}
          </NavLink>
          <NavLink
            to="/artikel"
            className={({ isActive }) =>
              `text-white font-normal text-[clamp(0.95rem,1.1vw+0.1rem,1.25rem)] tracking-[0.06rem] no-underline px-[clamp(0.625rem,1vw,0.875rem)] py-[clamp(0.5rem,1vh,0.75rem)] transition-all duration-300 ease-in-out hover:opacity-80 relative ${isActive ? 'font-bold' : 'font-normal'}`
            }
          >
            {({ isActive }) => (
              <>
                Artikel
                {isActive && (
                  <motion.span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                )}
              </>
            )}
          </NavLink>
          <NavLink
            to="/komunitas"
            className={({ isActive }) =>
              `text-white font-normal text-[clamp(0.95rem,1.1vw+0.1rem,1.25rem)] tracking-[0.06rem] no-underline px-[clamp(0.625rem,1vw,0.875rem)] py-[clamp(0.5rem,1vh,0.75rem)] transition-all duration-300 ease-in-out hover:opacity-80 relative ${isActive ? 'font-bold' : 'font-normal'}`
            }
          >
            {({ isActive }) => (
              <>
                Komunitas
                {isActive && (
                  <motion.span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                )}
              </>
            )}
          </NavLink>
        </nav>

        <div className="flex items-center gap-4 flex-shrink-0 min-w-0">
          <div className="relative z-[1100]">
            {user ? (
              <DropdownProfile
                userName={user.fullname || 'Guest'}
                userAvatar={user.avatar_url || ProfileOutlineIcon}
                menuItems={profileMenuItems}
                className="relative"
                menuClassName="!right-0 !left-auto"
                onLogoutSuccess={() => {
                  setUser(null);
                  navigate('/');
                }}
              />
            ) : (
              <Button
                variant="white-hover-light-purple"
                className="!min-w-[clamp(80px,15vw,120px)] !w-auto !h-[clamp(36px,4vh,44px)] !px-[clamp(16px,2vw,24px)] !text-[clamp(0.875rem,1.5vw,1rem)] font-semibold"
                onClick={handleAvatarClick}
                disabled={loadingUser}
              >
                {loadingUser ? 'Loading...' : 'Masuk'}
              </Button>
            )}
          </div>

          <button
            className="lg:hidden flex flex-col justify-center items-center gap-[clamp(3px,1vw,5px)] w-[clamp(36px,8vw,42px)] h-[clamp(36px,8vw,42px)] p-1.5 border-2 border-white border-opacity-30 bg-transparent rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#3b2550] hover:bg-opacity-10 flex-shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="block h-[2px] w-[clamp(16px,4vw,20px)] bg-white rounded-sm transition-all duration-300" />
            <span className="block h-[2px] w-[clamp(16px,4vw,20px)] bg-white rounded-sm transition-all duration-300" />
            <span className="block h-[2px] w-[clamp(16px,4vw,20px)] bg-white rounded-sm transition-all duration-300" />
          </button>
        </div>

        {/* Mobile drawer menu */}
        {menuOpen && (
          <nav className="fixed top-0 right-0 h-screen w-[clamp(260px,75vw,340px)] max-w-[85%] bg-[#6d4891] flex flex-col items-stretch p-0 gap-0 z-[2000] shadow-[-6px_0_24px_rgba(0,0,0,0.35)] rounded-tl-xl rounded-bl-xl overflow-y-auto -webkit-overflow-scrolling-touch transition-transform duration-300 ease-in-out lg:hidden">
            <div className="flex items-center gap-3 p-[clamp(16px,3vh,22px)_clamp(18px,4vw,24px)] border-b border-white border-opacity-10 bg-[#6d4891] bg-opacity-15">
              <div className="w-[clamp(42px,9vw,50px)] h-[clamp(42px,9vw,50px)] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0 bg-white bg-opacity-10">
                <img
                  src="/logo.svg"
                  alt="Saleema Tour"
                  className="w-[90%] h-[90%] object-contain"
                />
              </div>
              <div className="flex flex-col gap-0.5 leading-tight text-white">
                <span className="font-bold text-[clamp(0.95rem,3.5vw,1.1rem)] m-0">
                  Saleema
                </span>
                <span className="font-semibold text-[clamp(0.75rem,3vw,0.9rem)] opacity-90 m-0">
                  Tour
                </span>
              </div>
            </div>

            <button
              className="absolute top-[clamp(12px,2vh,16px)] right-[clamp(12px,3vw,18px)] bg-white bg-opacity-20 border-0 rounded-lg text-black text-[clamp(24px,5vw,30px)] w-[clamp(36px,8vw,42px)] h-[clamp(36px,8vw,42px)] flex items-center justify-center cursor-pointer z-[2010] transition-bg duration-200 hover:bg-opacity-35"
              onClick={() => setMenuOpen(false)}
            >
              &times;
            </button>

            <div className="flex flex-col">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `block py-[clamp(16px,3vh,20px)] px-[clamp(20px,4vw,28px)] border-b border-white border-opacity-8 text-white font-bold text-[clamp(0.95rem,3.5vw,1.1rem)] no-underline bg-transparent transition-all duration-300 ease-in-out hover:bg-white hover:text-[#6d4891] hover:bg-opacity-8 ${isActive ? 'bg-black bg-opacity-15 border-l-4 border-l-white font-extrabold' : 'hover:bg-opacity-8'}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/cari-destinasi"
                className={({ isActive }) =>
                  `block py-[clamp(16px,3vh,20px)] px-[clamp(20px,4vw,28px)] border-b border-white border-opacity-8 text-white font-bold text-[clamp(0.95rem,3.5vw,1.1rem)] no-underline bg-transparent transition-all duration-300 ease-in-out hover:bg-white hover:text-[#6d4891] hover:bg-opacity-8 ${isActive ? 'bg-black bg-opacity-15 border-l-4 border-l-white font-extrabold' : 'hover:bg-opacity-8'}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Destinasi
              </NavLink>
              <NavLink
                to="/artikel"
                className={({ isActive }) =>
                  `block py-[clamp(16px,3vh,20px)] px-[clamp(20px,4vw,28px)] border-b border-white border-opacity-8 text-white font-bold text-[clamp(0.95rem,3.5vw,1.1rem)] no-underline bg-transparent transition-all duration-300 ease-in-out hover:bg-white hover:text-[#6d4891] hover:bg-opacity-8 ${isActive ? 'bg-black bg-opacity-15 border-l-4 border-l-white font-extrabold' : 'hover:bg-opacity-8'}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Artikel
              </NavLink>
              <NavLink
                to="/komunitas"
                className={({ isActive }) =>
                  `block py-[clamp(16px,3vh,20px)] px-[clamp(20px,4vw,28px)] border-b border-white border-opacity-8 text-white font-bold text-[clamp(0.95rem,3.5vw,1.1rem)] no-underline bg-transparent transition-all duration-300 ease-in-out hover:bg-white hover:text-[#6d4891] hover:bg-opacity-8 ${isActive ? 'bg-black bg-opacity-15 border-l-4 border-l-white font-extrabold' : 'hover:bg-opacity-8'}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Komunitas
              </NavLink>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
