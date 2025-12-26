import React, { useState } from 'react';
import Input from '../../ui/input/Input';
import Button from '../../ui/button/Button';

interface FormPesananProps {
  onSubmit?: (formData: any) => void;
  loading?: boolean;
}

export default function FormPesanan({
  onSubmit,
  loading = false,
}: FormPesananProps) {
  const [formData, setFormData] = useState({
    nama: '',
    tanggalLahir: '',
    email: '',
    nomorTelepon: '',
    tanggalKeberangkatan: '',
    jumlahBooking: 0,
    noPaspor: '',
    tanggalKadaluarsa: '',
    negaraPaspor: '',
    uploadPaspor: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleIncrement = () => {
    setFormData((prev) => ({
      ...prev,
      jumlahBooking: prev.jumlahBooking + 1,
    }));
  };

  const handleDecrement = () => {
    setFormData((prev) => ({
      ...prev,
      jumlahBooking: Math.max(0, prev.jumlahBooking - 1),
    }));
  };

  const handleUpload = () => {
    // Trigger file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,.pdf';
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        setFormData((prev) => ({
          ...prev,
          uploadPaspor: target.files![0].name,
        }));
      }
    };
    fileInput.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!formData.tanggalLahir)
      newErrors.tanggalLahir = 'Tanggal lahir wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    if (!formData.nomorTelepon.trim())
      newErrors.nomorTelepon = 'Nomor telepon wajib diisi';
    if (!formData.tanggalKeberangkatan)
      newErrors.tanggalKeberangkatan = 'Tanggal keberangkatan wajib diisi';
    if (formData.jumlahBooking === 0)
      newErrors.jumlahBooking = 'Jumlah booking minimal 1';
    if (!formData.noPaspor.trim())
      newErrors.noPaspor = 'Nomor paspor wajib diisi';
    if (!formData.tanggalKadaluarsa)
      newErrors.tanggalKadaluarsa = 'Tanggal kadaluarsa wajib diisi';
    if (!formData.negaraPaspor.trim())
      newErrors.negaraPaspor = 'Negara paspor wajib diisi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // Pass all form data including tanggalKeberangkatan
    onSubmit?.(formData);
  };

  return (
    <div className="w-full bg-white p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Booking Sekarang
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Lengkapi proses booking Anda dengan melanjutkan ke tahap pembayaran.
            Pastikan data sudah sesuai sebelum melanjutkan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Purple Header */}
          <div className="bg-[#B49DE4] rounded-t-[15px] py-4 px-6">
            <h2 className="text-white text-lg sm:text-xl font-semibold text-center">
              Pengisian Form Booking
            </h2>
          </div>

          {/* Form Content */}
          <div className="bg-white border-2 border-[#FFC9D6] rounded-b-[15px] p-4 sm:p-6 md:p-8 space-y-6">
            {/* Row 1: Nama & Tanggal Lahir */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Nama*"
                  type="text"
                  placeholder="Masukkan nama anda"
                  value={formData.nama}
                  onChange={(e) => handleInputChange('nama', e.target.value)}
                  error={errors.nama}
                />
              </div>
              <div>
                <Input
                  label="Tanggal Lahir*"
                  variant="date"
                  placeholder="mm/dd/yyyy"
                  value={formData.tanggalLahir}
                  onChange={(e) =>
                    handleInputChange('tanggalLahir', e.target.value)
                  }
                  error={errors.tanggalLahir}
                />
              </div>
            </div>

            {/* Row 2: Email & Nomor Telepon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Email*"
                  type="email"
                  placeholder="Masukkan email anda"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                />
              </div>
              <div>
                <Input
                  label="Nomor Telepon*"
                  type="tel"
                  placeholder="Masukkan nomor telepon anda"
                  value={formData.nomorTelepon}
                  onChange={(e) =>
                    handleInputChange('nomorTelepon', e.target.value)
                  }
                  error={errors.nomorTelepon}
                />
              </div>
            </div>

            {/* Row 3: Tanggal Keberangkatan & Jumlah Booking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Tanggal Keberangkatan*"
                  variant="date"
                  placeholder="mm/dd/yyyy"
                  value={formData.tanggalKeberangkatan}
                  onChange={(e) =>
                    handleInputChange('tanggalKeberangkatan', e.target.value)
                  }
                  error={errors.tanggalKeberangkatan}
                />
              </div>
              <div>
                <Input
                  label="Jumlah Booking*"
                  variant="number-control"
                  placeholder="Kamar"
                  value={formData.jumlahBooking}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  error={errors.jumlahBooking}
                />
              </div>
            </div>

            {/* Informasi Identitas Section */}
            <div className="pt-4">
              <h3 className="text-base font-semibold text-gray-800 mb-1">
                Informasi Identitas
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                Pastikan masa berlaku paspor setidaknya 6 bulan dari tanggal
                keberangkatan
              </p>

              {/* Row 4: No Paspor & Tanggal Kadaluarsa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Input
                    label="No Paspor*"
                    type="text"
                    placeholder="Masukkan nomor paspor"
                    value={formData.noPaspor}
                    onChange={(e) =>
                      handleInputChange('noPaspor', e.target.value)
                    }
                    error={errors.noPaspor}
                  />
                </div>
                <div>
                  <Input
                    label="Tanggal Kadaluarsa*"
                    variant="date"
                    placeholder="mm/dd/yyyy"
                    value={formData.tanggalKadaluarsa}
                    onChange={(e) =>
                      handleInputChange('tanggalKadaluarsa', e.target.value)
                    }
                    error={errors.tanggalKadaluarsa}
                  />
                </div>
              </div>

              {/* Row 5: Negara Paspor & Upload Paspor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Negara Paspor*"
                    type="text"
                    placeholder="Masukkan negara paspor"
                    value={formData.negaraPaspor}
                    onChange={(e) =>
                      handleInputChange('negaraPaspor', e.target.value)
                    }
                    error={errors.negaraPaspor}
                  />
                </div>
                <div>
                  <Input
                    label="Upload Paspor*"
                    variant="upload"
                    uploadText="Upload paspor anda"
                    value={formData.uploadPaspor}
                    onUploadClick={handleUpload}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                variant="light-pink-hover-dark-pink"
                disabled={loading}
                className="px-8 py-3 text-base font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  'Booking Sekarang'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Demo Component
export function FormPesananDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <FormPesanan />
    </div>
  );
}
