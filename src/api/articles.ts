import api from './axios';
import { apiRoutes } from './routes';

export type ArticleStatus = 'Selesai' | 'Draft' | string;

export interface ArticleBlock {
  type: 'text' | 'image' | 'link' | string;
  value: string;
  label?: string;
}

export interface Article {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  categoryId?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  tags?: any[];
  authorId?: string;
  views?: number;
  readTime?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  judul?: string;
  tanggal?: string;
  tanggalTerbit?: string;
  imageUrl?: string;
  preview?: string;
  sections?: any[];
  displayDate?: string;
  date?: string;
  time?: string;
  status?: ArticleStatus;
  image?: string;
  gallery?: string[];
  link?: string;
  blocks?: ArticleBlock[];
  author?: string;
  tag?: string;
}

export type ArticlePayload = Partial<Omit<Article, 'id'>>;

const toArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') return [value as unknown as T];
  return [];
};

const formatDisplayDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const normalizeArticle = (raw: any): Article => {
  const gallery = toArray<string>(raw?.gallery || raw?.images);
  const blocks = toArray<ArticleBlock>(raw?.blocks).map((b) => ({
    type: b.type,
    value: b.value,
    label: b.label,
  }));
  const tags = toArray<any>(raw?.tags);
  const sections = toArray<any>(raw?.sections);

  // Prioritize date fields from API response
  const date =
    raw?.date ??
    raw?.tanggal ??
    raw?.published_at ??
    raw?.createdAt ??
    raw?.created_at ??
    '';
  const publishedAt =
    raw?.publishedAt ?? raw?.published_at ?? raw?.tanggalTerbit;

  const id =
    raw?.id ??
    raw?._id ??
    (globalThis.crypto && 'randomUUID' in globalThis.crypto
      ? globalThis.crypto.randomUUID()
      : `article-${Date.now()}`);

  // Get image from multiple possible sources
  const imageUrl =
    raw?.image ??
    raw?.imageUrl ??
    raw?.cover_image_url ??
    raw?.thumbnail ??
    raw?.cover ??
    gallery[0] ??
    '';

  // Get excerpt from multiple sources with fallback
  const excerptText =
    raw?.excerpt ??
    raw?.preview ??
    raw?.description ??
    raw?.content?.slice(0, 160) ??
    '';

  return {
    id,
    title: raw?.title ?? raw?.judul ?? raw?.name ?? 'Artikel Tanpa Judul',
    slug: raw?.slug,
    category: raw?.category,
    categoryId: raw?.category_id,
    content: raw?.content ?? raw?.body ?? '',
    excerpt: excerptText,
    coverImage: imageUrl,
    tags,
    authorId: raw?.author_id ?? raw?.authorId,
    views: raw?.views ? Number(raw.views) : 0,
    readTime: raw?.read_time ?? raw?.readTime,
    isPublished: raw?.is_published ?? raw?.status === 'Selesai',
    createdAt: raw?.created_at ?? raw?.createdAt,
    updatedAt: raw?.updated_at ?? raw?.updatedAt,
    publishedAt,

    // API response fields
    judul: raw?.judul ?? raw?.title,
    tanggal: raw?.tanggal ?? formatDisplayDate(date),
    tanggalTerbit: raw?.tanggalTerbit ?? formatDisplayDate(publishedAt),
    imageUrl,
    preview: excerptText,
    sections,

    // Legacy fields for backward compatibility
    displayDate: raw?.displayDate ?? raw?.tanggal ?? formatDisplayDate(date),
    date,
    time: raw?.time ?? raw?.published_time ?? '',
    status: raw?.status ?? raw?.state ?? 'Draft',
    image: imageUrl,
    gallery,
    link: raw?.link ?? raw?.url ?? '',
    blocks: blocks.length ? blocks : undefined,
    author: raw?.author ?? raw?.created_by ?? raw?.authorName ?? '',
    tag: raw?.tag ?? raw?.label ?? '',
  };
};

const unwrapData = <T>(payload: any): T => {
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
};

// Menangani respons paginasi dari backend
const handlePaginatedResponse = <T>(response: any): T[] => {
  const data = unwrapData<any>(response);
  if (data.results && Array.isArray(data.results)) {
    return data.results;
  } else if (data.data && Array.isArray(data.data)) {
    return data.data;
  } else if (Array.isArray(data)) {
    return data;
  }
  return [];
};

export async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await api.get(apiRoutes.articles);
    const articles = handlePaginatedResponse<Article>(res.data);
    return Array.isArray(articles) ? articles.map(normalizeArticle) : [];
  } catch (error) {
    console.error('Gagal memuat artikel', error);
    return [];
  }
}

export async function fetchArticle(
  id: string | number
): Promise<Article | null> {
  try {
    const res = await api.get(apiRoutes.article(id));
    const payload = unwrapData<any>(res.data);

    // Handle different response structures from backend
    if (payload?.results) {
      return normalizeArticle(payload.results);
    } else if (payload?.data) {
      return normalizeArticle(payload.data);
    } else {
      return payload ? normalizeArticle(payload) : null;
    }
  } catch (error) {
    console.error('Gagal memuat artikel', error);
    return null;
  }
}

export async function createArticle(
  payload: ArticlePayload,
  coverImageFile?: File
): Promise<Article | null> {
  try {
    let res;

    if (coverImageFile) {
      // Jika ada file gambar, gunakan multipart/form-data
      const formData = new FormData();

      // Tambahkan field yang dibutuhkan backend
      if (payload.title) formData.append('judul', payload.title);
      if (payload.content) formData.append('content', payload.content);
      if (payload.publishedAt) formData.append('tanggal', payload.publishedAt);

      // Tambahkan file cover image
      formData.append('cover_image', coverImageFile);

      // Tambahkan field lainnya jika ada
      Object.entries(payload).forEach(([key, value]) => {
        if (
          value !== undefined &&
          !['title', 'content', 'publishedAt'].includes(key)
        ) {
          formData.append(key, value as string | Blob);
        }
      });

      res = await api.post(apiRoutes.articles, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Jika tidak ada file, kirim sebagai JSON biasa
      const backendPayload = {
        judul: payload.title,
        content: payload.content,
        tanggal: payload.publishedAt || payload.createdAt,
        ...payload,
      };

      // Pastikan field title diganti ke judul sesuai yang diharapkan backend
      if (payload.title && !backendPayload.judul) {
        backendPayload.judul = payload.title;
      }

      res = await api.post(apiRoutes.articles, backendPayload);
    }

    const data = unwrapData<any>(res.data);

    // Handle different response structures
    if (data?.results) {
      return normalizeArticle(data.results);
    } else if (data?.data) {
      return normalizeArticle(data.data);
    } else {
      return data ? normalizeArticle(data) : null;
    }
  } catch (error) {
    console.error('Gagal membuat artikel', error);
    throw error;
  }
}

export async function updateArticle(
  id: string | number,
  payload: ArticlePayload,
  coverImageFile?: File
): Promise<Article | null> {
  try {
    let res;

    if (coverImageFile) {
      // Jika ada file gambar, gunakan multipart/form-data
      const formData = new FormData();

      // Tambahkan field yang dibutuhkan backend
      if (payload.title) formData.append('judul', payload.title);
      if (payload.content) formData.append('content', payload.content);
      if (payload.publishedAt) formData.append('tanggal', payload.publishedAt);

      // Tambahkan file cover image
      formData.append('cover_image', coverImageFile);

      // Tambahkan field lainnya jika ada
      Object.entries(payload).forEach(([key, value]) => {
        if (
          value !== undefined &&
          !['title', 'content', 'publishedAt'].includes(key)
        ) {
          formData.append(key, value as string | Blob);
        }
      });

      res = await api.put(apiRoutes.article(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Jika tidak ada file, kirim sebagai JSON biasa
      const backendPayload = {
        judul: payload.title,
        content: payload.content,
        tanggal: payload.publishedAt,
        ...payload,
      };

      // Pastikan field title diganti ke judul sesuai yang diharapkan backend
      if (payload.title && !backendPayload.judul) {
        backendPayload.judul = payload.title;
      }

      res = await api.put(apiRoutes.article(id), backendPayload);
    }

    const data = unwrapData<any>(res.data);

    // Handle different response structures
    if (data?.results) {
      return normalizeArticle(data.results);
    } else if (data?.data) {
      return normalizeArticle(data.data);
    } else {
      return data ? normalizeArticle(data) : null;
    }
  } catch (error) {
    console.error('Gagal memperbarui artikel', error);
    throw error;
  }
}

export async function deleteArticle(id: string | number): Promise<boolean> {
  try {
    await api.delete(apiRoutes.article(id));
    return true;
  } catch (error) {
    console.error('Gagal menghapus artikel', error);
    return false;
  }
}

export async function toggleArticlePublish(
  id: string | number
): Promise<Article | null> {
  try {
    const res = await api.patch(`${apiRoutes.article(id)}/publish`);
    const data = unwrapData<any>(res.data);

    // Handle different response structures
    if (data?.results) {
      return normalizeArticle(data.results);
    } else if (data?.data) {
      return normalizeArticle(data.data);
    } else {
      return data ? normalizeArticle(data) : null;
    }
  } catch (error) {
    console.error('Gagal mengganti status publikasi artikel', error);
    throw error;
  }
}
