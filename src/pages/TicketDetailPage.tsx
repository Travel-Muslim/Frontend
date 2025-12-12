import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./TicketDetailPage.css";

const bookingFields = [
  { label: "Nama*", placeholder: "Masukkan nama anda" },
  { label: "Tanggal Lahir*", placeholder: "mm/dd/yyyy" },
  { label: "Email*", placeholder: "Masukkan email anda" },
  { label: "Nomor Telepon*", placeholder: "Masukkan nomor telepon anda" },
  { label: "Tanggal Keberangkatan*", placeholder: "mm/dd/yyyy" },
  { label: "Jumlah Booking*", placeholder: "Kamar" },
  { label: "No Paspor*", placeholder: "Masukkan nomor paspor" },
  { label: "Tanggal Kadaluarsa*", placeholder: "mm/dd/yyyy" },
  { label: "Negara Paspor*", placeholder: "Masukkan negara paspor" },
  { label: "Upload Paspor*", placeholder: "Upload paspor anda" },
];

interface TicketDetailState {
  ticket?: {
    title?: string;
    location?: string;
    duration?: string;
    airline?: string;
    airport?: string;
    date?: string;
    image?: string;
    price?: string;
  };
}

const DEFAULT_TICKET = {
  title: "Korea Halal Tour",
  location: "Korea Selatan",
  duration: "6 Hari 4 Malam",
  airline: "Garuda Indonesia",
  airport: "Soekarno-Hatta International Airport (CGK)",
  date: "10, 20, dan 30 Desember",
  image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
  price: "Rp 14.000.000 / pax",
};

export default function TicketDetailPage() {
  const [activeTab, setActiveTab] = useState<"itinerary" | "booking" | "testimony">("booking");
  const location = useLocation();
  const locationState = location.state as TicketDetailState | null;
  const ticketData = locationState?.ticket ?? DEFAULT_TICKET;
  const {
    title,
    location: ticketLocation,
    duration,
    airline,
    airport,
    date,
    image,
    price,
  } = ticketData;
  const selectedDate = date ?? DEFAULT_TICKET.date;

  return (
    <div className="booking-detail-page">
      <div className="booking-header">
        <div className="booking-card">
          <div className="booking-image-wrapper">
            <img
              src={image}
              alt="Korea Halal Tour"
            />
          </div>
          <div className="booking-info">
            <div>
              <p className="booking-tour-label">{title}</p>
              <p className="booking-location">{ticketLocation}</p>
            </div>
            <div className="booking-data-grid">
              <div>
                <p className="booking-data-label">Durasi</p>
                <p className="booking-data-value">{duration}</p>
              </div>
              <div>
                <p className="booking-data-label">Periode</p>
                <p className="booking-data-value">{selectedDate}</p>
              </div>
              <div>
                <p className="booking-data-label">Maskapai</p>
                <p className="booking-data-value">{airline}</p>
              </div>
              <div>
                <p className="booking-data-label">Bandara</p>
                <p className="booking-data-value">{airport}</p>
              </div>
            </div>
            <div className="booking-price-row">
              <div>
                <p className="booking-price-label">Harga</p>
                <p className="booking-price-value">{price}</p>
              </div>
              <div className="booking-cta-group">
                <button className="btn accent">Tambahkan Ke Wishlist</button>
                <button className="btn primary">Booking</button>
                <button className="btn ghost">Hubungi CS</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-tabs">
        <button
          className={`booking-tab ${activeTab === "itinerary" ? "active" : ""}`}
          onClick={() => setActiveTab("itinerary")}
        >
          Itenary
        </button>
        <button
          className={`booking-tab ${activeTab === "booking" ? "active" : ""}`}
          onClick={() => setActiveTab("booking")}
        >
          Booking
        </button>
        <button
          className={`booking-tab ${activeTab === "testimony" ? "active" : ""}`}
          onClick={() => setActiveTab("testimony")}
        >
          Testimoni
        </button>
      </div>

      <div className="booking-content">
        <div className="booking-section-heading">
          <div>
            <h1>Booking Sekarang</h1>
            <p>
              Lengkapi proses booking anda dengan melanjutkan ke tahap pembayaran. Pastikan data sudah sesuai
              sebelum melanjutkan.
            </p>
          </div>
          <div className="booking-form-note">
            <h2>Pengisian Form Booking</h2>
            <p>Informasi identitas: Pastikan paspor masih berlaku minimal 6 bulan dari tanggal keberangkatan.</p>
          </div>
        </div>

        <form className="booking-form">
          {bookingFields.map((field, index) => (
            <label className="booking-form-field" key={field.label}>
              <span>{field.label}</span>
              {index === bookingFields.length - 1 ? (
                <div className="booking-upload">
                  <input type="file" aria-label={field.label} placeholder={field.placeholder} />
                  <span className="booking-upload-icon">⇪</span>
                </div>
              ) : (
                <input type="text" placeholder={field.placeholder} />
              )}
            </label>
          ))}
          <button type="button" className="btn accent large">
            Booking Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}
