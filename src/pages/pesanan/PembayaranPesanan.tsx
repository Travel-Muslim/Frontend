import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import RingkasanReservasi from '../../components/section/pembayaran/RingkasanReservasi';
import DetailPesanan from '../../components/section/pembayaran/DetailPesanan';
import PopupNotifikasi from '../../components/ui/popup-notifikasi/PopupNotifikasi';
import { fetchBookingDetail, type Booking } from '../../api/booking';
import { fetchPackage, type PackageDetail } from '../../api/packages';

const WHATSAPP_LINK = 'https://wa.me/628113446846';
const ADDITIONAL_FEES = [
  { nama: 'Airport Tax', harga: 5000000, qty: 1 },
  { nama: 'Visa', harga: 2000000, qty: 1 },
] as const;

interface TarifItem {
  nama: string;
  harga: number;
  qty: number;
}

export default function PembayaranPesanan() {
  const { id: bookingId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [packageDetail, setPackageDetail] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [popup, setPopup] = useState<PopupState>({
    show: false,
    variant: 'whatsapp',
    title: '',
    message: '',
    buttonText: '',
  });

  const loadData = async () => {
    if (!bookingId) return;

    setLoading(true);
    try {
      const bookingData = await fetchBookingDetail(bookingId);
      if (!bookingData) return;

      setBooking(bookingData);

      if (bookingData.package_id) {
        const pkgData = await fetchPackage(bookingData.package_id);
        if (pkgData) setPackageDetail(pkgData);
      }
    } catch (error) {
      console.error('Error loading booking data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [bookingId]);

  const tarifItems = useMemo<TarifItem[]>(() => {
    if (!packageDetail || !booking) return [];
    return [
      {
        nama: `${packageDetail.name} (Adult Single)`,
        harga: packageDetail.price || 14000000,
        qty: booking.booking_total_participants || 1,
      },
    ];
  }, [packageDetail, booking]);

  const { subtotal, total } = useMemo(() => {
    const sub = tarifItems.reduce((sum, item) => sum + item.harga * item.qty, 0);
    const biayaTambahan = ADDITIONAL_FEES.reduce((sum, item) => sum + item.harga * item.qty, 0);
    return { subtotal: sub, total: sub + biayaTambahan };
  }, [tarifItems]);

  const formattedDepartDate = useMemo(() => {
    if (!booking?.booking_departure_date) return '';
    try {
      const d = new Date(booking.booking_departure_date);
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return booking.booking_departure_date || booking.booking_date;
    }
  }, [booking]);

  const bookingCode = booking?.booking_code || '';
  const ringkasanProps = useMemo(() => {
    if (!booking || !packageDetail) return null;

    const duration = parseInt(packageDetail.duration || '6');
    return {
      identitasPemesanan: {
        namaLengkap: booking.booking_fullname || '',
        tanggalLahir: '-',
        kewarganegaraan: booking.booking_nationality || 'Indonesia',
        nomorTelepon: booking.booking_phone_number || '',
        alamatEmail: booking.booking_email || '',
      },
      nomorIdentitas: {
        nomorPaspor: booking.booking_passport_number || '',
        negaraPenerbit: booking.booking_nationality || 'Indonesia',
        tanggalHabisBerlaku: booking.booking_passport_expiry || '',
      },
      detailPesanan: {
        tourName: packageDetail.name,
        tourId: `${packageDetail.id}`,
        tanggalKeberangkatan: formattedDepartDate || '-',
        depart: packageDetail.location || 'Jakarta',
        durasi: `${duration} Hari / ${duration - 1} Malam`,
        maskapai: packageDetail.maskapai || 'Garuda Indonesia',
        kamar: `${booking.booking_total_participants} Orang (Dewasa)`,
      },
      tipeIdentitas: 'Peserta Dewasa, Single',
    };
  }, [booking, packageDetail, formattedDepartDate]);

  const showPopup = (config: Partial<PopupState>) => {
    setPopup((prev) => ({ ...prev, ...config, show: true }));
  };

  const hidePopup = () => setPopup((prev) => ({ ...prev, show: false }));

  const handleContinuePayment = (agreed: boolean) => {
    if (!agreed) {
      alert('Silakan setujui kebijakan privasi terlebih dahulu');
      return;
    }

    setPaymentLoading(true);

    showPopup({
      variant: 'whatsapp',
      title: 'Lanjutkan Pembayaran',
      message: `Kode Booking: ${bookingCode}\n\nTotal Pembayaran: Rp ${total.toLocaleString('id-ID')}\n\nSilakan lanjutkan pembayaran melalui WhatsApp.`,
      buttonText: 'Lanjutkan ke WhatsApp',
    });

    setPaymentLoading(false);
  };

  const handleWhatsAppPayment = () => {
    const message = `Saya ingin melanjutkan pembayaran dengan kode booking: ${bookingCode}. Total pembayaran: Rp ${total.toLocaleString('id-ID')}`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
    hidePopup();
    navigate('/riwayat');
  };

  const handlePopupButtonClick = () => {
    switch (popup.variant) {
      case 'whatsapp':
        handleWhatsAppPayment();
        break;
      case 'whatsapp-success':
        hidePopup();
        navigate('/riwayat');
        break;
      case 'whatsapp-failed':
        handleWhatsAppPayment();
        break;
    }
  };

  if (!bookingId) return <Navigate to="/" replace />;

  if (loading) return <LoadingState message="Memuat data booking..." />;

  if (!booking || !packageDetail || !ringkasanProps) {
    return <NotFoundState navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] mt-20 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        <RingkasanReservasi {...ringkasanProps} />
        <DetailPesanan
          kamarCount={booking.booking_total_participants || 1}
          tarifItems={tarifItems}
          biayaLainnya={ADDITIONAL_FEES as any}
          loading={paymentLoading}
          onSubmit={handleContinuePayment}
        />
        <PopupNotifikasi
          variant={popup.variant}
          title={popup.title}
          description={popup.message}
          buttonText={popup.buttonText}
          isOpen={popup.show}
          onClose={hidePopup}
          onButtonClick={handlePopupButtonClick}
        />
      </div>
    </div>
  );
}

interface PopupState {
  show: boolean;
  variant: 'whatsapp' | 'whatsapp-success' | 'whatsapp-failed';
  title: string;
  message: string;
  buttonText: string;
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
}

function NotFoundState({ navigate }: { navigate: (path: string) => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <p className="mb-4 text-lg text-gray-600">Booking tidak ditemukan</p>
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
