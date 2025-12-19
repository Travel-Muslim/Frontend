import api from './axios';
import { apiRoutes } from './routes';
import type { Destination } from './destinations';

export interface PackageDetail extends Destination {
  continent?: string; // benua in backend
  departure?: string; // periode in backend
  destinationId?: string; // destination_id in backend
  slug?: string; // slug in backend
  durationDays?: number; // duration_days in backend
  durationNights?: number; // duration_nights in backend
  maxParticipants?: number; // max_participants in backendsa
  quota?: number; // quota in backend
  quotaFilled?: number; // quota_filled in backend
  facilities?: string[]; // facilities in backend
  includes?: any; // includes JSONB in backend
  excludes?: any; // excludes JSONB in backend
  departureAirport?: string; // departure_airport in backend
  arrivalAirport?: string; // arrival_airport in backend
  startDate?: string; // start_date in backend
  endDate?: string; // end_date in backend
  departureDates?: any; // departure_dates JSONB in backend
  isActive?: boolean; // is_active in backend
  isFeatured?: boolean; // is_featured in backend
  createdAt?: string; // created_at in backend
  updatedAt?: string; // updated_at in backend
  itinerary?: {
    day?: string;
    destinasi?: string[];
    makan?: string[];
    masjid?: string[];
    transportasi?: string[];
  }[];
}

// Type untuk payload saat create/update
export interface PackagePayload {
  name: string; // nama paket
  location: string; // lokasi
  benua?: string; // benua
  harga: number; // harga (price)
  periode?: string; // periode (departure date)
  maskapai?: string; // airline
  bandara?: string; // airport
  duration?: string; // durasi
  itinerary?: any; // itinerary as JSON
  image?: string; // image URL
  destinationId?: string; // destination_id
  description?: string; // deskripsi
  quota?: number; // kuota
  isActive?: boolean; // status aktif
  isFeatured?: boolean; // apakah paket unggulan
}

const toArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') return [value as unknown as T];
  return [];
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

// Format date untuk menghilangkan T dan timezone
const formatDate = (dateStr: string): string => {
  if (!dateStr) return dateStr;
  // Hilangkan T dan timezone (Z atau +00:00)
  return dateStr.replace(/T.*$/, '').replace(/\.\d{3}Z$/, '');
};

const normalizePackage = (raw: any): PackageDetail => ({
  id: raw?.id ?? raw?._id ?? raw?.packageId ?? Date.now(),
  title: raw?.name ?? raw?.title ?? raw?.package_name ?? 'Paket Tanpa Nama',
  location: raw?.location ?? raw?.country ?? raw?.city ?? '-',
  price:
    typeof raw?.price === 'number'
      ? raw.price
      : typeof raw?.harga === 'number'
        ? raw.harga
        : Number(raw?.price ?? raw?.harga ?? 0) || undefined,
  image:
    raw?.image ??
    raw?.image_url ??
    raw?.imageUrl ??
    raw?.thumbnail ??
    raw?.cover,
  period: toArray<string>(
    raw?.period ??
      raw?.departure_dates ??
      raw?.departure ??
      raw?.periode ??
      raw?.departureDate
  ).map(formatDate),
  duration: raw?.duration ?? raw?.duration_text ?? '',
  airline: raw?.airline ?? raw?.maskapai ?? 'Airline',
  airport: raw?.airport ?? raw?.bandara ?? raw?.departure_airport ?? 'Airport',
  description: raw?.description ?? raw?.details ?? '',
  continent: raw?.continent ?? raw?.benua ?? raw?.region ?? '',
  departure: raw?.departure ?? raw?.periode ?? '',
  destinationId: raw?.destinationId ?? raw?.destination_id,
  slug: raw?.slug,
  durationDays: raw?.durationDays ?? raw?.duration_days,
  durationNights: raw?.durationNights ?? raw?.duration_nights,
  maxParticipants: raw?.maxParticipants ?? raw?.max_participants,
  quota: raw?.quota,
  quotaFilled: raw?.quotaFilled ?? raw?.quota_filled,
  facilities: raw?.facilities,
  includes: raw?.includes,
  excludes: raw?.excludes,
  departureAirport:
    raw?.departureAirport ?? raw?.departure_airport ?? raw?.bandara,
  arrivalAirport: raw?.arrivalAirport ?? raw?.arrival_airport,
  startDate: raw?.startDate ?? raw?.start_date,
  endDate: raw?.endDate ?? raw?.end_date,
  departureDates: raw?.departureDates ?? raw?.departure_dates,
  isActive: raw?.isActive ?? raw?.is_active,
  isFeatured: raw?.isFeatured ?? raw?.is_featured,
  createdAt: raw?.createdAt ?? raw?.created_at,
  updatedAt: raw?.updatedAt ?? raw?.updated_at,
  itinerary: toArray<any>(raw?.itinerary || raw?.itineraries).map(
    (item, idx) => ({
      day: item?.day || `Hari ${idx + 1}`,
      destinasi: toArray<string>(item?.destinasi ?? item?.destination),
      makan: toArray<string>(item?.makan ?? item?.food),
      masjid: toArray<string>(item?.masjid ?? item?.mosque),
      transportasi: toArray<string>(item?.transportasi ?? item?.transport),
    })
  ),
});

export async function fetchPackages(
  limit: number = 100
): Promise<PackageDetail[]> {
  try {
    const res = await api.get(apiRoutes.packages, {
      params: { limit },
    });
    const packages = handlePaginatedResponse<PackageDetail>(res.data);
    return Array.isArray(packages) ? packages.map(normalizePackage) : [];
  } catch (error) {
    console.error('Gagal memuat paket', error);
    return [];
  }
}

export async function fetchPackage(
  id: string | number
): Promise<PackageDetail | null> {
  try {
    const res = await api.get(apiRoutes.package(id));
    const payload = unwrapData<any>(res.data);

    // Handle different response structures from backend
    if (payload?.results) {
      return normalizePackage(payload.results);
    } else if (payload?.data) {
      return normalizePackage(payload.data);
    } else {
      return payload ? normalizePackage(payload) : null;
    }
  } catch (error) {
    console.error('Gagal memuat detail paket', error);
    return null;
  }
}

export async function savePackage(
  payload: PackagePayload,
  id?: string | number,
  imageFile?: File
): Promise<PackageDetail | null> {
  try {
    let res;

    if (imageFile) {
      // Jika ada file gambar, gunakan multipart/form-data
      const formData = new FormData();

      // Mapping field-field dari payload ke format yang diharapkan backend
      if (payload.name) formData.append('name', payload.name);
      if (payload.location) formData.append('location', payload.location);
      if (payload.benua) formData.append('benua', payload.benua);
      if (payload.harga) formData.append('harga', payload.harga.toString());
      if (payload.periode) formData.append('periode', payload.periode);
      if (payload.maskapai) formData.append('maskapai', payload.maskapai);
      if (payload.bandara) formData.append('bandara', payload.bandara);
      if (payload.duration) formData.append('duration', payload.duration);
      if (payload.itinerary)
        formData.append('itinerary', JSON.stringify(payload.itinerary));
      if (payload.description)
        formData.append('description', payload.description);
      if (payload.quota) formData.append('quota', payload.quota.toString());
      if (payload.isActive !== undefined)
        formData.append('is_active', payload.isActive.toString());
      if (payload.isFeatured !== undefined)
        formData.append('is_featured', payload.isFeatured.toString());

      // Tambahkan file gambar
      formData.append('image', imageFile);

      if (id) {
        res = await api.put(apiRoutes.package(id), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        res = await api.post(apiRoutes.packages, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
    } else {
      // Jika tidak ada file, kirim sebagai JSON biasa
      const body = { ...payload };

      if (id) {
        res = await api.put(apiRoutes.package(id), body);
      } else {
        res = await api.post(apiRoutes.packages, body);
      }
    }

    const data = unwrapData<any>(res.data);

    // Handle different response structures
    if (data?.results) {
      return normalizePackage(data.results);
    } else if (data?.data) {
      return normalizePackage(data.data);
    } else {
      return data ? normalizePackage(data) : null;
    }
  } catch (error) {
    console.error('Gagal menyimpan paket', error);
    throw error;
  }
}

export async function deletePackage(id: string | number): Promise<boolean> {
  try {
    await api.delete(apiRoutes.package(id));
    return true;
  } catch (error) {
    console.error('Gagal menghapus paket', error);
    return false;
  }
}
