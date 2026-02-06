import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, Minus } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Input from '../../components/ui/input/Input';
import Button from '../../components/ui/button/Button';
import ItineraryTable from '../../components/section/detail-destinasi/ItenaryTableDestinasiSection';
import { savePackage, type PackagePayload } from '../../api/packages';

interface PackageForm {
  name: string;
  location: string;
  continent: string;
  airline: string;
  airport: string;
  periode_start: string;
  periode_end: string;
  price: string;
  destination: string[];
  food: string[];
  mosque: string[];
  transport: string[];
}

export default function AdminPackageCreate() {
  const [form, setForm] = useState<PackageForm>({
    name: '',
    location: '',
    continent: '',
    airline: '',
    airport: '',
    periode_start: '',
    periode_end: '',
    price: '',
    destination: ['', '', ''],
    food: ['', '', ''],
    mosque: ['', '', ''],
    transport: ['', '', ''],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (key: keyof Pick<PackageForm, 'destination' | 'food' | 'mosque' | 'transport'>, idx: number, value: string) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === idx ? value : item)),
    }));
  };

  const addDay = (key: keyof Pick<PackageForm, 'destination' | 'food' | 'mosque' | 'transport'>) => {
    setForm(prev => ({
      ...prev,
      [key]: [...prev[key], ''],
    }));
  };

  const removeDay = (key: keyof Pick<PackageForm, 'destination' | 'food' | 'mosque' | 'transport'>) => {
    if (form[key].length > 1) {
      setForm(prev => ({
        ...prev,
        [key]: prev[key].slice(0, -1),
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleSave = async () => {
    setSubmitting(true);

    try {
      const payload: PackagePayload = {
        name: form.name,
        location: form.location,
        benua: form.continent,
        harga: Number(form.price),
        periode_start: form.periode_start,
        periode_end: form.periode_end,
        maskapai: form.airline,
        bandara: form.airport,
        itinerary: {
          destinasi: form.destination.filter(d => d.trim()),
          makan: form.food.filter(f => f.trim()),
          masjid: form.mosque.filter(m => m.trim()),
          transportasi: form.transport.filter(t => t.trim()),
        },
      };

      await savePackage(payload, undefined, imageFile || undefined);
      setSuccessModal(true);
    } catch (error) {
      console.error('Error saving package:', error);
      setErrorMessage('Terjadi kesalahan saat menyimpan paket');
      setErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/packages');
  };

  const handleSuccessClose = () => {
    setSuccessModal(false);
    navigate('/admin/packages');
  };

  const maxDays = Math.max(
    form.destination.length,
    form.food.length,
    form.mosque.length,
    form.transport.length
  );

  const itineraryData = Array.from({ length: maxDays }, (_, idx) => ({
    day: idx + 1,
    destinasi: form.destination[idx] ? [form.destination[idx]] : [],
    makan: form.food[idx] ? [form.food[idx]] : [],
    masjid: form.mosque[idx] ? [form.mosque[idx]] : [],
    transportasi: form.transport[idx] ? [form.transport[idx]] : [],
  }));

  return (
    <AdminLayout title="Tambahkan Paket">
      <div className="bg-white rounded-[18px] px-7 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] border border-[#f0f0f0] max-w-[1200px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Tambahkan Paket</h1>
        </div>

        {/* Form */}
        <form className="space-y-8">
          {/* Tambah Detail Paket */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tambah Detail Paket</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nama Paket*"
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama paket"
                required
              />
              <Input
                label="Lokasi*"
                type="text"
                name="location"
                value={form.location}
                onChange={handleInputChange}
                placeholder="Masukkan lokasi"
                required
              />
              <Input
                label="Benua*"
                type="text"
                name="continent"
                value={form.continent}
                onChange={handleInputChange}
                placeholder="Masukkan benua"
                required
              />
              <Input
                label="Maskapai*"
                type="text"
                name="airline"
                value={form.airline}
                onChange={handleInputChange}
                placeholder="Masukkan maskapai"
                required
              />
              <Input
                label="Bandara*"
                type="text"
                name="airport"
                value={form.airport}
                onChange={handleInputChange}
                placeholder="Masukkan bandara"
                required
              />
              <Input
                label="Periode Keberangkatan*"
                type="date"
                name="periode_start"
                variant="date"
                value={form.periode_start}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Periode Kepulangan*"
                type="date"
                name="periode_end"
                variant="date"
                value={form.periode_end}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Harga*"
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                placeholder="Masukkan harga"
                required
              />
            </div>
          </div>

          {/* Gambar Paket */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Gambar Paket</h2>
            <div className="border-2 border-dashed border-pink-200 rounded-lg p-8 text-center">
              {imageSrc ? (
                <div className="space-y-4">
                  <img src={imageSrc} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="light-pink-hover-dark-pink"
                    className="px-6"
                  >
                    Ganti Gambar
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-pink-400" />
                  </div>
                  <p className="text-gray-600">Upload gambar paket</p>
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="light-pink-hover-dark-pink"
                    className="px-6"
                  >
                    Pilih Gambar
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Tambah Destinasi Itenary */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Tambah Destinasi Itenary</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => removeDay('destination')}
                  className="w-8 h-8 rounded-full border-2 border-pink-300 flex items-center justify-center hover:bg-pink-50 transition-colors"
                >
                  <Minus className="w-4 h-4 text-pink-500" />
                </button>
                <button
                  type="button"
                  onClick={() => addDay('destination')}
                  className="w-8 h-8 rounded-full border-2 border-teal-300 flex items-center justify-center hover:bg-teal-50 transition-colors"
                >
                  <Plus className="w-4 h-4 text-teal-500" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {form.destination.map((dest, idx) => (
                <Input
                  key={idx}
                  label={`Hari ${idx + 1}*`}
                  type="text"
                  value={dest}
                  onChange={(e) => handleArrayChange('destination', idx, e.target.value)}
                  placeholder="Masukkan destinasi"
                />
              ))}
            </div>
          </div>

          {/* Tambah Tempat Makan Itenary */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Tambah Tempat Makan Itenary</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => removeDay('food')}
                  className="w-8 h-8 rounded-full border-2 border-pink-300 flex items-center justify-center hover:bg-pink-50 transition-colors"
                >
                  <Minus className="w-4 h-4 text-pink-500" />
                </button>
                <button
                  type="button"
                  onClick={() => addDay('food')}
                  className="w-8 h-8 rounded-full border-2 border-teal-300 flex items-center justify-center hover:bg-teal-50 transition-colors"
                >
                  <Plus className="w-4 h-4 text-teal-500" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {form.food.map((food, idx) => (
                <Input
                  key={idx}
                  label={`Hari ${idx + 1}*`}
                  type="text"
                  value={food}
                  onChange={(e) => handleArrayChange('food', idx, e.target.value)}
                  placeholder="Masukkan tempat makan"
                />
              ))}
            </div>
          </div>

          {/* Tambah Masjid Itenary */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Tambah Masjid Itenary</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => removeDay('mosque')}
                  className="w-8 h-8 rounded-full border-2 border-pink-300 flex items-center justify-center hover:bg-pink-50 transition-colors"
                >
                  <Minus className="w-4 h-4 text-pink-500" />
                </button>
                <button
                  type="button"
                  onClick={() => addDay('mosque')}
                  className="w-8 h-8 rounded-full border-2 border-teal-300 flex items-center justify-center hover:bg-teal-50 transition-colors"
                >
                  <Plus className="w-4 h-4 text-teal-500" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {form.mosque.map((mosque, idx) => (
                <Input
                  key={idx}
                  label={`Hari ${idx + 1}*`}
                  type="text"
                  value={mosque}
                  onChange={(e) => handleArrayChange('mosque', idx, e.target.value)}
                  placeholder="Masukkan masjid"
                />
              ))}
            </div>
          </div>

          {/* Tambah Transportasi Itenary */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Tambah Transportasi Itenary</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => removeDay('transport')}
                  className="w-8 h-8 rounded-full border-2 border-pink-300 flex items-center justify-center hover:bg-pink-50 transition-colors"
                >
                  <Minus className="w-4 h-4 text-pink-500" />
                </button>
                <button
                  type="button"
                  onClick={() => addDay('transport')}
                  className="w-8 h-8 rounded-full border-2 border-teal-300 flex items-center justify-center hover:bg-teal-50 transition-colors"
                >
                  <Plus className="w-4 h-4 text-teal-500" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {form.transport.map((transport, idx) => (
                <Input
                  key={idx}
                  label={`Hari ${idx + 1}*`}
                  type="text"
                  value={transport}
                  onChange={(e) => handleArrayChange('transport', idx, e.target.value)}
                  placeholder="Masukkan transportasi"
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              onClick={handlePreview}
              variant="white-hover-light-purple"
              className="px-8"
            >
              Preview
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={submitting}
              variant="light-teal-hover-dark-teal"
              className="px-8"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-[1400px] w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detail Preview</h2>

            {/* Package Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                {imageSrc && (
                  <img src={imageSrc} alt={form.name} className="w-full h-64 object-cover rounded-lg" />
                )}
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">{form.name || 'Nama Paket'}</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Lokasi:</strong> {form.location}</p>
                  <p><strong>Periode:</strong> {form.periode_start} - {form.periode_end}</p>
                  <p><strong>Maskapai:</strong> {form.airline}</p>
                  <p><strong>Bandara:</strong> {form.airport}</p>
                  <p><strong>Harga:</strong> Rp {Number(form.price).toLocaleString('id-ID')} / pax</p>
                </div>
              </div>
            </div>

            {/* Itinerary Table */}
            <ItineraryTable
              title={form.name}
              startDate={form.periode_start}
              endDate={form.periode_end}
              itenaries={itineraryData}
            />
          </div>
        </div>
      )}

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
              <p className="text-gray-600">Paket berhasil dibuat</p>
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
