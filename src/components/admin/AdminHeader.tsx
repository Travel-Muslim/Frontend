import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import avatarDefault from '@/assets/icon/avatar-default.svg';
import { UserProfileSkeleton } from '../ui/skeletons/UserProfileSkeleton';
import DropdownProfile, { ProfileMenuItem } from '../ui/dropdown/DropdownProfile';

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function AdminHeader({
  title,
  onMenuClick,
}: AdminHeaderProps) {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();

  // Menu items untuk admin
  const adminMenuItems: ProfileMenuItem[] = [
    {
      id: 'edit',
      label: 'Edit Profil',
      icon: 'edit',
      action: 'edit-profile',
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      action: 'custom',
      onClick: () => navigate('/wishlist'),
    },
    {
      id: 'riwayat',
      label: 'Riwayat Pesanan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: 'custom',
      onClick: () => navigate('/riwayat'),
    },
    {
      id: 'dashboard',
      label: 'Dashboard Admin',
      icon: 'dashboard',
      action: 'admin-dashboard',
    },
    {
      id: 'signout',
      label: 'Sign Out',
      icon: 'logout',
      action: 'logout',
    },
  ];

  // Menu items untuk user biasa
  const userMenuItems: ProfileMenuItem[] = [
    {
      id: 'edit',
      label: 'Edit Profil',
      icon: 'edit',
      action: 'edit-profile',
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      action: 'custom',
      onClick: () => navigate('/wishlist'),
    },
    {
      id: 'riwayat',
      label: 'Riwayat Pesanan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: 'custom',
      onClick: () => navigate('/riwayat'),
    },
    {
      id: 'komunitas',
      label: 'Komunitas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      action: 'custom',
      onClick: () => navigate('/komunitas'),
    },
    {
      id: 'signout',
      label: 'Sign Out',
      icon: 'logout',
      action: 'logout',
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

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
      <div className="flex items-center gap-3">
        {loading ? (
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-2xl border border-gray-200">
            <UserProfileSkeleton />
          </div>
        ) : (
          <DropdownProfile
            userName={user?.fullname || 'User'}
            userAvatar={user?.avatar_url}
            menuItems={menuItems}
            className=""
            buttonClassName="bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow px-3 py-2 text-gray-900"
            onLogoutSuccess={() => {
              navigate('/');
            }}
          />
        )}
      </div>
    </header>
  );
}
