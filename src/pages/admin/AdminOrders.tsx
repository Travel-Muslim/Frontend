import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchOrders, updateOrderStatus, updatePaymentStatus, type OrderStatus, type PaymentStatus } from '../../api/orders';
import type { OrderRow } from '../../api/orders';
import AdminTable, { TableColumn, TableAction } from '../../components/admin/AdminTable';

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
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
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}

// Payment Status badge component
function PaymentStatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
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
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const bookingStatusOptions: OrderStatus[] = ['pending', 'confirmed', 'paid', 'cancelled', 'completed'];
  const paymentStatusOptions: PaymentStatus[] = ['unpaid', 'paid', 'refunded'];

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchOrders()
      .then((list) => {
        if (active) setOrders(list);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        if (active) {
          setErrorMessage('Gagal memuat data order');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return orders;
    return orders.filter((o) =>
      [o.id, o.name, o.packageName].some((v) => v.toLowerCase().includes(term))
    );
  }, [orders, query]);

  const handleView = (order: OrderRow) => {
    navigate(`/admin/orders/view/${order.id}`);
  };

  const handleEdit = (order: OrderRow) => {
    navigate(`/admin/orders/edit/${order.id}`);
  };

  const handleChangeStatus = (order: OrderRow) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleChangePaymentStatus = (order: OrderRow) => {
    setSelectedOrder(order);
    setNewPaymentStatus(order.paymentStatus || 'unpaid');
    setShowPaymentModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      const success = await updateOrderStatus(selectedOrder.id, newStatus);
      
      if (success) {
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === selectedOrder.id ? { ...order, status: newStatus } : order
          )
        );
        
        setShowStatusModal(false);
        setSelectedOrder(null);
        setUpdateSuccess(true);
      } else {
        setShowStatusModal(false);
        setErrorMessage('Gagal mengubah status order');
        setUpdateError(true);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setShowStatusModal(false);
      setErrorMessage('Terjadi kesalahan saat mengubah status');
      setUpdateError(true);
    }
  };

  const confirmPaymentUpdate = async () => {
    if (!selectedOrder || !newPaymentStatus) return;

    try {
      const success = await updatePaymentStatus(selectedOrder.id, newPaymentStatus);
      
      if (success) {
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === selectedOrder.id ? { ...order, paymentStatus: newPaymentStatus } : order
          )
        );
        
        setShowPaymentModal(false);
        setSelectedOrder(null);
        setUpdateSuccess(true);
      } else {
        setShowPaymentModal(false);
        setErrorMessage('Gagal mengubah payment status');
        setUpdateError(true);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      setShowPaymentModal(false);
      setErrorMessage('Terjadi kesalahan saat mengubah payment status');
      setUpdateError(true);
    }
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // Format price
  const formatPrice = (price: string | undefined) => {
    if (!price) return 'Rp 0';
    
    // Remove any non-numeric characters except decimal point
    const cleanPrice = price.toString().replace(/[^\d.]/g, '');
    const numericPrice = parseFloat(cleanPrice);
    
    if (isNaN(numericPrice)) return 'Rp 0';
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numericPrice);
  };

  // Table configuration
  const columns: TableColumn[] = [
    {
      key: 'id',
      label: 'Booking ID',
      width: '150px',
    },
    {
      key: 'name',
      label: 'Nama Lengkap',
      width: '200px',
    },
    {
      key: 'packageName',
      label: 'Nama Paket',
      width: '350px',
    },
    {
      key: 'date',
      label: 'Tanggal',
      width: '150px',
      render: (value) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status Booking',
      width: '140px',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      width: '100px',
      render: (value) => <PaymentStatusBadge status={value || 'unpaid'} />,
    },
    {
      key: 'payment',
      label: 'Total',
      width: '150px',
      render: (value) => formatPrice(value),
    },
  ];

  const actions: TableAction[] = [
    {
      type: 'view',
      label: 'Lihat Detail',
      color: 'blue',
      onClick: handleView,
    },
    {
      type: 'edit',
      label: 'Edit Order',
      color: 'orange',
      onClick: handleEdit,
    },
    {
      type: 'custom',
      label: 'Ubah Status Booking',
      color: 'purple',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      onClick: handleChangeStatus,
    },
    {
      type: 'custom',
      label: 'Ubah Payment Status',
      color: 'green',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: handleChangePaymentStatus,
    },
  ];

  return (
    <AdminLayout title="Manajemen Order">
      <AdminTable
        title="Daftar Order"
        columns={columns}
        data={filtered}
        actions={actions}
        loading={loading}
        emptyMessage={query ? 'Tidak ada order yang cocok' : 'Belum ada data order'}
        searchValue={query}
        onSearch={setQuery}
        searchPlaceholder="Cari Order"
      />

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-[100] grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[420px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ubah Status Booking
              </h3>
              <p className="text-gray-600 mb-4">
                Booking ID: {selectedOrder.id}
              </p>
              
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Booking:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {bookingStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Update Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-[100] grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[420px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ubah Payment Status
              </h3>
              <p className="text-gray-600 mb-4">
                Booking ID: {selectedOrder.id}
              </p>
              
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status:
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {paymentStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmPaymentUpdate}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {updateSuccess && (
        <div className="fixed inset-0 bg-black/50 z-[100] grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[380px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Berhasil!</h3>
              <p className="text-gray-600">Status order berhasil diubah</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setUpdateSuccess(false)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {updateError && (
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
              <button
                onClick={() => setUpdateError(false)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}