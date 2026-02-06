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

function NavIcon({ name, isActive }: { name: NavItem['key']; isActive: boolean }) {
  const stroke = isActive ? '#ffffff' : '#9ca3af';
  const fill = isActive ? '#ffffff' : 'none';
  
  switch (name) {
    case 'dashboard':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
    case 'orders':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
      className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] max-w-[82vw] sm:max-w-[90vw] bg-white border-r border-gray-200 px-6 py-6 flex flex-col gap-6 z-30 transition-transform duration-[280ms] ease-out overflow-y-auto ${
        navOpen
          ? 'translate-x-0 shadow-[18px_0_38px_rgba(15,23,42,0.14)]'
          : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-[14px] grid place-items-center shadow-[0_10px_30px_rgba(157,129,224,0.2)]">
          <img src="/logo.svg" alt="Saleema" className="w-7 h-7" />
        </div>
        <div>
          <strong className="block text-[17px] text-gray-900 font-bold">Saleema</strong>
          <span className="text-gray-600 font-medium text-[14px] tracking-[0.1px]">
            Tour
          </span>
        </div>
      </div>
      
      <nav className="flex flex-col gap-1 w-full">
        {NAV_ITEMS.map((item) => {
          const isItemActive = isActive(location.pathname, item.path);
          return (
            <button
              key={item.key}
              className={`border-0 flex items-center gap-4 px-4 py-3 rounded-xl font-medium cursor-pointer transition-all duration-200 whitespace-normal text-left w-full ${
                isItemActive
                  ? 'bg-gradient-to-r from-[#b28be2] to-[#caa8f3] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
              }`}
              type="button"
              onClick={() => {
                onClose();
                navigate(item.path);
              }}
            >
              <span className="flex items-center justify-center flex-shrink-0">
                <NavIcon name={item.key as NavItem['key']} isActive={isItemActive} />
              </span>
              <span className="text-[15px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
