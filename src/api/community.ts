import api from './axios';
import { apiRoutes } from './routes';

export interface CommunityPost {
  id: string | number;
  title: string; // judul dari backend
  body: string; // deskripsi dari backend
  author: string; // tidak eksplisit di respons komunitas, mungkin dari user
  rating?: number;
  timeAgo?: string; // created_at dari backend
  avatar?: string;
  totalComments?: number; // total_comments dari backend
  userId?: string; // user_id dari backend
  createdAt?: string; // created_at dari backend
  updatedAt?: string; // updated_at dari backend

  // Field-field untuk kompatibilitas dengan struktur sebelumnya
  judul?: string; // judul dari respons backend
  deskripsi?: string; // deskripsi dari respons backend
}

const normalizePost = (raw: any): CommunityPost => {
  // Get user data from nested user object or direct fields
  const user = raw?.user || {};
  const userName =
    user?.fullname ||
    user?.name ||
    raw?.author ||
    raw?.created_by ||
    raw?.nama ||
    'Anonim';
  const userAvatar =
    user?.avatar || user?.avatar_url || raw?.avatar || raw?.avatar_url || '';

  // Default avatar if no avatar provided
  const defaultAvatar =
    userName !== 'Anonim'
      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`
      : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous';

  return {
    id: raw?.id ?? raw?._id ?? Date.now(),
    title: raw?.judul ?? raw?.title ?? raw?.subject ?? 'Tanpa Judul',
    body: raw?.deskripsi ?? raw?.body ?? raw?.content ?? '',
    author: userName,
    rating:
      typeof raw?.rating === 'number'
        ? raw.rating
        : Number(raw?.rating ?? 0) || undefined,
    timeAgo: raw?.timeAgo ?? raw?.time_ago ?? raw?.created_at ?? '',
    avatar: userAvatar || defaultAvatar,
    totalComments: raw?.total_comments ?? raw?.comments_count,
    userId: raw?.user_id || user?.id,
    createdAt: raw?.created_at,
    updatedAt: raw?.updated_at,

    // Field untuk kompatibilitas
    judul: raw?.judul,
    deskripsi: raw?.deskripsi,
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

export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const res = await api.get(apiRoutes.community);
    const posts = handlePaginatedResponse<CommunityPost>(res.data);
    return Array.isArray(posts) ? posts.map(normalizePost) : [];
  } catch (error) {
    console.error('Gagal memuat komunitas', error);
    return [];
  }
}

// Fungsi untuk membuat post komunitas baru
export async function createCommunityPost(payload: {
  judul: string;
  komentar: string;
  rating: number;
  tanggal?: string;
}): Promise<CommunityPost | null> {
  try {
    const res = await api.post(apiRoutes.community, payload);
    const data = unwrapData<any>(res.data);

    // Handle different response structures
    if (data?.results) {
      return normalizePost(data.results);
    } else if (data?.data) {
      return normalizePost(data.data);
    } else {
      return data ? normalizePost(data) : null;
    }
  } catch (error) {
    console.error('Gagal membuat post komunitas', error);
    throw error;
  }
}
