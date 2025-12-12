import api from "./axios";
import { apiRoutes } from "./routes";

export interface Destination {
  id: string | number;
  title: string;
  location: string;
  price?: number;
  image?: string;
  period?: string[];
  duration?: string;
  airline?: string;
  airport?: string;
  description?: string;
  itinerary?: {
    day?: string;
    destinasi?: string[];
    makan?: string[];
    masjid?: string[];
    transportasi?: string[];
  }[];
}

const toArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") return [value as unknown as T];
  return [];
};

const normalizeDestination = (raw: any): Destination => {
  const id =
    raw?.id ??
    raw?._id ??
    raw?.destinationId ??
    raw?.packageId ??
    (globalThis.crypto && "randomUUID" in globalThis.crypto ? globalThis.crypto.randomUUID() : Date.now());
  const images = toArray<string>(raw?.gallery || raw?.images);
  const itinerary = toArray<any>(raw?.itinerary || raw?.itineraries).map((item, idx) => ({
    day: item?.day || `Hari ${idx + 1}`,
    destinasi: toArray<string>(item?.destinasi ?? item?.destination),
    makan: toArray<string>(item?.makan ?? item?.food),
    masjid: toArray<string>(item?.masjid ?? item?.mosque),
    transportasi: toArray<string>(item?.transportasi ?? item?.transport),
  }));
  return {
    id,
    title: String(raw?.title ?? raw?.name ?? raw?.package_name ?? "Paket Tanpa Nama"),
    location: String(raw?.location ?? raw?.country ?? raw?.city ?? raw?.region ?? "-"),
    price: typeof raw?.price === "number" ? raw.price : Number(raw?.price ?? raw?.minPrice ?? 0) || undefined,
    image: raw?.image ?? raw?.thumbnail ?? raw?.cover ?? images[0],
    period: toArray<string>(raw?.period ?? raw?.periods ?? raw?.departure_dates ?? raw?.departureDates),
    duration: raw?.duration ?? raw?.durations ?? raw?.duration_text ?? "",
    airline: raw?.airline ?? raw?.airlines ?? "",
    airport: raw?.airport ?? raw?.departure_airport ?? "",
    description: raw?.description ?? raw?.details ?? "",
    itinerary: itinerary.length ? itinerary : undefined,
  };
};

const unwrapData = <T>(payload: any): T => {
  if (payload?.data) return payload.data as T;
  return payload as T;
};

export async function fetchDestinations(): Promise<Destination[]> {
  try {
    const res = await api.get(apiRoutes.destinations);
    const list = unwrapData<any[]>(res.data);
    return Array.isArray(list) ? list.map(normalizeDestination) : [];
  } catch (error) {
    console.error("Gagal memuat destinasi", error);
    return [];
  }
}

export async function fetchDestination(id: string | number): Promise<Destination | null> {
  try {
    const res = await api.get(apiRoutes.destination(id));
    const payload = unwrapData<any>(res.data);
    return payload ? normalizeDestination(payload) : null;
  } catch (error) {
    console.error("Gagal memuat detail destinasi", error);
    return null;
  }
}
