import api from "./axios";
import { apiRoutes } from "./routes";

export type ArticleStatus = "Selesai" | "Draft" | string;

export interface ArticleBlock {
  type: "text" | "image" | "link" | string;
  value: string;
  label?: string;
}

export interface Article {
  id: string | number;
  title: string;
  displayDate?: string;
  date?: string;
  time?: string;
  status?: ArticleStatus;
  content?: string;
  image?: string;
  gallery?: string[];
  link?: string;
  blocks?: ArticleBlock[];
  author?: string;
  tag?: string;
}

export type ArticlePayload = Partial<Omit<Article, "id">>;

const toArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") return [value as unknown as T];
  return [];
};

const formatDisplayDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
};

const normalizeArticle = (raw: any): Article => {
  const gallery = toArray<string>(raw?.gallery || raw?.images);
  const blocks = toArray<ArticleBlock>(raw?.blocks).map((b) => ({
    type: b.type,
    value: b.value,
    label: b.label,
  }));
  const date = raw?.date ?? raw?.published_at ?? raw?.createdAt ?? "";

  const id =
    raw?.id ??
    raw?._id ??
    (globalThis.crypto && "randomUUID" in globalThis.crypto ? globalThis.crypto.randomUUID() : Date.now());

  return {
    id,
    title: raw?.title ?? raw?.name ?? "Artikel Tanpa Judul",
    displayDate: raw?.displayDate ?? formatDisplayDate(date),
    date,
    time: raw?.time ?? raw?.published_time ?? "",
    status: raw?.status ?? raw?.state ?? "Draft",
    content: raw?.content ?? raw?.body ?? "",
    image: raw?.image ?? raw?.thumbnail ?? raw?.cover ?? gallery[0],
    gallery,
    link: raw?.link ?? raw?.url ?? "",
    blocks: blocks.length ? blocks : undefined,
    author: raw?.author ?? raw?.created_by ?? "",
    tag: raw?.tag ?? raw?.label ?? "",
  };
};

const unwrapData = <T>(payload: any): T => {
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
};

export async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await api.get(apiRoutes.articles);
    const list = unwrapData<any[]>(res.data);
    return Array.isArray(list) ? list.map(normalizeArticle) : [];
  } catch (error) {
    console.error("Gagal memuat artikel", error);
    return [];
  }
}

export async function fetchArticle(id: string | number): Promise<Article | null> {
  try {
    const res = await api.get(apiRoutes.article(id));
    const payload = unwrapData<any>(res.data);
    return payload ? normalizeArticle(payload) : null;
  } catch (error) {
    console.error("Gagal memuat artikel", error);
    return null;
  }
}

export async function createArticle(payload: ArticlePayload): Promise<Article | null> {
  try {
    const res = await api.post(apiRoutes.articles, payload);
    const data = unwrapData<any>(res.data);
    return data ? normalizeArticle(data) : null;
  } catch (error) {
    console.error("Gagal membuat artikel", error);
    throw error;
  }
}

export async function updateArticle(id: string | number, payload: ArticlePayload): Promise<Article | null> {
  try {
    const res = await api.put(apiRoutes.article(id), payload);
    const data = unwrapData<any>(res.data);
    return data ? normalizeArticle(data) : null;
  } catch (error) {
    console.error("Gagal memperbarui artikel", error);
    throw error;
  }
}

export async function deleteArticle(id: string | number): Promise<boolean> {
  try {
    await api.delete(apiRoutes.article(id));
    return true;
  } catch (error) {
    console.error("Gagal menghapus artikel", error);
    return false;
  }
}
