import api from "./axios";
import { apiRoutes } from "./routes";

export interface CommunityPost {
  id: string | number;
  title: string;
  body: string;
  author: string;
  rating?: number;
  timeAgo?: string;
  avatar?: string;
}

const normalizePost = (raw: any): CommunityPost => ({
  id: raw?.id ?? raw?._id ?? Date.now(),
  title: raw?.title ?? raw?.subject ?? "Tanpa Judul",
  body: raw?.body ?? raw?.content ?? "",
  author: raw?.author ?? raw?.created_by ?? "Anonim",
  rating: typeof raw?.rating === "number" ? raw.rating : Number(raw?.rating ?? 0) || undefined,
  timeAgo: raw?.timeAgo ?? raw?.time_ago ?? raw?.created_at ?? "",
  avatar: raw?.avatar ?? raw?.avatar_url ?? "",
});

const unwrapData = <T>(payload: any): T => {
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
};

export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const res = await api.get(apiRoutes.community);
    const list = unwrapData<any[]>(res.data);
    return Array.isArray(list) ? list.map(normalizePost) : [];
  } catch (error) {
    console.error("Gagal memuat komunitas", error);
    return [];
  }
}
