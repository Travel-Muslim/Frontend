import React, { useMemo, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import type { BookingFormData } from "../components/BookingForm";
import "./PaymentSummary.css";
import mapPinIcon from "../assets/icon/map-pin.png";
import clockIcon from "../assets/icon/clock.png";
import planeIcon from "../assets/icon/plane.png";

const WHATSAPP_LINK = "https://wa.me/628113446846";

interface LocationState {
  formData?: BookingFormData;
  dest?: {
    title: string;
    location: string;
    duration: string;
    airline: string;
    price: number;
    period?: string[];
  };
}

const formatCurrency = (val: number) => val.toLocaleString("id-ID");

export default function PaymentSummary() {
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const form = state?.formData;
  const dest = state?.dest;

  const [agree, setAgree] = useState(false);

  const bookingCount = form?.bookingCount ?? 1;
  const basePrice = dest?.price ?? 14000000;
  const subtotal = basePrice * bookingCount;
  const otherFees = [
    { name: "Airport Tax", price: 5000000, qty: 1 },
    { name: "Visa", price: 2000000, qty: 1 },
  ];
  const otherTotal = otherFees.reduce((sum, fee) => sum + fee.price * fee.qty, 0);
  const grandTotal = subtotal + otherTotal;

  const formattedDepartDate = useMemo(() => {
    if (form?.departureDate) {
      try {
        const d = new Date(form.departureDate);
        return d.toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
      } catch {
        return form.departureDate;
      }
    }
    return dest?.period?.[0] ?? "-";
  }, [form?.departureDate, dest?.period]);

  if (!dest) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="pay-page">
      <header className="pay-header">
        <h1>Ringkasan Reservasi</h1>
        <p>Pastikan seluruh data telah sesuai untuk kelancaran proses keberangkatan.</p>
      </header>

      <section className="pay-card">
        <div className="pay-card-head">Ringkasan Reservasi Anda</div>

        <div className="pay-grid">
          <div className="pay-grid-row">
            <Field label="Nama Lengkap" value={form?.name || "-"} />
            <Field label="Tanggal Lahir" value={form?.birthDate || "-"} />
            <Field label="Kewarganegaraan" value={form?.passportCountry || "Indonesia"} />
          </div>

          <div className="pay-grid-row">
            <Field label="Nomor Telepon" value={form?.phone || "-"} />
            <Field label="Alamat Email" value={form?.email || "-"} />
            <Field label="" value="" />
          </div>

          <div className="pay-divider" />

          <div className="pay-grid-row">
            <Field label="Nomor Paspor" value={form?.passportNumber || "-"} />
            <Field label="Negara Penerbit" value={form?.passportCountry || "-"} />
            <Field label="Tanggal Habis Berlaku" value={form?.passportExpiry || "-"} />
          </div>

          <div className="pay-divider" />

          <div className="pay-grid-row">
            <Field label="Paket" value={dest.title} />
            <Field label="Tanggal Keberangkatan" value={formattedDepartDate} />
            <Field label="Kamar" value={`${bookingCount} Orang (Dewasa)`} />
          </div>

          <div className="pay-grid-row pay-meta-icons">
            <IconField icon={mapPinIcon} label="Depart" value={dest.location || "Jakarta"} />
            <IconField icon={clockIcon} label="Durasi" value={dest.duration || "-"} />
            <IconField icon={planeIcon} label="Maskapai" value={dest.airline || "-"} />
          </div>
        </div>
      </section>

      <section className="pay-card">
        <div className="pay-card-head">Detail Pesanan</div>

        <div className="pay-table">
          <div className="pay-table-head">
            <span>Rincian Harga</span>
            <span>*Harga dalam Rupiah</span>
          </div>

          <div className="pay-room-title">{bookingCount} Kamar</div>

          <TableRow left="Tarif" />
          <ChargeRow name="Dewasa (Adult Single)" price={basePrice} qty={bookingCount} />
          <SubtotalRow label="Subtotal" amount={subtotal} />

          <div className="pay-room-title">Biaya Lainnya</div>
          <TableRow left="Tarif" />
          {otherFees.map((fee) => (
            <ChargeRow key={fee.name} name={fee.name} price={fee.price} qty={fee.qty} />
          ))}

          <TotalRow amount={grandTotal} />
        </div>

        <p className="pay-note">*Harga total yang tertera adalah estimasi.</p>
        <p className="pay-note">Sisa biaya paling lambat dibayarkan 2 minggu sebelum tanggal keberangkatan.</p>

        <label className="pay-agree">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>Saya setuju dengan semua kebijakan privasi yang ada</span>
        </label>

        <div className="pay-actions">
          <button
            type="button"
            className="pay-primary"
            disabled={!agree}
            onClick={() => window.open(WHATSAPP_LINK, "_blank")}
          >
            Lanjutkan pembayaran
          </button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="pay-field">
      {label && <div className="pay-label">{label}</div>}
      <div className="pay-value">{value || "-"}</div>
    </div>
  );
}

function IconField({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="pay-icon-field">
      <img src={icon} alt="" />
      <div>
        <div className="pay-label">{label}</div>
        <div className="pay-value">{value}</div>
      </div>
    </div>
  );
}

function TableRow({ left }: { left: string }) {
  return (
    <div className="pay-table-row pay-table-header">
      <span>{left}</span>
      <span>Harga</span>
      <span>QTY</span>
      <span>Total</span>
    </div>
  );
}

function ChargeRow({ name, price, qty }: { name: string; price: number; qty: number }) {
  const total = price * qty;
  return (
    <div className="pay-table-row">
      <span className="pay-muted">{name}</span>
      <span className="pay-muted">{formatCurrency(price)}</span>
      <span className="pay-muted">{qty}</span>
      <span className="pay-muted">{formatCurrency(total)}</span>
    </div>
  );
}

function SubtotalRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="pay-table-row pay-subtotal">
      <span>{label}</span>
      <span />
      <span />
      <span>{formatCurrency(amount)}</span>
    </div>
  );
}

function TotalRow({ amount }: { amount: number }) {
  return (
    <div className="pay-table-row pay-total">
      <span>Total*</span>
      <span />
      <span />
      <span>{formatCurrency(amount)}</span>
    </div>
  );
}
