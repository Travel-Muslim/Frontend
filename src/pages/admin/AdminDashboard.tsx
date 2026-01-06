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
import { Dest1Image, Dest2Image, Dest3Image } from '@/assets/images';
import AdminLayout from '../../components/admin/AdminLayout';

const BASE_STATS: DashboardStats = {
  totalBooking: 200,
  profit: 20000000,
  pembeliAktif: 489,
};

const BASE_PACKAGES: PackageStat[] = [
  { name: 'Paket Tour Korea', percentage: 75, imageUrl: Dest1Image },
  { name: 'Paket Tour Japan', percentage: 55, imageUrl: Dest2Image },
  { name: 'Paket Tour Eropa', percentage: 35, imageUrl: Dest3Image },
];

const BASE_BUYERS: Buyer[] = [
  { nama: 'Sonya Nur Fadillah', totalBooking: 22, totalUlasan: 20 },
  { nama: 'Elsa Marta Saputri', totalBooking: 20, totalUlasan: 20 },
  { nama: 'Rinda Dwi Rahmawati', totalBooking: 18, totalUlasan: 18 },
  { nama: 'Mutiara Rengganis', totalBooking: 15, totalUlasan: 15 },
  { nama: 'Anisya Putri Niken', totalBooking: 12, totalUlasan: 12 },
  { nama: 'Farikh Assalsabila', totalBooking: 10, totalUlasan: 10 },
];

const BASE_STATUS: BookingStatus = {
  asia: 86,
  eropa: 70,
  australia: 42,
  afrika: 75,
};

const BASE_TRIPS: TripRow[] = [
  { buyer: 'Sonya Nur', tour: 'Uzbekistan', price: 21500000 },
  { buyer: 'Elsa Marta', tour: 'Japan', price: 17000000 },
  { buyer: 'Rinda Dwi', tour: 'Eropa', price: 25000000 },
];

function StatIcon({ name }: { name: StatKey }) {
  const fill = '#b595eb';
  switch (name) {
    case 'booking':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="3"
            fill="none"
            stroke={fill}
            strokeWidth="2"
          />
          <path d="M3 9h18" stroke={fill} strokeWidth="2" />
          <circle cx="8" cy="13" r="1.5" fill={fill} />
          <circle cx="12" cy="13" r="1.5" fill={fill} />
          <circle cx="16" cy="13" r="1.5" fill={fill} />
        </svg>
      );
    case 'profit':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 12.5 9.5 17 19 7.5"
            fill="none"
            stroke={fill}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M14 7.5H19V12"
            fill="none"
            stroke={fill}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'active':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="12"
            cy="8"
            r="4"
            fill="none"
            stroke={fill}
            strokeWidth="2"
          />
          <path
            d="M4 20c0-4 4-6 8-6s8 2 8 6"
            fill="none"
            stroke={fill}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace('Rp', 'Rp. ');

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardPayload>({
    stats: BASE_STATS,
    packages: BASE_PACKAGES,
    buyers: BASE_BUYERS,
    status: BASE_STATUS,
    trips: BASE_TRIPS,
  });

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
      const payload = await fetchDashboardApi();
      setDashboardData((prev) => ({
        stats: payload.stats ? payload.stats : prev.stats || BASE_STATS,
        packages:
          payload.packages &&
          Array.isArray(payload.packages) &&
          payload.packages.length
            ? payload.packages
            : prev.packages || BASE_PACKAGES,
        buyers:
          payload.buyers &&
          Array.isArray(payload.buyers) &&
          payload.buyers.length
            ? payload.buyers
            : prev.buyers || BASE_BUYERS,
        status: payload.status ? payload.status : prev.status || BASE_STATUS,
        trips:
          payload.trips && Array.isArray(payload.trips) && payload.trips.length
            ? payload.trips
            : prev.trips || BASE_TRIPS,
      }));
    } catch {
      setDashboardData((prev) => ({
        stats: prev.stats || BASE_STATS,
        packages: prev.packages || BASE_PACKAGES,
        buyers: prev.buyers || BASE_BUYERS,
        status: prev.status || BASE_STATUS,
        trips: prev.trips || BASE_TRIPS,
      }));
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    const id = setInterval(loadDashboard, 12000);
    return () => clearInterval(id);
  }, [loadDashboard]);

  return (
    <AdminLayout title="Dashboard Admin">
      <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-[14px] sm:gap-3">
        {(dashboardData.stats
          ? [
              {
                key: 'booking',
                label: 'Total Booking',
                value: dashboardData.stats.totalBooking,
              },
              {
                key: 'profit',
                label: 'Profit',
                value: dashboardData.stats.profit,
              },
              {
                key: 'active',
                label: 'Pembeli Aktif',
                value: dashboardData.stats.pembeliAktif,
              },
            ]
          : []
        ).map((s) => (
          <div
            key={s.key}
            className="bg-white p-4 sm:p-3 rounded-[14px] sm:rounded-2xl shadow-[0_16px_36px_rgba(15,23,42,0.12)] border border-[#f0e8ff] grid gap-2 content-start xs:grid-cols-[auto_1fr] xs:items-center"
          >
            <div className="w-12 h-12 xs:w-11 xs:h-11 rounded-xl bg-[#f2e9ff] grid place-items-center shadow-[inset_0_0_0_1px_#eadfff] xs:row-span-2">
              <StatIcon name={s.key as StatKey} />
            </div>
            <div className="text-[#7a7a80] font-bold leading-tight xs:col-start-2 text-sm">
              {s.label}
            </div>
            <div className="block text-[clamp(17px,4vw,22px)] xs:text-lg font-extrabold text-[#222222] leading-tight whitespace-normal break-words overflow-anywhere max-w-full xs:col-start-2">
              {s.key === 'profit' ? formatCurrency(s.value) : s.value}
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="bg-white rounded-[14px] p-4 shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#f0e8ff]">
          <h3 className="m-0 mb-[14px] text-[17px] text-[#252525]">
            Paket Tour Teratas
          </h3>
          <div className="flex flex-col gap-[14px]">
            {(dashboardData.packages || []).map((p, index) => (
              <div
                key={p.name || index}
                className="grid grid-cols-1 md:grid-cols-[130px_1fr] gap-3 items-center"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full md:w-[130px] h-[180px] md:h-[90px] object-cover rounded-xl shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                />
                <div>
                  <div className="font-extrabold mb-2 text-[#2c2c2c]">
                    {p.name}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#ede7f6] h-[10px] rounded-full w-full overflow-hidden">
                      <span
                        className="block h-full bg-gradient-to-r from-[#b99cec] to-[#8e6bdd] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, p.percentage)}%` }}
                      />
                    </div>
                    <div className="font-extrabold text-[#4c4c55]">
                      {p.percentage}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-4 shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#f0e8ff]">
          <div className="bg-gradient-to-r from-[#b28be2] to-[#caa8f3] text-white px-[14px] py-3 rounded-[10px] font-extrabold -mx-4 -mt-4 mb-[14px] shadow-[0_12px_24px_rgba(130,94,197,0.25)]">
            Pembeli Teratas
          </div>
          <div className="flex flex-col gap-3">
            {(dashboardData.buyers || []).map((b, index) => (
              <div
                key={b.nama || index}
                className="flex items-center gap-[10px] px-1 py-2 rounded-xl"
              >
                <img
                  src={b.profileImage || avatarDefault}
                  alt={b.nama}
                  className="w-10 h-10 rounded-full object-cover bg-[#f5eefb]"
                />
                <div>
                  <div className="font-extrabold text-[#2c2c32]">{b.nama}</div>
                  <div className="text-[#8b8894] text-xs">
                    {b.totalBooking} Booking • {b.totalUlasan} Ulasan
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-4 sm:gap-3">
        <div className="bg-white rounded-[14px] p-4 shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#f0e8ff]">
          <h3 className="m-0 mb-[14px] text-[17px] text-[#252525]">
            Status Booking
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-items-center">
            <div className="relative w-[190px] h-[190px] sm:w-[160px] sm:h-[160px]">
              <svg
                viewBox="0 0 120 120"
                className="w-[190px] h-[190px] sm:w-[160px] sm:h-[160px] -rotate-90"
              >
                <circle
                  className="fill-none stroke-[#f1e9ff] stroke-[12]"
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

                    const colors = ['#55c0f6', '#f776b9', '#aabdf5', '#61d4a5'];
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
                        className="fill-none stroke-[12] [stroke-linecap:round]"
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
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-2xl font-extrabold text-[#252525]">
                  {Object.values(dashboardData.status || {}).reduce(
                    (sum, val) => sum + val,
                    0
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              {Object.entries(dashboardData.status || {}).map(
                ([label, value], index) => {
                  const colors = ['#55c0f6', '#f776b9', '#aabdf5', '#61d4a5'];
                  const color = colors[index % colors.length];
                  return (
                    <div
                      key={label}
                      className="flex items-center gap-[10px] font-bold text-[#3b3b42]"
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span>
                        {label.charAt(0).toUpperCase() + label.slice(1)}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-4 shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#f0e8ff]">
          <div className="bg-gradient-to-b from-[#b58ee4] to-[#caa8f3] text-white px-[14px] py-3 rounded-[14px] font-extrabold -mx-4 -mt-4 mb-[14px] shadow-[0_12px_24px_rgba(130,94,197,0.25)]">
            Perjalanan Terbaru
          </div>
          <div className="grid gap-3">
            <div className="grid grid-cols-[1.3fr_1fr_1fr] sm:grid-cols-2 bg-gradient-to-b from-[#b58ee4] to-[#caa8f3] text-white px-[14px] sm:px-3 py-3 sm:py-[11px] rounded-[14px] font-extrabold shadow-[0_12px_24px_rgba(130,94,197,0.25)] text-left sm:text-[13px] sm:gap-y-1">
              <span>Pembeli</span>
              <span>Paket Tour</span>
              <span className="text-right justify-self-end sm:col-span-2">
                Harga
              </span>
            </div>
            {(dashboardData.trips || []).map((t, index) => (
              <div
                key={`${t.buyer}-${index}`}
                className="grid grid-cols-[1.3fr_1fr_1fr] sm:grid-cols-2 items-start sm:items-center px-3 sm:px-[10px] py-3 bg-[#fffaf6] border border-[#f1e8ff] rounded-xl font-bold text-[#34343b] shadow-[0_10px_22px_rgba(0,0,0,0.06)] gap-2 sm:gap-[6px]"
              >
                <div className="flex items-center gap-[10px]">
                  <img
                    src={avatarDefault}
                    alt={t.buyer}
                    className="w-8 h-8 rounded-full object-cover bg-[#f5eefb] shadow-[inset_0_0_0_1px_#efe6fc]"
                  />
                  <span>{t.buyer}</span>
                </div>
                <span>{t.tour}</span>
                <span className="font-extrabold text-[#2f2f35] whitespace-normal overflow-anywhere text-right justify-self-end sm:col-span-2">
                  {formatCurrency(t.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
