import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Input from '../../components/ui/input/Input';
import Button from '../../components/ui/button/Button';
import RichTextEditor from '../../components/ui/rich-editor/RichTextEditor';
import { fetchArticle, updateArticle, type ArticlePayload, type Article } from '../../api/articles';

export default function AdminArticleEdit() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    date: '',
    content: '',
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

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      try {
        const article = await fetchArticle(id);
        if (article) {
          setForm({
            title: article.title || '',
            date: article.publishedAt || article.date || '',
            content: article.content || '',
          });

          if (article.coverImage || article.image) {
            setImageSrc(article.coverImage || article.image || '');
          }
        }
      } catch (error) {
        console.error('Error loading article:', error);
        setErrorMessage('Gagal memuat data artikel');
        setErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
    if (!form.title || !form.date) {
      setErrorMessage('Judul dan Tanggal harus diisi');
      setErrorModal(true);
      return;
    }

    setSubmitting(true);

    try {
      const payload: ArticlePayload = {
        title: form.title,
        publishedAt: form.date,
        content: form.content,
        status: 'Selesai',
      };

      await updateArticle(id!, payload, imageFile || undefined);
      setSuccessModal(true);
    } catch (error) {
      console.error('Error saving article:', error);
      setErrorMessage('Terjadi kesalahan saat menyimpan artikel');
      setErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/articles');
  };

  const handleSuccessClose = () => {
    setSuccessModal(false);
    navigate('/admin/articles');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
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

  if (loading) {
    return (
      <AdminLayout title="Edit Artikel">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Artikel">
      <div className="bg-white rounded-[18px] px-7 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] border border-[#f0f0f0] max-w-[1200px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Artikel</h1>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Tambah Artikel Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Tambah Artikel</h2>
            <p className="text-sm text-gray-500 mb-4">
              Isi kolom di bawah ini secara lengkap untuk membuat draft artikel baru.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Judul Artikel*"
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="Masukkan judul artikel"
                required
              />
              <Input
                label="Tanggal*"
                type="date"
                name="date"
                variant="date"
                value={form.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex justify-end mt-4">
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
          </div>

          {/* Isi Artikel Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Isi Artikel</h2>
            <p className="text-sm text-gray-500 mb-4">
              Tulis konten artikel Anda di sini. Pastikan narasi mengalir dengan baik, informatif, dan relevan dengan konten yang Anda sajikan.
            </p>
            
            {/* Content Editor */}
            <div className="mb-4">
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm(prev => ({ ...prev, content: html }))}
                placeholder="Tulis konten artikel di sini..."
              />
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-pink-200 rounded-lg p-8 text-center mb-4">
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
                  <p className="text-gray-600">Upload gambar artikel</p>
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

            <div className="flex justify-end">
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
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-6">
            <Button
              type="button"
              onClick={handlePreview}
              variant="light-teal-hover-dark-teal"
              className="w-full"
            >
              Tampilkan Detail Preview
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={handleBack}
                variant="light-pink-hover-dark-pink"
              >
                Batalkan Artikel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={submitting}
                variant="light-teal-hover-dark-teal"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Artikel'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-orange-50 rounded-2xl max-w-[900px] w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors z-10 shadow-lg"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="h-16"></div>

            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
              {/* Header */}
              <div className="flex flex-col gap-3 mb-8">
                <span className="inline-block px-6 py-1.5 rounded-full bg-purple-200 text-purple-700 font-sans font-semibold text-xs tracking-wide uppercase mx-auto">
                  Artikel
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-gray-900 text-center leading-tight px-4">
                  {form.title || 'Judul Artikel'}
                </h1>
                <div className="flex items-center justify-center gap-2 font-sans text-sm text-gray-600">
                  <span>{formatDate(form.date)}</span>
                </div>
              </div>

              {/* Main Image */}
              {imageSrc && (
                <div className="w-full rounded-lg overflow-hidden shadow-md mb-8">
                  <img
                    src={imageSrc}
                    alt={form.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Content Sections */}
              <div className="rounded-lg p-6 sm:p-8 mb-8">
                <style>
                  {`
                    .article-content {
                      font-family: sans-serif;
                      color: #1f2937;
                      line-height: 1.75;
                    }
                    .article-content p {
                      margin-bottom: 1.25rem;
                      text-align: justify;
                      font-size: 1rem;
                    }
                    .article-content em {
                      color: #6b7280;
                      font-style: italic;
                      display: block;
                      margin-bottom: 1.5rem;
                    }
                    .article-content h2 {
                      font-size: 1.5rem;
                      font-weight: 700;
                      color: #111827;
                      margin-top: 2rem;
                      margin-bottom: 1rem;
                    }
                    .article-content h3 {
                      font-size: 1.25rem;
                      font-weight: 600;
                      color: #111827;
                      margin-top: 1.5rem;
                      margin-bottom: 0.75rem;
                    }
                    .article-content ul {
                      list-style-type: disc;
                      padding-left: 1.5rem;
                      margin-bottom: 1.25rem;
                    }
                    .article-content li {
                      margin-bottom: 0.5rem;
                      text-align: left;
                    }
                    .article-content ol {
                      list-style-type: decimal;
                      padding-left: 1.5rem;
                      margin-bottom: 1.25rem;
                    }
                    .article-content figure {
                      margin: 1.5rem 0;
                    }
                    .article-content figure img {
                      width: 100%;
                      height: auto;
                      border-radius: 0.5rem;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    }
                    .article-content strong {
                      font-weight: 600;
                      color: #111827;
                    }
                    .article-content a {
                      color: #9333ea;
                      text-decoration: underline;
                    }
                    .article-content a:hover {
                      color: #7e22ce;
                    }
                    .article-content img {
                      max-width: 100%;
                      height: auto;
                      border-radius: 0.5rem;
                      margin: 1.5rem 0;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    }
                  `}
                </style>
                <div 
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-gray-500 text-center">Konten artikel akan tampil di sini...</p>' }}
                />
              </div>
            </div>
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
              <p className="text-gray-600">Artikel berhasil diperbarui</p>
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
