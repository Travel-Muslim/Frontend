import { useState } from 'react';
import Input from '../../ui/input/Input';
import Button from '../../ui/button/Button';
import { Star } from 'lucide-react';

interface KomentarKomunitasSectionProps {
  onSubmit: (data: CommentFormData) => void;
  loading?: boolean;
}

export interface CommentFormData {
  judul: string;
  tanggal: string;
  komentar: string;
  rating: number;
}

export default function KomentarKomunitasSection({
  onSubmit,
  loading = false,
}: KomentarKomunitasSectionProps) {
  const [formData, setFormData] = useState<CommentFormData>({
    judul: '',
    tanggal: '',
    komentar: '',
    rating: 0,
  });

  const [errors, setErrors] = useState<Partial<CommentFormData>>({});
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Partial<CommentFormData> = {};
    if (!formData.judul.trim()) newErrors.judul = 'Judul topik wajib diisi';
    if (!formData.tanggal) newErrors.tanggal = 'Tanggal wajib diisi';
    if (!formData.komentar.trim()) newErrors.komentar = 'Komentar wajib diisi';
    if (formData.rating === 0) newErrors.rating = 0;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);

    // Reset form
    setFormData({
      judul: '',
      tanggal: '',
      komentar: '',
      rating: 0,
    });
    setErrors({});
  };

  return (
    <section className="w-full bg-gradient-to-b from-white to-pink-50/20 py-8 md:py-10 lg:py-12">
      <div className="max-w-[900px] mx-auto px-4 sm:px-5 lg:px-6">
        {/* Wrapper Card */}
        <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 md:p-6">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-5">
              Tambahkan komentar anda
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-10">
              Bagikan pendapat, pengalaman, atau masukan anda, karena pendapat
              anda berarti!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tambahkan Judul Topik<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.judul}
                onChange={(e) =>
                  setFormData({ ...formData, judul: e.target.value })
                }
                placeholder="Masukkan judul topik"
                className="w-full rounded-[10px] border border-[#ffc9d6] py-3.5 px-4 text-sm outline-none bg-white box-border focus:border-[#ff8fb1] focus:shadow-[0_0_0_1px_rgba(255,143,177,0.3)] transition-all"
              />
              {errors.judul && (
                <p className="text-red-500 text-xs mt-1">{errors.judul}</p>
              )}
            </div>

            {/* Date and Rating Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal<span className="text-red-500">*</span>
                </label>
                <Input
                  variant="date"
                  value={formData.tanggal}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal: e.target.value })
                  }
                  error={errors.tanggal}
                />
              </div>

              {/* Rating Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating anda<span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
                    >
                      <Star
                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                          star <= (hoveredRating || formData.rating)
                            ? 'fill-yellow-400 stroke-yellow-400'
                            : 'fill-none stroke-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {formData.rating === 0 && errors.rating !== undefined && (
                  <p className="text-red-500 text-xs mt-1">
                    Rating wajib dipilih
                  </p>
                )}
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tambahkan Komentar<span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.komentar}
                onChange={(e) =>
                  setFormData({ ...formData, komentar: e.target.value })
                }
                placeholder="Masukkan komentar anda"
                rows={6}
                className="w-full rounded-[10px] border border-[#ffc9d6] py-3.5 px-4 text-sm outline-none bg-white box-border focus:border-[#ff8fb1] focus:shadow-[0_0_0_1px_rgba(255,143,177,0.3)] transition-all resize-none"
              />
              {errors.komentar && (
                <p className="text-red-500 text-xs mt-1">{errors.komentar}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-start pt-4">
              <Button
                type="submit"
                variant="light-teal-hover-super-dark-teal"
                disabled={loading}
                className="px-8 py-3 text-base font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Mengirim...
                  </span>
                ) : (
                  'Tambahkan Komentar'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
