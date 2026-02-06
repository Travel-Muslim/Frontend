import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/button/Button';
import ItineraryTable from '../../components/section/detail-destinasi/ItenaryTableDestinasiSection';
import { fetchPackage, type PackageDetail } from '../../api/packages';

export default function AdminPackageDetailView() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPackage = async () => {
      if (!id) return;
      
      try {
        const data = await fetchPackage(id);
        setPkg(data);
      } catch (error) {
        console.error('Error loading package:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPackage();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/packages');
  };

  const handleEdit = () => {
    navigate(`/admin/packages/edit/${id}`);
  };

  if (loading) {
    return (
      <AdminLayout title="Detail Paket">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!pkg) {
    return (
      <AdminLayout title="Detail Paket">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Paket tidak ditemukan</div>
        </div>
      </AdminLayout>
    );
  }

  const itineraryData = pkg.itinerary?.map((day, idx) => ({
    day: idx + 1,
    destinasi: day.destinasi || [],
    makan: day.makan || [],
    masjid: day.masjid || [],
    transportasi: day.transportasi || [],
  })) || [];

  return (
    <AdminLayout title="Detail Paket">
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
            <h1 className="text-2xl font-bold text-gray-900">Detail Paket</h1>
          </div>
          <Button
            onClick={handleEdit}
            variant="light-teal-hover-dark-teal"
            className="px-6"
          >
            Edit Paket
          </Button>
        </div>

        {/* Package Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            {pkg.image && (
              <img 
                src={pkg.image} 
                alt={pkg.name} 
                className="w-full h-80 object-cover rounded-lg shadow-md" 
              />
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{pkg.name}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">ID:</span>
                <span className="text-gray-900">{pkg.id}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">Lokasi:</span>
                <span className="text-gray-900">{pkg.location}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">Benua:</span>
                <span className="text-gray-900">{pkg.benua || '-'}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">Maskapai:</span>
                <span className="text-gray-900">{pkg.maskapai || '-'}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">Bandara:</span>
                <span className="text-gray-900">{pkg.bandara || '-'}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">Periode:</span>
                <span className="text-gray-900">
                  {pkg.periode_start} - {pkg.periode_end}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">Harga:</span>
                <span className="text-gray-900 font-semibold text-lg">
                  {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')} / pax` : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary Table */}
        {itineraryData.length > 0 && (
          <div className="mt-8">
            <ItineraryTable
              title={pkg.name}
              startDate={pkg.periode_start}
              endDate={pkg.periode_end}
              itenaries={itineraryData}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
