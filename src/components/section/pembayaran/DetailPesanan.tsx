import React, { useState } from 'react';
import Button from '../../ui/button/Button';
import { formatHelper } from '@/helper/format';

interface TarifItem {
  nama: string;
  harga: number;
  qty: number;
}

interface BiayaLainnya {
  nama: string;
  harga: number;
  qty: number;
}

interface DetailPesananProps {
  kamarCount: number;
  tarifItems: TarifItem[];
  biayaLainnya: BiayaLainnya[];
  onSubmit?: (agreed: boolean) => void;
  loading?: boolean;
}

export default function DetailPesanan({
  kamarCount = 1,
  tarifItems,
  biayaLainnya,
  onSubmit,
  loading = false,
}: DetailPesananProps) {
  const [agreed, setAgreed] = useState(false);

  // Calculate subtotal for tarif
  const subtotal = tarifItems.reduce(
    (sum, item) => sum + item.harga * item.qty,
    0
  );

  // Calculate total (subtotal + biaya lainnya)
  const total =
    subtotal +
    biayaLainnya.reduce((sum, item) => sum + item.harga * item.qty, 0);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(agreed);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Detail Pesanan
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Semua biaya terkait pemesanan termasuk harga paket dan layanan
            tambahan dapat Anda lihat secara jelas di sini
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[15px] shadow-lg overflow-hidden border border-gray-100">
          {/* Purple Header */}
          <div className="bg-[#B49DE4] py-4 px-6">
            <h2 className="text-white text-xl font-semibold text-center">
              Detail Pesanan
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Rincian Harga Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-gray-800">
                  Rincian Harga
                </h3>
                <p className="text-sm text-gray-600">*Harga dalam Rupiah</p>
              </div>

              <p className="text-sm text-gray-700 mb-3">{kamarCount} Kamar</p>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                        Tarif
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                        Harga
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">
                        QTY
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tarifItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {item.nama}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600 text-right">
                          {formatHelper.rupiah(item.harga)}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600 text-center">
                          {item.qty}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600 text-right">
                          {formatHelper.rupiah(item.harga * item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <p className="text-base font-semibold text-gray-800">
                  Subtotal
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {formatHelper.rupiah(subtotal)}
                </p>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Biaya Lainnya Section */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Biaya Lainnya
              </h3>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                        Tarif
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                        Harga
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">
                        QTY
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {biayaLainnya.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {item.nama}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600 text-right">
                          {formatHelper.rupiah(item.harga)}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600 text-center">
                          {item.qty}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600 text-right">
                          {formatHelper.rupiah(item.harga * item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Button */}
              <div className="mt-6">
                <Button
                  variant="dark-pink-hover-super-dark-pink"
                  className="w-full! justify-between px-6"
                  disabled={true}
                >
                  <span>Total </span>
                  <span>{formatHelper.rupiah(total)}</span>
                </Button>
              </div>

              {/* Notes */}
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-500">
                  *Harga total yang tertera adalah estimasi.
                </p>
                <p className="text-xs text-gray-600">
                  Sisa biaya paling lambat dibayarkan 2 minggu sebelum tanggal
                  keberangkatan.
                </p>
              </div>

              {/* Checkbox */}
              <div className="mt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">
                    Saya setuju dengan semua kebijakan privasi yang ada
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-center">
                <Button
                  variant="light-pink-hover-dark-pink"
                  className="px-12"
                  disabled={!agreed || loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Memproses...' : 'Lanjutkan pembayaran'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo Component
export function DetailPesananDemo() {
  const sampleData: DetailPesananProps = {
    kamarCount: 1,
    tarifItems: [
      {
        nama: 'Dewasa (Adult Single)',
        harga: 14000000,
        qty: 1,
      },
    ],
    biayaLainnya: [
      {
        nama: 'Airport Tax',
        harga: 5000000,
        qty: 1,
      },
      {
        nama: 'Visa',
        harga: 2000000,
        qty: 1,
      },
    ],
    onSubmit: (agreed) => {
      console.log('Form submitted, agreed:', agreed);
      alert('Pembayaran akan diproses!');
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <DetailPesanan {...sampleData} />
    </div>
  );
}
