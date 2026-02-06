import React, { useCallback, useEffect, useMemo, useState } from 'react';
import avatarDefault from '@/assets/icon/avatar-default.svg';
import {
  fetchDashboard as fetchDashboardApi,
  type DashboardPayload,
  type StatKey,
  type PackageStat,
  type Buyer,
  type TripRow,
  type DashboardStats,
  type BookingStatus,
} from '../../api/dashboard';
import AdminLayout from '../../components/admin/AdminLayout';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace('Rp', 'Rp. ');

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardPayload>({});
  const [loading, setLoading] = useState(true);

  const totalStatus = useMemo(() => {
    const statusValues = dashboardData.status;
    if (!statusValues) return 0;
    return Object.values(statusValues).reduce(
      (sum, value) => sum + (value || 0),
      0
    );
  }, [dashboardData.status]);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const payload = await fetchDashboardApi();
      setDashboardData({
        stats: payload.stats,
        packages: payload.packages || [],
        buyers: payload.buyers || [],
        status: payload.status,
        trips: payload.trips || [],
      });
    } catch (error) {
      console.error('Gagal memuat dashboard:', error);
      setDashboardData({
        stats: undefined,
        packages: [],
        buyers: [],
        status: undefined,
        trips: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    const id = setInterval(loadDashboard, 12000);
    return () => clearInterval(id);
  }, [loadDashboard]);

  return (
    <AdminLayout title="Dashboard Admin">
      {loading ? (
        <div className="space-y-6">
          <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100">
                <LoadingSkeleton />
              </div>
            ))}
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <LoadingSkeleton />
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <LoadingSkeleton />
            </div>
          </section>
        </div>
      ) : (
        <>
      <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4">
        {(dashboardData.stats
          ? [
              {
                key: 'booking',
                label: 'Total Booking',
                value: dashboardData.stats.totalBooking,
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="12"
                      rx="2"
                      fill="none"
                      stroke="#b595eb"
                      strokeWidth="2"
                    />
                    <path d="M8 2v4M16 2v4M3 10h18" stroke="#b595eb" strokeWidth="2" />
                  </svg>
                ),
              },
              {
                key: 'profit',
                label: 'Profit',
                value: dashboardData.stats.profit,
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                      d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"
                      stroke="#b595eb"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
              {
                key: 'active',
                label: 'Pembeli Aktif',
                value: dashboardData.stats.pembeliAktif,
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      fill="none"
                      stroke="#b595eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M4 20c0-4 4-6 8-6s8 2 8 6"
                      fill="none"
                      stroke="#b595eb"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
            ]
          : []
        ).map((s) => (
          <div
            key={s.key}
            className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              {s.icon}
            </div>
            <div>
              <div className="text-gray-500 text-sm font-medium mb-1">
                {s.label}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {s.key === 'profit' ? formatCurrency(s.value) : s.value}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Paket Tour Teratas
          </h3>
          <div className="space-y-6">
            {(dashboardData.packages || []).map((p, index) => (
              <div
                key={p.name || index}
                className="flex items-center gap-4"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-3">
                    {p.name}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-200 h-2 rounded-full flex-1">
                      <div
                        className="h-[1rem] bg-gradient-to-r from-[#b28be2] to-[#caa8f3] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, p.percentage)}% ` }}
                      />
                    </div>
                    <div className="font-semibold text-gray-700 text-sm">
                      {p.percentage}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="bg-[#b28be2] text-white px-6 py-4 rounded-t-2xl font-semibold">
            Pembeli Teratas
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(dashboardData.buyers || []).map((b, index) => (
                <div
                  key={b.nama || index}
                  className="flex items-center gap-3"
                >
                  <img
                    src={b.profileImage || avatarDefault}
                    alt={b.nama}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{b.nama}</div>
                    <div className="text-gray-500 text-xs">
                      {b.totalBooking} Booking • {b.totalUlasan} Ulasan
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Status Booking
          </h3>
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-48 h-48">
              <svg
                viewBox="0 0 120 120"
                className="w-48 h-48 -rotate-90"
              >
                <circle
                  className="fill-none stroke-gray-100 stroke-[8]"
                  cx="60"
                  cy="60"
                  r="42"
                />
                {Object.entries(dashboardData.status || {}).map(
                  ([label, value], index, arr) => {
                    const total = Object.values(
                      dashboardData.status || {}
                    ).reduce((sum, val) => sum + val, 0);
                    const pct = total ? (value / total) * 100 : 0;
                    const dash = (pct * 2 * Math.PI * 42) / 100;
                    const gap = 2 * Math.PI * 42 - dash;

                    const colors = ['#3B82F6', '#EC4899', '#8B5CF6', '#10B981'];
                    const color = colors[index % colors.length];

                    const prevSegments = arr.slice(0, index);
                    const prevTotal = prevSegments.reduce(
                      (sum, [_, val]) => sum + (val / total) * 100,
                      0
                    );
                    const offset = -(prevTotal * 2 * Math.PI * 42) / 100;

                    return (
                      <circle
                        key={label}
                        className="fill-none stroke-[8]"
                        stroke={color}
                        cx="60"
                        cy="60"
                        r="42"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={offset}
                      />
                    );
                  }
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-bold text-gray-900">
                  {Object.values(dashboardData.status || {}).reduce(
                    (sum, val) => sum + val,
                    0
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {Object.entries(dashboardData.status || {}).map(
                ([label, value], index) => {
                  const colors = ['#3B82F6', '#EC4899', '#8B5CF6', '#10B981'];
                  const color = colors[index % colors.length];
                  const labelNames = {
                    asia: 'Paket Halal Tour Asia',
                    eropa: 'Paket Halal Tour Eropa',
                    australia: 'Paket Halal Tour Australia',
                    afrika: 'Paket Halal Tour Afrika',
                  };
                  return (
                    <div
                      key={label}
                      className="flex items-center gap-3 font-medium text-gray-700"
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span>
                        {labelNames[label as keyof typeof labelNames] || 
                          label.charAt(0).toUpperCase() + label.slice(1)}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="bg-[#b28be2] text-white px-6 py-4 rounded-t-2xl font-semibold">
            Perjalanan Terbaru
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 pb-2 border-b border-gray-100 text-sm font-medium text-gray-500">
                <span>Pembeli</span>
                <span>Paket Tour</span>
                <span className="text-right">Harga</span>
              </div>
              {(dashboardData.trips || []).map((t, index) => (
                <div
                  key={`${t.buyer}-${index}`}
                  className="grid grid-cols-3 gap-4 items-center py-3 border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarDefault}
                      alt={t.buyer}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-900">{t.buyer}</span>
                  </div>
                  <span className="text-gray-700">{t.tour}</span>
                  <span className="font-semibold text-gray-900 text-right">
                    {formatCurrency(t.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
        </>
      )}
    </AdminLayout>
  );
}
