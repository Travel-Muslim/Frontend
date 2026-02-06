import React, { useEffect, useMemo, useState } from 'react';
import type { CommunityPost } from '../../api/community';
import { fetchCommunityPostsAdmin, deleteCommunityPost } from '../../api/community';
import AdminLayout from '../../components/admin/AdminLayout';
import { Trash2 } from 'lucide-react';

function IconChevronDown() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"
        fill="#fbbf24"
        stroke="#f59e0b"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export default function AdminCommunity() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const monthMap: Record<string, string> = {
    'January': '1',
    'February': '2',
    'March': '3',
    'April': '4',
    'May': '5',
    'June': '6',
    'July': '7',
    'August': '8',
    'September': '9',
    'October': '10',
    'November': '11',
    'December': '12',
  };

  const reverseMonthMap: Record<string, string> = {
    '1': 'January',
    '2': 'February',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'August',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const loadPosts = (bulan?: string, tahun?: string) => {
    setLoading(true);
    fetchCommunityPostsAdmin({ bulan, tahun })
      .then((list) => {
        setPosts(list);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Initial load to get available months and years
  useEffect(() => {
    fetchCommunityPostsAdmin({})
      .then((list) => {
        // Extract unique months and years from posts
        const monthsSet = new Set<string>();
        const yearsSet = new Set<string>();
        
        list.forEach((post) => {
          if (post.createdAt) {
            const date = new Date(post.createdAt);
            const month = (date.getMonth() + 1).toString();
            const year = date.getFullYear().toString();
            monthsSet.add(month);
            yearsSet.add(year);
          }
        });
        
        // Sort months in descending order (most recent first)
        const sortedMonths = Array.from(monthsSet)
          .sort((a, b) => parseInt(b) - parseInt(a))
          .map(m => reverseMonthMap[m]);
        
        // Sort years in descending order
        const sortedYears = Array.from(yearsSet)
          .sort((a, b) => parseInt(b) - parseInt(a));
        
        setAvailableMonths(sortedMonths);
        setAvailableYears(sortedYears);
        
        // Set first available month and year as default
        if (sortedMonths.length > 0) {
          setSelectedMonth(sortedMonths[0]);
        }
        if (sortedYears.length > 0) {
          setSelectedYear(sortedYears[0]);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const bulan = monthMap[selectedMonth];
      loadPosts(bulan, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  const handleDeleteClick = (id: string | number) => {
    setDeleteId(String(id));
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCommunityPost(deleteId);
      setDeleteModalOpen(false);
      setSuccessModalOpen(true);
      const bulan = monthMap[selectedMonth];
      loadPosts(bulan, selectedYear);
    } catch (error) {
      setDeleteModalOpen(false);
      setErrorMessage('Gagal menghapus post komunitas');
      setErrorModalOpen(true);
    }
  };

  const sortedPosts = useMemo(() => posts, [posts]);

  return (
    <AdminLayout title="Manajemen Komunitas">
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Forum Diskusi</h2>
            
            <div className="flex gap-3">
              {/* Month Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors duration-150 font-medium"
                  type="button"
                  onClick={() => setMonthOpen(!monthOpen)}
                  disabled={availableMonths.length === 0}
                >
                  {selectedMonth || 'Pilih Bulan'}
                  <span className={`transition-transform duration-200 ${monthOpen ? 'rotate-180' : ''}`}>
                    <IconChevronDown />
                  </span>
                </button>
                
                {monthOpen && availableMonths.length > 0 && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                    {availableMonths.map((month) => (
                      <button
                        key={month}
                        onClick={() => {
                          setSelectedMonth(month);
                          setMonthOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors duration-150 font-medium"
                  type="button"
                  onClick={() => setYearOpen(!yearOpen)}
                  disabled={availableYears.length === 0}
                >
                  {selectedYear || 'Pilih Tahun'}
                  <span className={`transition-transform duration-200 ${yearOpen ? 'rotate-180' : ''}`}>
                    <IconChevronDown />
                  </span>
                </button>
                
                {yearOpen && availableYears.length > 0 && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setYearOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  Memuat data...
                </div>
              ) : sortedPosts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada diskusi.
                </div>
              ) : (
                sortedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-150"
                  >
                    <div className="flex justify-between items-start gap-6">
                      {/* Left: Post content */}
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">
                          "{post.title}"
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                          {post.body}
                        </p>
                      </div>
                      
                      {/* Right: User info and actions */}
                      <div className="flex items-start gap-3 flex-shrink-0">
                        <div className="text-right min-w-[120px]">
                          <div className="flex items-center justify-end gap-2 mb-1">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              <img
                                src={post.avatar}
                                alt={post.author}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="font-medium text-gray-900 text-sm">
                              {post.author}
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-1 text-xs text-gray-600">
                            <StarIcon />
                            <span className="font-medium">{post.rating?.toFixed?.(1) ?? post.rating}</span>
                            <span className="ml-1">{post.createdAt ? formatDate(post.createdAt) : post.timeAgo}</span>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteClick(post.id)}
                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus post komunitas ini?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Berhasil!</h3>
            <p className="text-gray-600 mb-6">
              Post komunitas berhasil dihapus.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setSuccessModalOpen(false)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Error</h3>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setErrorModalOpen(false)}
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
