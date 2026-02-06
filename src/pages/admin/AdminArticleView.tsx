import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/button/Button';
import { fetchArticle, type Article } from '../../api/articles';

export default function AdminArticleView() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      try {
        const data = await fetchArticle(id);
        setArticle(data);
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/articles');
  };

  const handleEdit = () => {
    navigate(`/admin/articles/edit/${id}`);
  };

  const formatDate = (dateString?: string) => {
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

  if (loading) {
    return (
      <AdminLayout title="Detail Artikel">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!article) {
    return (
      <AdminLayout title="Detail Artikel">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Artikel tidak ditemukan</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Detail Artikel">
      <div className="bg-orange-50 rounded-[18px] px-4 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] max-w-[1200px] w-full mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6 px-3">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <Button
            onClick={handleEdit}
            variant="light-teal-hover-dark-teal"
            className="px-6"
          >
            Edit Artikel
          </Button>
        </div>

        {/* Article Content - Matching DetailArtikel Style */}
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col gap-3 mb-8">
            <span className="inline-block px-6 py-1.5 rounded-full bg-purple-200 text-purple-700 font-sans font-semibold text-xs tracking-wide uppercase mx-auto">
              Artikel
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-gray-900 text-center leading-tight px-4">
              {article.title}
            </h1>
            <div className="flex items-center justify-center gap-2 font-sans text-sm text-gray-600">
              <span>{formatDate(article.publishedAt || article.date)}</span>
            </div>
          </div>

          {/* Main Image */}
          {(article.coverImage || article.image) && (
            <div className="w-full rounded-lg overflow-hidden shadow-md mb-8">
              <img
                src={article.coverImage || article.image}
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Article Info Box */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Artikel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[100px]">ID:</span>
                  <span className="text-gray-900">{article.id}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[100px]">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    article.status === 'Selesai' 
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}>
                    {article.status || 'Draft'}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[100px]">Dibuat:</span>
                  <span className="text-gray-900 text-sm">{formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[100px]">Diperbarui:</span>
                  <span className="text-gray-900 text-sm">{formatDate(article.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections - Matching DetailArtikel Style */}
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
              dangerouslySetInnerHTML={{ __html: article.content || '<p class="text-gray-500 text-center">Tidak ada konten</p>' }}
            />
          </div>

          {/* Gallery */}
          {article.gallery && article.gallery.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Galeri</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {article.gallery.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt={`Gallery ${idx + 1}`} 
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
