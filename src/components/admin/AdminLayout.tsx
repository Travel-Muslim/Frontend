import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div
      className={`min-h-screen grid grid-cols-1 lg:grid-cols-[250px_1fr] bg-gray-50 text-gray-900 ${
        navOpen ? 'overflow-hidden' : ''
      }`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/25 z-[15] transition-opacity duration-200 ${
          navOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setNavOpen(false)}
      />

      {/* Sidebar */}
      <AdminSidebar navOpen={navOpen} onClose={() => setNavOpen(false)} />

      {/* Main Content */}
      <main className="px-4 sm:px-8 py-7 pb-12 flex flex-col gap-[18px]">
        <AdminHeader
          title={title}
          onMenuClick={() => setNavOpen(true)}
        />
        {children}
      </main>
    </div>
  );
}
