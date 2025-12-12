import React, { useState } from "react";
import "./BookingForm.css";

export interface BookingFormData {
  name: string;
  birthDate: string;
  email: string;
  phone: string;
  departureDate: string;
  bookingCount: number;
  passportNumber: string;
  passportExpiry: string;
  passportCountry: string;
  passportFile: File | null;
}

interface BookingFormProps {
  onSubmit?: (data: BookingFormData) => void;
}

export default function BookingForm({ onSubmit }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    birthDate: "",
    email: "",
    phone: "",
    departureDate: "",
    bookingCount: 1,
    passportNumber: "",
    passportExpiry: "",
    passportCountry: "",
    passportFile: null,
  });

  const handleChange = (key: keyof BookingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleChange("passportFile", file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form className="bf-card" onSubmit={handleSubmit}>
      <div className="bf-card-border" aria-hidden />
      <div className="bf-header">Pengisian Form Booking</div>

      <div className="bf-grid">
        <label className="bf-field">
          <span>Nama*</span>
          <input
            type="text"
            placeholder="Masukkan nama anda"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </label>

        <label className="bf-field">
          <span>Tanggal Lahir*</span>
          <input
            type="date"
            placeholder="mm/dd/yyyy"
            value={formData.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
            required
          />
        </label>

        <label className="bf-field">
          <span>Email*</span>
          <input
            type="email"
            placeholder="Masukkan email anda"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </label>

        <label className="bf-field">
          <span>Nomor Telepon*</span>
          <input
            type="tel"
            placeholder="Masukkan nomor telepon anda"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
        </label>

        <label className="bf-field">
          <span>Tanggal Keberangkatan*</span>
          <input
            type="date"
            placeholder="mm/dd/yyyy"
            value={formData.departureDate}
            onChange={(e) => handleChange("departureDate", e.target.value)}
            required
          />
        </label>

        <label className="bf-field">
          <span>Jumlah Booking*</span>
          <div className="bf-counter">
            <button
              type="button"
              onClick={() => handleChange("bookingCount", Math.max(1, formData.bookingCount - 1))}
              aria-label="Kurangi jumlah booking"
            >
              -
            </button>
            <span>{formData.bookingCount}</span>
            <button
              type="button"
              onClick={() => handleChange("bookingCount", formData.bookingCount + 1)}
              aria-label="Tambah jumlah booking"
            >
              +
            </button>
          </div>
        </label>

        <div className="bf-note">
          <small>
            Informasi Identitas
            <br />
            Pastikan masa berlaku paspor setidaknya 6 bulan dari tanggal keberangkatan
          </small>
        </div>

        <label className="bf-field">
          <span>No Paspor*</span>
          <input
            type="text"
            placeholder="Masukkan nomor paspor"
            value={formData.passportNumber}
            onChange={(e) => handleChange("passportNumber", e.target.value)}
            required
          />
        </label>

        <label className="bf-field">
          <span>Tanggal Kadaluarsa*</span>
          <input
            type="date"
            placeholder="mm/dd/yyyy"
            value={formData.passportExpiry}
            onChange={(e) => handleChange("passportExpiry", e.target.value)}
            required
          />
        </label>

        <label className="bf-field">
          <span>Negara Paspor*</span>
          <input
            type="text"
            placeholder="Masukkan negara paspor"
            value={formData.passportCountry}
            onChange={(e) => handleChange("passportCountry", e.target.value)}
            required
          />
        </label>

        <label className="bf-field">
          <span>Upload Paspor*</span>
          <div className="bf-upload">
            <input type="file" onChange={handleFileChange} aria-label="Upload paspor" />
            <span className="bf-upload-label">
              {formData.passportFile?.name || "Upload paspor anda"}
            </span>
          </div>
        </label>
      </div>

      <div className="bf-submit">
        <button type="submit" className="bf-submit-btn">
          Booking Sekarang
        </button>
      </div>
    </form>
  );
}
