import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/button/Button';
import { fetchOrder, type OrderDetail } from '../../api/orders';

// Status badge component
function StatusBadge({ status, type = 'booking' }: { status: string; type?: 'booking' | 'payment' }) {
  const getStatusColor = (status: string, type: string) => {
    if (type === 'payment') {
      switch (status.toLowerCase()) {
        case 'paid':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'unpaid':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'refunded':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'selesai':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'confirmed':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
      case 'diproses':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'dibatalkan':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status, type)}`}>
      {status}
    </span>
  );
}

export default function AdminOrderView() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      
      try {
        const data = await fetchOrder(id);
        setOrder(data);
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/orders');
  };

  const handleEdit = () => {
    navigate(`/admin/orders/edit/${id}`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price?: string) => {
    if (!price) return '-';
    const numericPrice = parseFloat(price.replace(/[^\d]/g, ''));
    if (isNaN(numericPrice)) return price;
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numericPrice);
  };

  if (loading) {
    return (
      <AdminLayout title="Detail Order">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Detail Order">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Order tidak ditemukan</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Detail Order">
      <div className="bg-white rounded-[18px] px-7 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] border border-[#f0f0f0] max-w-[1200px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Detail Order</h1>
          </div>
          <Button
            onClick={handleEdit}
            variant="light-teal-hover-dark-teal"
            className="px-6"
          >
            Edit Order
          </Button>
        </div>

        {/* Order Content */}
        <div className="space-y-6">
          {/* Booking Code & Status */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Booking Code</p>
              <h2 className="text-2xl font-bold text-gray-900">{order.bookingCode || order.id}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Booking Status</p>
                <StatusBadge status={order.status} type="booking" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                <StatusBadge status={order.paymentStatus || 'unpaid'} type="payment" />
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Customer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[140px]">Nama Lengkap:</span>
                  <span className="text-gray-900">{order.fullname || order.name || '-'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[140px]">Email:</span>
                  <span className="text-gray-900">{order.email || '-'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[140px]">No. Telepon:</span>
                  <span className="text-gray-900">{order.phoneNumber || '-'}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[140px]">No. Passport:</span>
                  <span className="text-gray-900">{order.passportNumber || '-'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[140px]">Kadaluarsa:</span>
                  <span className="text-gray-900">{formatDate(order.passportExpiry)}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[140px]">Kewarganegaraan:</span>
                  <span className="text-gray-900">{order.nationality || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Paket</h3>
            <div className="bg-gray-50 p-6 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-[180px]">Nama Paket:</span>
                <span className="text-gray-900 font-semibold">{order.packageName}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-[180px]">Lokasi:</span>
                <span className="text-gray-900">{order.packageLocation || '-'}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-[180px]">Benua:</span>
                <span className="text-gray-900">{order.packageBenua || '-'}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-[180px]">Maskapai:</span>
                <span className="text-gray-900">{order.packageMaskapai || '-'}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-[180px]">Bandara:</span>
                <span className="text-gray-900">{order.packageBandara || '-'}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Booking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[160px]">Tanggal Booking:</span>
                  <span className="text-gray-900">{formatDate(order.date)}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[160px]">Tanggal Keberangkatan:</span>
                  <span className="text-gray-900">{formatDate(order.departureDate)}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[160px]">Tanggal Kembali:</span>
                  <span className="text-gray-900">{formatDate(order.returnDate)}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[160px]">Jumlah Peserta:</span>
                  <span className="text-gray-900">{order.totalParticipants || 1} orang</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[160px]">Total Pembayaran:</span>
                  <span className="text-gray-900 font-bold text-lg text-teal-600">{formatPrice(order.payment)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {order.specialRequests && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Permintaan Khusus</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{order.specialRequests}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
