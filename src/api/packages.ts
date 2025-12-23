import api from './axios';
import { apiRoutes } from './routes';

export interface PackageDetail {
  id: string | number;
  name: string; // title/name in frontend
  location: string;
  benua?: string; // continent
  price?: number; // harga in backend
  image?: string; // imageUrl in backend
  duration?: string; // formatted as "X Hari Y Malam" in detail
  maskapai?: string; // airline
  bandara?: string; // airport
  periode_start?: string; // periode_start in backend
  periode_end?: string; // periode_end in backend
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
  name: string;
  location: string;
  benua?: string;
  harga: number;
  periode_start?: string;
  periode_end?: string;
  maskapai?: string;
  bandara?: string;
  duration?: number;
  itinerary?: any;
  image?: string;
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

const normalizePackage = (raw: any): PackageDetail => ({
  id: raw?.id ?? Date.now(),
  name: raw?.name ?? 'Paket Tanpa Nama',
  location: raw?.location ?? '-',
  benua: raw?.benua,
  price:
    typeof raw?.price === 'number'
      ? raw.price
      : typeof raw?.harga === 'number'
        ? raw.harga
        : Number(raw?.price ?? raw?.harga ?? 0) || undefined,
  image: raw?.image ?? raw?.imageUrl,
  duration: raw?.duration ?? '',
  maskapai: raw?.maskapai,
  bandara: raw?.bandara,
  periode_start: raw?.periode_start ?? raw?.periode_start,
  periode_end: raw?.periode_end ?? raw?.periode_end,
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
      if (payload.periode_start)
        formData.append('periode_start', payload.periode_start);
      if (payload.periode_end)
        formData.append('periode_end', payload.periode_end);
      if (payload.maskapai) formData.append('maskapai', payload.maskapai);
      if (payload.bandara) formData.append('bandara', payload.bandara);
      if (payload.duration)
        formData.append('duration', payload.duration.toString());
      if (payload.itinerary)
        formData.append('itinerary', JSON.stringify(payload.itinerary));

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
