import api from "./axios";
import { apiRoutes } from "./routes";
import type { Destination } from "./destinations";

export interface PackageDetail extends Destination {
  continent?: string;
  departure?: string;
}

const toArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") return [value as unknown as T];
  return [];
};

const unwrapData = <T>(payload: any): T => {
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
};

const normalizePackage = (raw: any): PackageDetail => ({
  id: raw?.id ?? raw?._id ?? raw?.packageId ?? Date.now(),
  title: raw?.title ?? raw?.name ?? raw?.package_name ?? "Paket Tanpa Nama",
  location: raw?.location ?? raw?.country ?? raw?.city ?? "-",
  price: typeof raw?.price === "number" ? raw.price : Number(raw?.price ?? 0) || undefined,
  image: raw?.image ?? raw?.thumbnail ?? raw?.cover,
  period: toArray<string>(raw?.period ?? raw?.departure ?? raw?.departure_dates),
  duration: raw?.duration ?? "",
  airline: raw?.airline ?? "",
  airport: raw?.airport ?? "",
  description: raw?.description ?? "",
  continent: raw?.continent ?? raw?.region ?? "",
  departure: raw?.departure ?? "",
  itinerary: toArray<any>(raw?.itinerary || raw?.itineraries).map((item, idx) => ({
    day: item?.day || `Hari ${idx + 1}`,
    destinasi: toArray<string>(item?.destinasi ?? item?.destination),
    makan: toArray<string>(item?.makan ?? item?.food),
    masjid: toArray<string>(item?.masjid ?? item?.mosque),
    transportasi: toArray<string>(item?.transportasi ?? item?.transport),
  })),
});

export async function fetchPackages(): Promise<PackageDetail[]> {
  try {
    const res = await api.get(apiRoutes.packages);
    const list = unwrapData<any[]>(res.data);
    return Array.isArray(list) ? list.map(normalizePackage) : [];
  } catch (error) {
    console.error("Gagal memuat paket", error);
    return [];
  }
}

export async function fetchPackage(id: string | number): Promise<PackageDetail | null> {
  try {
    const res = await api.get(apiRoutes.package(id));
    const payload = unwrapData<any>(res.data);
    return payload ? normalizePackage(payload) : null;
  } catch (error) {
    console.error("Gagal memuat detail paket", error);
    return null;
  }
}

export async function savePackage(payload: Partial<PackageDetail>, id?: string | number): Promise<PackageDetail | null> {
  const body = { ...payload, id: undefined };
  try {
    if (id) {
      const res = await api.put(apiRoutes.package(id), body);
      return normalizePackage(unwrapData<any>(res.data));
    }
    const res = await api.post(apiRoutes.packages, body);
    return normalizePackage(unwrapData<any>(res.data));
  } catch (error) {
    console.error("Gagal menyimpan paket", error);
    throw error;
  }
}
