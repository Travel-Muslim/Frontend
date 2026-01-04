import React from 'react';
import Button from '../../ui/button/Button';
import { User } from 'lucide-react';

interface DetailTiketProps {
  namaLengkap: string;
  paketTour: string;
  nomorTelepon: string;
  tanggalHabisBerlaku: string;
  alamatEmail: string;
  statusPembayaran: string;
  tourId: string;
  berangkat: {
    tanggal: string;
    bulan: string;
    tahun: string;
  };
  pulang: {
    tanggal: string;
    bulan: string;
    tahun: string;
  };
  jumlahPenumpang: number;
  onDownload?: () => void;
  isDownloading?: boolean;
}

export default function DetailTiket({
  namaLengkap,
  paketTour,
  nomorTelepon,
  tanggalHabisBerlaku,
  alamatEmail,
  statusPembayaran,
  tourId,
  berangkat,
  pulang,
  jumlahPenumpang,
  onDownload,
  isDownloading = false,
}: DetailTiketProps) {
  const formatDate = (date: {
    tanggal: string;
    bulan: string;
    tahun: string;
  }) => {
    return `${date.tanggal} ${date.bulan} ${date.tahun}`;
  };

  return (
    <div className="min-h-screen bg-white p-4 mt-20 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Unduh Tiket
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Verifikasi ulang seluruh data pada e-tiket anda untuk memastikan
            tidak ada kendala saat check-in atau memasuki destinasi.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[15px] shadow-lg overflow-hidden border border-gray-100">
          {/* Purple Header */}
          <div className="bg-[#B49DE4] py-4 px-6">
            <h2 className="text-white text-xl font-semibold text-center">
              Detail Tiket
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Nama Lengkap
                  </p>
                  <p className="text-sm text-gray-500">{namaLengkap}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Nomor Telepon
                  </p>
                  <p className="text-sm text-gray-500">{nomorTelepon}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Alamat Email
                  </p>
                  <p className="text-sm text-gray-500">{alamatEmail}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Paket Tour
                  </p>
                  <p className="text-sm text-gray-500">{paketTour}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Tanggal Habis Berlaku
                  </p>
                  <p className="text-sm text-gray-500">{tanggalHabisBerlaku}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Status Pembayaran
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      statusPembayaran
                        .toLowerCase()
                        .includes('terkonfirmasi') ||
                      statusPembayaran.toLowerCase().includes('paid')
                        ? 'bg-green-100 text-green-700'
                        : statusPembayaran.toLowerCase().includes('menunggu')
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {statusPembayaran}
                  </span>
                </div>
              </div>
            </div>

            {/* Tour ID */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Tour ID
              </p>
              <p className="text-sm text-gray-500">{tourId}</p>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 my-6" />

            {/* Travel Details Box */}
            <div className="border border-gray-200 rounded-[10px] p-4 flex items-center justify-around gap-4 flex-wrap">
              {/* Berangkat */}
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Berangkat
                </p>
                <p className="text-sm text-gray-600">{formatDate(berangkat)}</p>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block w-px h-12 bg-gray-200"></div>

              {/* Pulang */}
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Pulang
                </p>
                <p className="text-sm text-gray-600">{formatDate(pulang)}</p>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block w-px h-12 bg-gray-200"></div>

              {/* Passenger Count */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  {jumlahPenumpang}
                </p>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-center pt-4">
              <Button
                variant="light-pink-hover-dark-pink"
                className="w-full sm:w-auto px-8 sm:px-12"
                onClick={onDownload}
                disabled={isDownloading || !onDownload}
              >
                {isDownloading ? (
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
                    Mengunduh...
                  </span>
                ) : (
                  'Unduh Tiket'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo Component
export function DetailTiketDemo() {
  const sampleData: DetailTiketProps = {
    namaLengkap: 'Sonya Nur Fadillah',
    paketTour: 'Tahun Baruan Di Uzbekistan',
    nomorTelepon: '+62-857-0895-9489',
    tanggalHabisBerlaku: '25-12-2030',
    alamatEmail: 'sonyanurf@gmail.com',
    statusPembayaran: 'Terkonfirmasi',
    tourId: 'HL13FRAQR05',
    berangkat: {
      tanggal: '10',
      bulan: 'Des',
      tahun: '2025',
    },
    pulang: {
      tanggal: '30',
      bulan: 'Des',
      tahun: '2025',
    },
    jumlahPenumpang: 1,
    onDownload: () => {
      console.log('Downloading ticket...');
      alert('Tiket akan diunduh!');
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <DetailTiket {...sampleData} />
    </div>
  );
}
