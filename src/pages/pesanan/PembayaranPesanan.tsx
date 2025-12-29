import React, { useMemo, useState, useEffect } from 'react';
import {
  useLocation,
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom';
import RingkasanReservasi from '../../components/section/pembayaran/RingkasanReservasi';
import DetailPesanan from '../../components/section/pembayaran/DetailPesanan';
import PopupNotifikasi from '../../components/ui/popup-notifikasi/PopupNotifikasi';
import { fetchBookingDetail, type Booking } from '../../api/booking';
import { fetchPackage, type PackageDetail } from '../../api/packages';

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

export default function PembayaranPesanan() {
  const { id: bookingId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [packageDetail, setPackageDetail] = useState<PackageDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [bookingCode, setBookingCode] = useState('');
  const [popupVariant, setPopupVariant] = useState<
    'whatsapp' | 'whatsapp-success' | 'whatsapp-failed'
  >('whatsapp');
  const [popupTitle, setPopupTitle] = useState('');
  const [popupButtonText, setPopupButtonText] = useState('');

  // Fetch booking detail and package detail
  useEffect(() => {
    if (!bookingId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const bookingData = await fetchBookingDetail(bookingId);
        if (bookingData) {
          setBooking(bookingData);
          setBookingCode(bookingData.bookingCode || bookingData.id);

          // Fetch package detail
          if (bookingData.packageId) {
            const pkgData = await fetchPackage(bookingData.packageId);
            if (pkgData) {
              setPackageDetail(pkgData);
            }
          }
        }
      } catch (error) {
        console.error('Error loading booking data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookingId]);

  // Format tarif items
  const tarifItems: TarifItem[] = useMemo(() => {
    if (!packageDetail || !booking) return [];
    return [
      {
        nama: `${packageDetail.name} (Adult Single)`,
        harga: packageDetail.price || 14000000,
        qty: booking.totalParticipants || 1,
      },
    ];
  }, [packageDetail, booking]);

  // Biaya tambahan
  const biayaLainnya: BiayaLainnya[] = useMemo(
    () => [
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
    []
  );

  // Calculate totals
  const { subtotal, total } = useMemo(() => {
    const sub = tarifItems.reduce(
      (sum, item) => sum + item.harga * item.qty,
      0
    );
    const biayaTambahan = biayaLainnya.reduce(
      (sum, item) => sum + item.harga * item.qty,
      0
    );
    return { subtotal: sub, total: sub + biayaTambahan };
  }, [tarifItems, biayaLainnya]);

  // Format departure date
  const formattedDepartDate = useMemo(() => {
    if (!booking) return '';
    try {
      const d = new Date(booking.departureDate || booking.bookingDate);
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return booking.departureDate || booking.bookingDate;
    }
  }, [booking]);

  // Ringkasan Reservasi props
  const ringkasanProps = useMemo(() => {
    if (!booking || !packageDetail) return null;

    return {
      identitasPemesanan: {
        namaLengkap: booking.fullname || '',
        tanggalLahir: '-',
        kewarganegaraan: booking.nationality || 'Indonesia',
        nomorTelepon: booking.phoneNumber || '',
        alamatEmail: booking.email || '',
      },
      nomorIdentitas: {
        nomorPaspor: booking.passportNumber || '',
        negaraPenerbit: booking.nationality || 'Indonesia',
        tanggalHabisBerlaku: booking.passportExpiry || '',
      },
      detailPesanan: {
        tourName: packageDetail.name,
        tourId: `${packageDetail.id}`,
        tanggalKeberangkatan: formattedDepartDate,
        depart: packageDetail.location || 'Jakarta',
        durasi: `${packageDetail.duration || '6'} Hari / ${parseInt(packageDetail.duration || '6') - 1} Malam`,
        maskapai: packageDetail.maskapai || 'Garuda Indonesia',
        kamar: `${booking.totalParticipants} Orang (Dewasa)`,
      },
      tipeIdentitas: 'Peserta Dewasa, Single',
    };
  }, [booking, packageDetail, formattedDepartDate]);

  // Redirect if no booking ID or booking not found
  if (!bookingId) {
    return <Navigate to="/" replace />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-lg text-gray-600">Memuat data booking...</p>
      </div>
    );
  }

  // Not found state
  if (!booking || !packageDetail || !ringkasanProps) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Booking tidak ditemukan</p>
          <button
            onClick={() => navigate('/riwayat')}
            className="text-purple-600 hover:underline"
          >
            Kembali ke Riwayat
          </button>
        </div>
      </div>
    );
  }

  // Handle payment continuation
  const handleContinuePayment = async (agreed: boolean) => {
    if (!agreed) {
      alert('Silakan setujui kebijakan privasi terlebih dahulu');
      return;
    }

    setPaymentLoading(true);

    // Show WhatsApp payment popup
    setPopupVariant('whatsapp');
    setPopupTitle('Lanjutkan Pembayaran');
    setPopupMessage(
      `Kode Booking: ${bookingCode}\n\nTotal Pembayaran: Rp ${total.toLocaleString('id-ID')}\n\nSilakan lanjutkan pembayaran melalui WhatsApp.`
    );
    setPopupButtonText('Lanjutkan ke WhatsApp');
    setShowPopup(true);
    setPaymentLoading(false);
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
    <div className="min-h-screen bg-[#FFF8F0] mt-20 py-8 px-4 md:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Ringkasan Reservasi Component */}
        <RingkasanReservasi {...ringkasanProps} />

        {/* Detail Pesanan Component */}
        <DetailPesanan
          kamarCount={booking.totalParticipants}
          tarifItems={tarifItems}
          biayaLainnya={biayaLainnya}
          loading={paymentLoading}
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
