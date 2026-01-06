import React, { useEffect, useMemo, useState } from 'react';
import type { OrderRow } from '../../api/orders';
import { fetchOrders } from '../../api/orders';
import AdminLayout from '../../components/admin/AdminLayout';

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle
        cx="11"
        cy="11"
        r="6"
        stroke="#a6a6a6"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="m15 15 4.5 4.5"
        stroke="#a6a6a6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StatusBadge({ status }: { status: OrderRow['status'] }) {
  return (
    <span className="inline-flex items-center gap-[6px] border border-[#c8f0da] bg-[#ecfdf4] text-[#2a9e64] rounded-[10px] px-3 py-2 font-extrabold text-sm">
      {status}
    </span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchOrders()
      .then((list) => {
        if (active) setOrders(list);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return orders;
    return orders.filter((o) =>
      [o.id, o.name, o.packageName].some((v) => v.toLowerCase().includes(term))
    );
  }, [orders, query]);

  return (
    <AdminLayout title="Manajemen Order">
      <section className="m-6 bg-white border border-[#f0e8ff] rounded-[20px] p-6 shadow-[0_18px_38px_rgba(15,23,42,0.12)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="m-0 text-[22px] text-[#1d1d1f] font-bold">
            Daftar Order
          </h2>
          <div className="inline-flex items-center gap-[10px] border border-[#e6e0ec] bg-white h-[42px] rounded-xl px-3 min-w-[280px] shadow-[inset_0_0_0_1px_#f1e9ff] w-full sm:w-auto">
            <span className="w-[18px] h-[18px] flex-shrink-0">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Cari Order"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none outline-none w-full text-sm bg-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <div className="min-w-[980px] flex flex-col gap-3">
            <div className="hidden lg:grid grid-cols-[1fr_1.4fr_1.4fr_1fr_0.8fr_1fr] bg-[#b28be2] text-white font-extrabold px-[14px] py-3 rounded-xl shadow-[0_12px_24px_rgba(130,94,197,0.2)]">
              <span>Tour ID</span>
              <span>Nama Lengkap</span>
              <span>Nama Paket</span>
              <span>Tanggal</span>
              <span>Status</span>
              <span>Pembayaran</span>
            </div>
            {loading ? (
              <div className="grid lg:grid-cols-[1fr_1.4fr_1.4fr_1fr_0.8fr_1fr] grid-cols-1 items-center bg-white border border-[#f0d7e1] rounded-xl px-[14px] py-3 shadow-[0_10px_18px_rgba(15,23,42,0.08)] gap-2 font-semibold">
                <span className="before:content-['Tour_ID:_'] before:font-bold before:text-[#5a5275] lg:before:content-none">
                  Memuat...
                </span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="grid lg:grid-cols-[1fr_1.4fr_1.4fr_1fr_0.8fr_1fr] grid-cols-1 items-center bg-white border border-[#f0d7e1] rounded-xl px-[14px] py-3 shadow-[0_10px_18px_rgba(15,23,42,0.08)] gap-2 font-semibold">
                <span className="before:content-['Tour_ID:_'] before:font-bold before:text-[#5a5275] lg:before:content-none">
                  Belum ada order
                </span>
              </div>
            ) : (
              filtered.map((order) => (
                <div
                  className="grid lg:grid-cols-[1fr_1.4fr_1.4fr_1fr_0.8fr_1fr] grid-cols-1 items-center bg-white border border-[#f0d7e1] rounded-xl px-[14px] py-3 shadow-[0_10px_18px_rgba(15,23,42,0.08)] gap-2 font-semibold"
                  key={order.id}
                >
                  <span className="before:content-['Tour_ID:_'] before:font-bold before:text-[#5a5275] lg:before:content-none truncate">
                    {order.id}
                  </span>
                  <span className="before:content-['Nama_Lengkap:_'] before:font-bold before:text-[#5a5275] lg:before:content-none">
                    {order.name}
                  </span>
                  <span className="before:content-['Nama_Paket:_'] before:font-bold before:text-[#5a5275] lg:before:content-none">
                    {order.packageName}
                  </span>
                  <span className="before:content-['Tanggal:_'] before:font-bold before:text-[#5a5275] lg:before:content-none truncate">
                    {order.date} {order.time}
                  </span>
                  <span className="before:content-['Status:_'] before:font-bold before:text-[#5a5275] lg:before:content-none">
                    <StatusBadge status={order.status} />
                  </span>
                  <span className="before:content-['Pembayaran:_'] before:font-bold before:text-[#5a5275] lg:before:content-none font-extrabold text-[#2f2f2f] truncate">
                    {order.payment}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
