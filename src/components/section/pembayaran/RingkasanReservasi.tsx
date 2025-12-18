import React from 'react';
import { MapPin, Clock, Plane } from 'lucide-react';

interface IdentitasPemesanan {
  namaLengkap: string;
  tanggalLahir: string;
  kewarganegaraan: string;
  nomorTelepon: string;
  alamatEmail: string;
}

interface NomorIdentitas {
  nomorPaspor: string;
  negaraPenerbit: string;
  tanggalHabisBerlaku: string;
}

interface DetailPesanan {
  tourName: string;
  tourId: string;
  tanggalKeberangkatan: string;
  depart: string;
  durasi: string;
  maskapai: string;
  kamar: string;
}

interface RingkasanReservasiProps {
  identitasPemesanan: IdentitasPemesanan;
  nomorIdentitas: NomorIdentitas;
  detailPesanan: DetailPesanan;
  tipeIdentitas?: string;
}

export default function RingkasanReservasi({
  identitasPemesanan,
  nomorIdentitas,
  detailPesanan,
  tipeIdentitas = 'Peserta Dewasa, Single',
}: RingkasanReservasiProps) {
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Ringkasan Reservasi
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Pastikan seluruh data telah sesuai untuk kelancaran proses
            keberangkatan.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[15px] shadow-lg overflow-hidden border border-gray-100">
          {/* Purple Header */}
          <div className="bg-[#B49DE4] py-4 px-6">
            <h2 className="text-white text-xl font-semibold text-center">
              Ringkasan Reservasi Anda
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Identitas Pemesanan */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Identitas Pemesanan ({tipeIdentitas})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Nama Lengkap
                  </p>
                  <p className="text-sm text-gray-500">
                    {identitasPemesanan.namaLengkap}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Tanggal Lahir
                  </p>
                  <p className="text-sm text-gray-500">
                    {identitasPemesanan.tanggalLahir}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Kewarganegaraan
                  </p>
                  <p className="text-sm text-gray-500">
                    {identitasPemesanan.kewarganegaraan}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Nomor Telepon
                  </p>
                  <p className="text-sm text-gray-500">
                    {identitasPemesanan.nomorTelepon}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Alamat Email
                  </p>
                  <p className="text-sm text-gray-500">
                    {identitasPemesanan.alamatEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Nomor Identitas */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Nomor Identitas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Nomor Paspor
                  </p>
                  <p className="text-sm text-gray-500">
                    {nomorIdentitas.nomorPaspor}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Negara Penerbit
                  </p>
                  <p className="text-sm text-gray-500">
                    {nomorIdentitas.negaraPenerbit}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Tanggal Habis Berlaku
                </p>
                <p className="text-sm text-gray-500">
                  {nomorIdentitas.tanggalHabisBerlaku}
                </p>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Detail Pesanan */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Detail Pesanan
              </h3>
              <h4 className="text-base font-semibold text-gray-800 mb-3">
                {detailPesanan.tourName}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Tour ID
                  </p>
                  <p className="text-sm text-gray-500">
                    {detailPesanan.tourId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Tanggal Keberangkatan
                  </p>
                  <p className="text-sm text-gray-500">
                    {detailPesanan.tanggalKeberangkatan}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Depart
                  </p>
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      {detailPesanan.depart}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      {detailPesanan.durasi}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Plane className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      {detailPesanan.maskapai}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Kamar
                  </p>
                  <p className="text-sm text-gray-500">{detailPesanan.kamar}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo Component
export function RingkasanReservasiDemo() {
  const sampleData: RingkasanReservasiProps = {
    identitasPemesanan: {
      namaLengkap: 'Sonya Nur Fadillah',
      tanggalLahir: '27-12-2005',
      kewarganegaraan: 'Indonesia',
      nomorTelepon: '+62-857-0895-9489',
      alamatEmail: 'sonyanurf@gmail.com',
    },
    nomorIdentitas: {
      nomorPaspor: 'P123456/05',
      negaraPenerbit: 'Indonesia',
      tanggalHabisBerlaku: '13-08-2030',
    },
    detailPesanan: {
      tourName: 'Korea Halal Tour',
      tourId: 'HL13FRAQR05',
      tanggalKeberangkatan: 'Selasa, 10 Desember 2025',
      depart: 'Jakarta',
      durasi: '6 Hari / 5 Malam',
      maskapai: 'Garuda Indonesia',
      kamar: '1 Orang (Dewasa)',
    },
    tipeIdentitas: 'Peserta Dewasa, Single',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <RingkasanReservasi {...sampleData} />
    </div>
  );
}
