import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
  profileOpen: boolean;
  onProfileToggle: () => void;
}

export default function AdminHeader({
  title,
  onMenuClick,
  profileOpen,
  onProfileToggle,
}: AdminHeaderProps) {
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        onProfileToggle();
      }
    };
    if (profileOpen) {
      document.addEventListener('click', close);
    }
    return () => document.removeEventListener('click', close);
  }, [profileOpen, onProfileToggle]);

  return (
    <header className="flex flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-[10px]">
        <button
          className="lg:hidden w-10 h-10 rounded-xl border border-[#e6dafd] bg-[#f7f0ff] p-2 flex flex-col justify-center items-center gap-[5px] shadow-[0_10px_22px_rgba(140,107,214,0.2)] cursor-pointer"
          type="button"
          aria-label="Buka navigasi"
          onClick={onMenuClick}
        >
          <span className="block w-full h-[2px] rounded-full bg-[#7b5ad3]" />
          <span className="block w-full h-[2px] rounded-full bg-[#7b5ad3]" />
          <span className="block w-full h-[2px] rounded-full bg-[#7b5ad3]" />
        </button>
        <h1 className="m-0 text-[22px] sm:text-[18px] md:text-[20px] text-[#1f1f28]">
          {title}
        </h1>
      </div>
      <div className="relative" ref={userMenuRef}>
        <button
          className="flex items-center gap-[10px] sm:gap-2 bg-white px-3 py-2 rounded-[14px] shadow-[0_12px_30px_rgba(15,23,42,0.12)] border border-[#f2e9ff] cursor-pointer"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onProfileToggle();
          }}
        >
          <img
            src="/avatar.jpg"
            alt="Admin"
            className="w-[42px] h-[42px] sm:w-[38px] sm:h-[38px] rounded-full object-cover"
          />
          <div>
            <div className="font-extrabold text-[14px] sm:text-[13px]">
              Madam
            </div>
            <div className="text-[#9b9aa5] text-xs sm:text-[11px]">Admin</div>
          </div>
        </button>
        {profileOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-[#ece9f6] shadow-[0_14px_32px_rgba(0,0,0,0.12)] rounded-xl p-[6px] min-w-[170px] z-[35]">
            <button
              type="button"
              className="w-full flex items-center gap-[10px] px-[10px] py-[10px] border-0 bg-transparent font-bold text-[#3a3a3a] rounded-[10px] cursor-pointer transition-colors duration-150 hover:bg-[#f5f2ff]"
              onClick={() => {
                onProfileToggle();
                navigate('/');
              }}
            >
              <span className="text-base inline-flex items-center justify-center w-5 h-5 text-center">
                ↩
              </span>
              <span>Sign Out</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-[10px] px-[10px] py-[10px] border-0 bg-transparent font-bold text-[#3a3a3a] rounded-[10px] cursor-pointer transition-colors duration-150 hover:bg-[#f5f2ff]"
              onClick={() => {
                onProfileToggle();
                navigate('/admin/profile');
              }}
            >
              <span className="text-base inline-flex items-center justify-center w-5 h-5 text-center">
                👤
              </span>
              <span>Edit Profil</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
