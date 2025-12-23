import React, { useMemo, useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import RingkasanReservasi from '../../components/section/pembayaran/RingkasanReservasi';
import DetailPesanan from '../../components/section/pembayaran/DetailPesanan';
import PopupNotifikasi from '../../components/ui/popup-notifikasi/PopupNotifikasi';
import { createBooking, type CreateBookingPayload } from '../../api/booking';
import { fetchPackage } from '../../api/packages';
import type { PackageDetail } from '../../api/packages';

interface BookingFormData {
  nama: string;
  tanggalLahir: string;
  nomorTelepon: string;
  email: string;
  nomorPaspor: string;
  negaraPaspor: string;
  tanggalKadaluarsa: string;
  jumlahBooking: number;
  tanggalKeberangkatan: string;
  packageId: string;
}

interface LocationState {
  formData?: BookingFormData;
  destination?: PackageDetail;
}

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

export default function PembayaranPesananNew() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;

  const formData = state?.formData;
  const destination = state?.destination;

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [bookingCode, setBookingCode] = useState('');
  const [popupVariant, setPopupVariant] = useState<
    'whatsapp' | 'whatsapp-success' | 'whatsapp-failed'
  >('whatsapp');
  const [popupTitle, setPopupTitle] = useState('');
  const [popupButtonText, setPopupButtonText] = useState('');

  // Redirect if no form data
  if (!formData || !destination) {
    return <Navigate to="/" replace />;
  }

  // Format tarif items
  const tarifItems: TarifItem[] = [
    {
      nama: `${destination.name} (Adult Single)`,
      harga: destination.price || 14000000,
      qty: formData.jumlahBooking || 1,
    },
  ];

  // Biaya tambahan
  const biayaLainnya: BiayaLainnya[] = [
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
  ];

  // Calculate totals
  const subtotal = tarifItems.reduce(
    (sum, item) => sum + item.harga * item.qty,
    0
  );
  const biayaTambahan = biayaLainnya.reduce(
    (sum, item) => sum + item.harga * item.qty,
    0
  );
  const total = subtotal + biayaTambahan;

  // Format departure date
  const formattedDepartDate = useMemo(() => {
    try {
      const d = new Date(formData.tanggalKeberangkatan);
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return formData.tanggalKeberangkatan;
    }
  }, [formData.tanggalKeberangkatan]);

  // Ringkasan Reservasi props
  const ringkasanProps = {
    identitasPemesanan: {
      namaLengkap: formData.nama,
      tanggalLahir: formData.tanggalLahir,
      kewarganegaraan: formData.negaraPaspor,
      nomorTelepon: formData.nomorTelepon,
      alamatEmail: formData.email,
    },
    nomorIdentitas: {
      nomorPaspor: formData.nomorPaspor,
      negaraPenerbit: formData.negaraPaspor,
      tanggalHabisBerlaku: formData.tanggalKadaluarsa,
    },
    detailPesanan: {
      tourName: destination.name,
      tourId: `${destination.id}`,
      tanggalKeberangkatan: formattedDepartDate,
      depart: destination.location || 'Jakarta',
      durasi: `${destination.duration || '6'} Hari / ${parseInt(destination.duration || '6') - 1} Malam`,
      maskapai: destination.bandara || 'Garuda Indonesia',
      kamar: `${formData.jumlahBooking} Orang (Dewasa)`,
    },
    tipeIdentitas: 'Peserta Dewasa, Single',
  };

  // Handle booking submission
  const handleContinuePayment = async (agreed: boolean) => {
    if (!agreed) {
      alert('Silakan setujui kebijakan privasi terlebih dahulu');
      return;
    }

    setLoading(true);

    try {
      // Prepare booking payload
      const bookingPayload: CreateBookingPayload = {
        packageId: destination.id?.toString() || '',
        totalParticipants: formData.jumlahBooking,
        fullname: formData.nama,
        email: formData.email,
        phoneNumber: formData.nomorTelepon,
        whatsappContact: formData.nomorTelepon,
        passportNumber: formData.nomorPaspor,
        passportExpiry: formData.tanggalKadaluarsa,
        nationality: formData.negaraPaspor,
        notes: `Booking untuk ${formData.jumlahBooking} peserta`,
      };

      // Create booking via API
      const result = await createBooking(bookingPayload);

      if (result && result.id) {
        // Success
        setBookingCode(result.bookingCode || result.id);
        setPopupVariant('whatsapp');
        setPopupTitle('Pemesanan Berhasil');
        setPopupMessage(
          `Pemesanan Anda berhasil dibuat!\n\nKode Booking: ${result.bookingCode || result.id}\n\nSilakan lanjutkan pembayaran melalui WhatsApp.`
        );
        setPopupButtonText('Lanjutkan ke WhatsApp');
        setShowPopup(true);
      } else {
        // Error handling
        alert('Gagal membuat pemesanan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle popup close
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Handle WhatsApp payment
  const handleWhatsAppPayment = () => {
    const WHATSAPP_LINK = 'https://wa.me/628113446846';
    const message = `Saya ingin melanjutkan pembayaran dengan kode booking: ${bookingCode}. Total pembayaran: Rp ${total.toLocaleString('id-ID')}`;

    window.open(
      `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`,
      '_blank'
    );

    handleClosePopup();
    // Redirect to home or booking history
    navigate('/riwayat');
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setPopupVariant('whatsapp-success');
    setPopupTitle('Pembayaran Berhasil');
    setPopupMessage(
      `Pembayaran Anda melalui WhatsApp berhasil diproses.\n\nKode Booking: ${bookingCode}\n\nTerima kasih telah mempercayai layanan kami. Kami akan segera mengirimkan rincian perjalanan Anda.`
    );
    setPopupButtonText('Selesai');
    setShowPopup(true);
  };

  // Handle payment failed
  const handlePaymentFailed = () => {
    setPopupVariant('whatsapp-failed');
    setPopupTitle('Pembayaran Gagal');
    setPopupMessage(
      `Pembayaran melalui WhatsApp tidak berhasil diproses.\n\nSilakan coba lagi atau hubungi customer service kami untuk bantuan lebih lanjut.\n\nKode Booking: ${bookingCode}`
    );
    setPopupButtonText('Coba Lagi');
    setShowPopup(true);
  };

  // Handle popup button click based on variant
  const handlePopupButtonClick = () => {
    if (popupVariant === 'whatsapp') {
      handleWhatsAppPayment();
    } else if (popupVariant === 'whatsapp-success') {
      handleClosePopup();
      navigate('/riwayat');
    } else if (popupVariant === 'whatsapp-failed') {
      handleClosePopup();
      // Option to retry or go back
      handleWhatsAppPayment();
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 md:py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Pembayaran Pesanan
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Pastikan seluruh data telah sesuai untuk kelancaran proses
            keberangkatan.
          </p>
        </div>

        {/* Ringkasan Reservasi */}
        <div className="bg-white rounded-[15px] shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-[#B49DE4] py-4 px-6">
            <h2 className="text-white text-xl font-semibold text-center">
              Ringkasan Reservasi Anda
            </h2>
          </div>

          {/* Ringkasan Content */}
          <div className="p-6 space-y-6">
            {/* Identitas Pemesanan */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Identitas Pemesanan (Peserta Dewasa, Single)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Nama Lengkap
                  </p>
                  <p className="text-sm text-gray-500">{formData.nama}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Tanggal Lahir
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.tanggalLahir}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Kewarganegaraan
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.negaraPaspor}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Nomor Telepon
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.nomorTelepon}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Alamat Email
                  </p>
                  <p className="text-sm text-gray-500">{formData.email}</p>
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
                    {formData.nomorPaspor}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Negara Penerbit
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.negaraPaspor}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Tanggal Habis Berlaku
                </p>
                <p className="text-sm text-gray-500">
                  {formData.tanggalKadaluarsa}
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
                {destination.name}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Tour ID
                  </p>
                  <p className="text-sm text-gray-500">{destination.id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Tanggal Keberangkatan
                  </p>
                  <p className="text-sm text-gray-500">{formattedDepartDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Depart
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-gray-600">
                        📍 {destination.location || 'Jakarta'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-gray-600">
                        ⏱️ {destination.duration || '6'} Hari /{' '}
                        {parseInt(destination.duration || '6') - 1} Malam
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-gray-600">
                        ✈️ {destination.bandara || 'Garuda Indonesia'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Kamar
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.jumlahBooking} Orang (Dewasa)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Pesanan Component */}
        <DetailPesanan
          kamarCount={formData.jumlahBooking}
          tarifItems={tarifItems}
          biayaLainnya={biayaLainnya}
          loading={loading}
          onSubmit={handleContinuePayment}
        />

        {/* Popup Notifikasi */}
        <PopupNotifikasi
          variant={popupVariant}
          title={popupTitle}
          description={popupMessage}
          buttonText={popupButtonText}
          isOpen={showPopup}
          onClose={handleClosePopup}
          onButtonClick={handlePopupButtonClick}
        />
      </div>
    </div>
  );
}
