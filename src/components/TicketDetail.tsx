import React from "react";
import Button from "./Button";
import "./TicketDetail.css";

interface TicketDetailProps {
  fullName: string;
  phoneNumber: string;
  email: string;
  tourId: string;
  tourPackage: string;
  expiryDate: string;
  paymentStatus: string;
  departureDate: string;
  returnDate: string;
  passengerCount: number;
  onDownloadClick?: () => void;
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="ticket-info-row">
      <span className="ticket-info-label">{label}</span>
      <span className="ticket-info-value">{value}</span>
    </div>
  );
}

function TravelDate({ label, date }: { label: string; date: string }) {
  return (
    <div className="ticket-travel-date">
      <span className="ticket-travel-label">{label}</span>
      <span className="ticket-travel-value">{date}</span>
    </div>
  );
}

function PassengerCount({ count }: { count: number }) {
  return (
    <div className="ticket-travel-passenger">
      <span className="ticket-passenger-icon" aria-hidden="true">
        <svg viewBox="0 0 35 35" role="presentation" focusable="false">
          <path
            d="M17.5 8.75c-2.0711 0-3.75 1.6789-3.75 3.75s1.6789 3.75 3.75 3.75 3.75-1.6789 3.75-3.75-1.6789-3.75-3.75-3.75zm-6.25 3.75c0-3.4518 2.7982-6.25 6.25-6.25s6.25 2.7982 6.25 6.25-2.7982 6.25-6.25 6.25-6.25-2.7982-6.25-6.25zm-2.5 11.25c0-4.2279 3.5221-7.75 7.75-7.75h2c4.2279 0 7.75 3.5221 7.75 7.75v1.25h-17.5z"
            fill="currentColor"
          />
        </svg>
      </span>
      <div>
        <span className="ticket-travel-label">Penumpang</span>
        <span className="ticket-travel-value">{count}</span>
      </div>
    </div>
  );
}

export default function TicketDetail({
  fullName,
  phoneNumber,
  email,
  tourId,
  tourPackage,
  expiryDate,
  paymentStatus,
  departureDate,
  returnDate,
  passengerCount,
  onDownloadClick,
}: TicketDetailProps) {
  return (
    <div className="ticket-card-shell">
      <div className="ticket-card-header">
        <p>Detail Tiket</p>
      </div>
      <div className="ticket-card-body">
        <div className="ticket-info-grid">
          <div className="ticket-info-column">
            <InfoItem label="Nama Lengkap" value={fullName} />
            <InfoItem label="Nomor Telepon" value={phoneNumber} />
            <InfoItem label="Alamat Email" value={email} />
            <InfoItem label="Tour ID" value={tourId} />
          </div>
          <div className="ticket-info-column">
            <InfoItem label="Paket Tour" value={tourPackage} />
            <InfoItem label="Tanggal Habis Berlaku" value={expiryDate} />
            <InfoItem label="Status Pembayaran" value={paymentStatus} />
          </div>
        </div>
        <div className="ticket-card-divider" />
        <div className="ticket-travel-info">
          <TravelDate label="Berangkat" date={departureDate} />
          <TravelDate label="Pulang" date={returnDate} />
          <PassengerCount count={passengerCount} />
        </div>
        <Button
          variant="pink-light"
          showArrows={false}
          onClick={onDownloadClick}
          className="ticket-download-button"
        >
          Unduh Tiket
        </Button>
      </div>
    </div>
  );
}
