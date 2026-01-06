import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  key: string;
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', path: '/admin' },
  { key: 'users', label: 'Manajemen User', path: '/admin/users' },
  { key: 'packages', label: 'Manajemen Paket', path: '/admin/packages' },
  { key: 'articles', label: 'Manajemen Artikel', path: '/admin/articles' },
  { key: 'community', label: 'Manajemen Komunitas', path: '/admin/community' },
  { key: 'orders', label: 'Manajemen Order', path: '/admin/orders' },
];

function NavIcon({ name }: { name: NavItem['key'] }) {
  const stroke = '#8b6bd6';
  switch (name) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="3"
            width="8"
            height="8"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="13"
            y="3"
            width="8"
            height="5"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="3"
            y="13"
            width="5"
            height="8"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="10"
            y="13"
            width="11"
            height="8"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="9"
            cy="8"
            r="4"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M3 20c0-3.5 3-6 6-6"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="18"
            cy="9"
            r="3"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M15.5 15.5c1.5 0 5.5 1 5.5 4.5"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'packages':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M4 7.5v9l8 4.5 8-4.5v-9"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path d="M12 12v9" stroke={stroke} strokeWidth="2" fill="none" />
        </svg>
      );
    case 'articles':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="5"
            y="4"
            width="14"
            height="16"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M8 8h8M8 12h8M8 16h5"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'community':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="7"
            cy="9"
            r="3"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="17"
            cy="9"
            r="3"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M3 18c0-3 3-5 7-5"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M21 18c0-3-3-5-7-5"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'orders':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M7 9h10M7 13h7"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

interface AdminSidebarProps {
  navOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ navOpen, onClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (current: string, target: string) =>
    target === '/admin'
      ? current === target
      : current === target || current.startsWith(`${target}/`);

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] max-w-[82vw] sm:max-w-[90vw] bg-white border-r border-[#f0e8e2] px-[18px] lg:px-[18px] py-6 flex flex-col gap-6 lg:gap-6 z-30 transition-transform duration-[280ms] ease-out overflow-y-auto ${
        navOpen
          ? 'translate-x-0 shadow-[18px_0_38px_rgba(15,23,42,0.14)]'
          : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#f4ebff] rounded-[14px] grid place-items-center shadow-[0_10px_30px_rgba(157,129,224,0.2)]">
          <img src="/logo.svg" alt="Saleema" className="w-8 h-8" />
        </div>
        <div>
          <strong className="block text-[17px] sm:text-[15px]">Saleema</strong>
          <span className="text-[#b08cf2] font-bold text-[14px] sm:text-[12px] tracking-[0.1px]">
            Tour
          </span>
        </div>
      </div>
      <nav className="flex flex-col gap-2 w-full">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`border-0 flex items-center gap-3 px-[14px] py-3 rounded-xl font-bold cursor-pointer transition-all duration-150 whitespace-normal text-left ${
              isActive(location.pathname, item.path)
                ? 'bg-gradient-to-r from-[#efebff] to-[#f7f1ff] text-[#6f4ab1] shadow-[0_8px_18px_rgba(140,107,214,0.15)]'
                : 'bg-transparent text-[#4a4a4f] hover:bg-gradient-to-r hover:from-[#efebff] hover:to-[#f7f1ff] hover:text-[#6f4ab1] hover:shadow-[0_8px_18px_rgba(140,107,214,0.15)]'
            } sm:text-[12.5px] sm:px-[10px] sm:py-2 sm:leading-tight`}
            type="button"
            onClick={() => {
              onClose();
              navigate(item.path);
            }}
          >
            <span
              className={`w-8 h-8 rounded-[10px] grid place-items-center ${
                isActive(location.pathname, item.path)
                  ? 'bg-[#d6c2ff] shadow-[0_8px_18px_rgba(140,107,214,0.2)]'
                  : 'bg-[#f7f0ff] shadow-[inset_0_0_0_1px_#efe6fc]'
              }`}
            >
              <NavIcon name={item.key as NavItem['key']} />
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
