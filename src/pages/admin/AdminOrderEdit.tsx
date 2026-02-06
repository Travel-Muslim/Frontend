import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Input from '../../components/ui/input/Input';
import Button from '../../components/ui/button/Button';
import { fetchOrder, updateOrderStatus, updatePaymentStatus, type OrderDetail, type OrderStatus, type PaymentStatus } from '../../api/orders';

export default function AdminOrderEdit() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    bookingCode: '',
    fullname: '',
    email: '',
    phoneNumber: '',
    passportNumber: '',
    passportExpiry: '',
    nationality: '',
    packageName: '',
    departureDate: '',
    returnDate: '',
    totalParticipants: '',
    status: 'pending' as OrderStatus,
    paymentStatus: 'unpaid' as PaymentStatus,
    specialRequests: '',
  });
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const bookingStatusOptions: OrderStatus[] = ['pending', 'confirmed', 'paid', 'cancelled', 'completed'];
  const paymentStatusOptions: PaymentStatus[] = ['unpaid', 'paid', 'refunded'];

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      
      try {
        const order = await fetchOrder(id);
        if (order) {
          setForm({
            bookingCode: order.bookingCode || order.id,
            fullname: order.fullname || order.name || '',
            email: order.email || '',
            phoneNumber: order.phoneNumber || '',
            passportNumber: order.passportNumber || '',
            passportExpiry: order.passportExpiry || '',
            nationality: order.nationality || '',
            packageName: order.packageName || '',
            departureDate: order.departureDate || '',
            returnDate: order.returnDate || '',
            totalParticipants: String(order.totalParticipants || 1),
            status: order.status as OrderStatus,
            paymentStatus: (order.paymentStatus as PaymentStatus) || 'unpaid',
            specialRequests: order.specialRequests || '',
          });
        }
      } catch (error) {
        console.error('Error loading order:', error);
        setErrorMessage('Gagal memuat data order');
        setErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.fullname || !form.email) {
      setErrorMessage('Nama lengkap dan email harus diisi');
      setErrorModal(true);
      return;
    }

    setSubmitting(true);

    try {
      // Update booking status
      await updateOrderStatus(id!, form.status);
      
      // Update payment status
      await updatePaymentStatus(id!, form.paymentStatus);

      setSuccessModal(true);
    } catch (error) {
      console.error('Error saving order:', error);
      setErrorMessage('Terjadi kesalahan saat menyimpan order');
      setErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/orders');
  };

  const handleSuccessClose = () => {
    setSuccessModal(false);
    navigate('/admin/orders');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Order">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Order">
      <div className="bg-white rounded-[18px] px-7 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] border border-[#f0f0f0] max-w-[1200px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Order</h1>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Booking Code (Read-only) */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Code</h2>
            <Input
              label="Booking Code"
              type="text"
              name="bookingCode"
              value={form.bookingCode}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Status Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Status Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Status *
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="w-full rounded-[10px] border border-[#ffc9d6] py-3.5 px-4 text-sm outline-none bg-white box-border focus:border-[#ff8fb1] focus:shadow-[0_0_0_1px_rgba(255,143,177,0.3)] transition-all"
                >
                  {bookingStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status *
                </label>
                <select
                  name="paymentStatus"
                  value={form.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full rounded-[10px] border border-[#ffc9d6] py-3.5 px-4 text-sm outline-none bg-white box-border focus:border-[#ff8fb1] focus:shadow-[0_0_0_1px_rgba(255,143,177,0.3)] transition-all"
                >
                  {paymentStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Customer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nama Lengkap*"
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap"
                required
              />
              <Input
                label="Email*"
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="Masukkan email"
                required
              />
              <Input
                label="No. Telepon"
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleInputChange}
                placeholder="Masukkan no. telepon"
              />
              <Input
                label="No. Passport"
                type="text"
                name="passportNumber"
                value={form.passportNumber}
                onChange={handleInputChange}
                placeholder="Masukkan no. passport"
              />
              <Input
                label="Tanggal Kadaluarsa Passport"
                type="date"
                name="passportExpiry"
                variant="date"
                value={form.passportExpiry}
                onChange={handleInputChange}
              />
              <Input
                label="Kewarganegaraan"
                type="text"
                name="nationality"
                value={form.nationality}
                onChange={handleInputChange}
                placeholder="Masukkan kewarganegaraan"
              />
            </div>
          </div>

          {/* Package Information (Read-only) */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Paket</h2>
            <Input
              label="Nama Paket"
              type="text"
              name="packageName"
              value={form.packageName}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Booking Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Detail Booking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Tanggal Keberangkatan"
                type="date"
                name="departureDate"
                variant="date"
                value={form.departureDate}
                onChange={handleInputChange}
              />
              <Input
                label="Tanggal Kembali"
                type="date"
                name="returnDate"
                variant="date"
                value={form.returnDate}
                onChange={handleInputChange}
              />
              <Input
                label="Jumlah Peserta"
                type="number"
                name="totalParticipants"
                value={form.totalParticipants}
                onChange={handleInputChange}
                placeholder="Masukkan jumlah peserta"
                min="1"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Permintaan Khusus</h2>
            <textarea
              name="specialRequests"
              value={form.specialRequests}
              onChange={handleInputChange}
              placeholder="Masukkan permintaan khusus jika ada..."
              rows={5}
              className="w-full rounded-[10px] border border-[#ffc9d6] py-3.5 px-4 text-sm outline-none bg-white box-border focus:border-[#ff8fb1] focus:shadow-[0_0_0_1px_rgba(255,143,177,0.3)] transition-all resize-vertical"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-6">
            <Button
              type="button"
              onClick={handleBack}
              variant="light-pink-hover-dark-pink"
            >
              Batalkan
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={submitting}
              variant="light-teal-hover-dark-teal"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[380px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Berhasil!</h3>
              <p className="text-gray-600">Order berhasil diperbarui</p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleSuccessClose}
                variant="light-teal-hover-dark-teal"
                className="px-6"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[380px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error!</h3>
              <p className="text-gray-600">{errorMessage}</p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => setErrorModal(false)}
                variant="light-pink-hover-dark-pink"
                className="px-6"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
