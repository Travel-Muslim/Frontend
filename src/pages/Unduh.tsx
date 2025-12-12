import { useLocation } from "react-router-dom";
import { useState } from "react";
import SuccessModal from "../components/SuccessModal";
import "./Unduh.css";

interface UnduhLocationState {
  ticket?: {
    title?: string;
    tourId?: string;
    phone?: string;
    email?: string;
    departDate?: string;
    returnDate?: string;
    pax?: number;
    status?: string;
    paymentStatus?: string;
  };
}

const DEFAULT_TICKET = {
  title: "Korea Halal Tour",
  tourId: "HL13FRAQR05",
  phone: "+62-857-0895-9489",
  email: "sonyanurf@gmail.com",
  departDate: "10 Des 2025",
  returnDate: "30 Des 2025",
  pax: 1,
  status: "Terkonfirmasi",
  paymentStatus: "Sudah Dibayar",
};

const makeField = (label: string, value: string) => (
  <div className="unduh-field" key={label}>
    <span className="unduh-field-label">{label}</span>
    <span className="unduh-field-value">{value}</span>
  </div>
);

export default function UnduhTicketPage() {
  const location = useLocation();
  const ticket = (location.state as UnduhLocationState | null)?.ticket;
  const [successOpen, setSuccessOpen] = useState(false);

  const leftFields = [
    ["Nama Lengkap", ticket?.title ?? DEFAULT_TICKET.title],
    ["Nomor Telepon", ticket?.phone ?? DEFAULT_TICKET.phone],
    ["Alamat Email", ticket?.email ?? DEFAULT_TICKET.email],
    ["Tour ID", ticket?.tourId ?? DEFAULT_TICKET.tourId],
  ];

  const rightFields = [
    ["Paket Tour", ticket?.title ?? DEFAULT_TICKET.title],
    ["Tanggal Habis Berlaku", ticket?.returnDate ?? DEFAULT_TICKET.returnDate],
    ["Status Pembayaran", ticket?.status ?? DEFAULT_TICKET.paymentStatus],
  ];

  const datePills = [
    { label: "Berangkat", value: ticket?.departDate ?? DEFAULT_TICKET.departDate },
    { label: "Pulang", value: ticket?.returnDate ?? DEFAULT_TICKET.returnDate },
    { label: "Peserta", value: `${ticket?.pax ?? DEFAULT_TICKET.pax}` },
  ];

  return (
    <div className="unduh-page-root">
      <div className="unduh-hero">
        <div className="unduh-hero-inner">
          <h1>Unduh Tiket</h1>
          <p>
            Verifikasi ulang seluruh data pada e-tiket anda untuk memastikan tidak ada kendala saat check-in atau memasuki
            destinasi.
          </p>
        </div>
      </div>
      <div className="unduh-card">
        <div className="unduh-card-header">Detail Tiket</div>
        <div className="unduh-card-columns">
          <div className="unduh-column">
            {leftFields.map(([label, value]) => makeField(label, value))}
          </div>
          <div className="unduh-column">
            {rightFields.map(([label, value]) => makeField(label, value))}
          </div>
        </div>

        <div className="unduh-divider" />

        <div className="unduh-dates">
          {datePills.map((pill) => (
            <div className="unduh-date-pill" key={pill.label}>
              <span className="unduh-date-label">{pill.label}</span>
              <span className="unduh-date-value">{pill.value}</span>
            </div>
          ))}
        </div>

        <button type="button" className="unduh-download-btn" onClick={() => setSuccessOpen(true)}>
          Unduh Tiket
        </button>
      </div>
      <SuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Berhasil Mengunduh Tiket"
        message="Tiket perjalanan Anda berhasil diunduh"
        primaryText="Oke"
      />
    </div>
  );
}
