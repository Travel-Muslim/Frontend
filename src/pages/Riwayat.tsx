import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrders, type OrderRow } from "../api/orders";
import Button from "../components/Button";
import "./Riwayat.css";

interface BookingItem {
  id: string;
  image?: string;
  title: string;
  location?: string;
  duration?: string;
  airline?: string;
  airport?: string;
  date?: string;
  status?: string;
  month: string;
  price?: string;
}

type TabKey = "booking" | "history";
const MONTH_ALL = "Semua Bulan";

const formatMonthLabel = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  }
  const match = value.match(/(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/i);
  if (match) {
    const month = match[1];
    const yearMatch = value.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : String(new Date().getFullYear());
    return `${month.charAt(0).toUpperCase()}${month.slice(1).toLowerCase()} ${year}`;
  }
  return value;
};

const formatCurrency = (value?: string) => {
  if (!value) return "";
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return `Rp${num.toLocaleString("id-ID")}`;
};

const mapOrderToBooking = (order: OrderRow): BookingItem => ({
  id: String(order.id),
  image: "",
  title: order.packageName || order.name || "Paket Tour",
  location: order.packageName || order.name || "-",
  duration: order.time,
  airline: "",
  airport: "",
  date: order.date,
  status: order.status,
  month: formatMonthLabel(order.date),
  price: formatCurrency(order.payment),
});

function RiwayatTabs({ activeTab, onTabChange }: { activeTab: TabKey; onTabChange: (tab: TabKey) => void }) {
  return (
    <div className="riwayat-tabs-wrapper">
      <div className="riwayat-tabs-container">
        <div
          onClick={() => onTabChange("booking")}
          className={`riwayat-tab-item ${activeTab === "booking" ? "active" : ""}`}
        >
          <p className="riwayat-tab-text">Booking Saya</p>
        </div>
        <div
          onClick={() => onTabChange("history")}
          className={`riwayat-tab-item ${activeTab === "history" ? "active" : ""}`}
        >
          <p className="riwayat-tab-text">Daftar Riwayat Booking</p>
        </div>
      </div>
    </div>
  );
}

export default function Riwayat() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("booking");
  const [monthFilters, setMonthFilters] = useState<Record<TabKey, string>>({ booking: MONTH_ALL, history: MONTH_ALL });
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [orders, setOrders] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedMonth = monthFilters[activeTab];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMonthDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchOrders()
      .then((data) => {
        if (active) setOrders(data.map(mapOrderToBooking));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const monthOptions = useMemo(() => {
    const set = new Set<string>([MONTH_ALL]);
    orders.forEach((item) => {
      if (item.month) set.add(item.month);
    });
    return Array.from(set);
  }, [orders]);

  const bookingItems = useMemo(
    () => orders.filter((o) => (o.status ? o.status !== "Selesai" : true)),
    [orders]
  );
  const historyItems = useMemo(
    () => orders.filter((o) => o.status === "Selesai"),
    [orders]
  );

  const currentItems = activeTab === "booking" ? bookingItems : historyItems;

  const filteredItems = currentItems.filter((item) => selectedMonth === MONTH_ALL || item.month === selectedMonth);

  const handleMonthSelect = (month: string) => {
    setMonthFilters((prev) => ({ ...prev, [activeTab]: month }));
    setShowMonthDropdown(false);
  };

  const handleDetailClick = (id: string) => {
    const currentItem = currentItems.find((it) => it.id === id);
    navigate("/unduh", {
      state: {
        ticket: {
          title: currentItem?.title,
          tourId: currentItem?.id,
          departDate: currentItem?.date,
          returnDate: currentItem?.date,
          pax: 1,
          status: currentItem?.status,
          paymentStatus: currentItem?.price,
        },
      },
    });
  };

  const handleReviewClick = (id: string) => {
    const currentItem = currentItems.find((it) => it.id === id);
    navigate("/review", {
      state: {
        tourTitle: currentItem?.title,
        packageName: currentItem?.title,
        rating: 4.8,
        image: currentItem?.image,
        destId: Number(currentItem?.id) || Date.now(),
      },
    });
  };

  const renderedItems = filteredItems.map((item) => (
    <div key={item.id} className="riwayat-booking-card">
      <div className="riwayat-card-image-wrapper">
        {item.image ? (
          <img src={item.image} alt={item.title} className="riwayat-card-image" />
        ) : (
          <div className="riwayat-card-image-placeholder" />
        )}
      </div>

      <div className="riwayat-card-content">
        <div className="riwayat-card-title-row">
          <h3 className="riwayat-card-title">{item.title}</h3>
          {activeTab === "booking" && item.status && (
            <div className="riwayat-status-badge">
              <div className="riwayat-status-icon">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="15" r="14" fill="#90EE90" stroke="#90EE90" strokeWidth="2" />
                  <path d="M8 15L13 20L22 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="riwayat-status-text">{item.status}</span>
            </div>
          )}
        </div>

        <div className="riwayat-card-info-grid">
          <div className="riwayat-info-row">
            <div className="riwayat-info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" stroke="#444444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="3" stroke="#444444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="riwayat-info-content">
              <p className="riwayat-info-text">{item.location || "-"}</p>
            </div>

            <div className="riwayat-info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#444444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 6v6l4 2" stroke="#444444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="riwayat-info-content">
              <p className="riwayat-info-text">{item.duration || "-"}</p>
            </div>
          </div>

          <div className="riwayat-info-row">
            <div className="riwayat-info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#444444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="#444444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="riwayat-info-content">
              <p className="riwayat-info-text">{item.date || "-"}</p>
            </div>

            <div className="riwayat-info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#444444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.5 4.21l4.5 2.6 4.5-2.6M12 17V6.81" stroke="#444444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="riwayat-info-content">
              <p className="riwayat-info-text">{item.airline || "-"}</p>
            </div>
          </div>

          <div className="riwayat-info-row">
            <div className="riwayat-info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#444444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 22V12h6v10" stroke="#444444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="riwayat-info-content riwayat-info-content-wide">
              <p className="riwayat-info-text">{item.airport || "-"}</p>
            </div>
          </div>
        </div>

        <div className="riwayat-card-button-wrapper">
          {activeTab === "booking" ? (
            <Button
              variant="pink-light"
              showArrows={false}
              onClick={() => handleDetailClick(item.id)}
              className="riwayat-detail-button"
            >
              Lihat Detail Tiket
            </Button>
          ) : (
            <Button
              variant="teal-light"
              showArrows={false}
              onClick={() => handleReviewClick(item.id)}
              className="riwayat-review-button"
            >
              Tambahkan Ulasan
            </Button>
          )}
        </div>
      </div>
    </div>
  ));

  return (
    <div className="riwayat-page-wrapper">
      <div className="riwayat-page-container">
        <div className="riwayat-header-section">
          <div className="riwayat-title-wrapper">
            <h1 className="riwayat-page-title">Riwayat Booking</h1>
          </div>
          <div className="riwayat-subtitle-wrapper">
            <p className="riwayat-page-subtitle">
              {activeTab === "booking"
                ? "Lihat daftar pemesanan, lihat detail e-tiket perjalanan Anda di sini"
                : "Lihat riwayat pembelian Anda dan tambahkan review untuk setiap perjalanan yang sudah selesai"}
            </p>
          </div>
        </div>

        <RiwayatTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="riwayat-content-section">
          <div className="riwayat-content-card">
            <div className="riwayat-section-header">
              <h2 className="riwayat-section-title">
                {activeTab === "booking" ? "E-Tiket & Voucher Aktif" : "Riwayat Booking"}
              </h2>
            </div>

            <div className="riwayat-booking-header">
              <div className="riwayat-booking-title-wrapper">
                <p className="riwayat-booking-title">
                  {activeTab === "booking" ? "Booking Terbaru" : "Riwayat Terbaru"}
                </p>
              </div>
              <div className="riwayat-month-dropdown-wrapper" ref={dropdownRef}>
                <button
                  type="button"
                  className="riwayat-month-dropdown"
                  onClick={() => setShowMonthDropdown((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={showMonthDropdown}
                >
                  <span className="riwayat-month-text">{selectedMonth}</span>
                  <div className="riwayat-dropdown-icon">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                <div
                  className={`riwayat-month-menu ${showMonthDropdown ? "open" : ""}`}
                  role="listbox"
                  aria-label="Pilih Bulan"
                >
                  {monthOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`riwayat-month-menu-item ${selectedMonth === option ? "selected" : ""}`}
                      onClick={() => handleMonthSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="riwayat-cards-container">
              {loading ? (
                <p className="riwayat-no-results">Memuat data booking...</p>
              ) : filteredItems.length === 0 ? (
                <p className="riwayat-no-results">Belum ada perjalanan untuk filter ini.</p>
              ) : (
                renderedItems
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
