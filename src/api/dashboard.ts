import api from './axios';
import { apiRoutes } from './routes';

export type StatKey = 'booking' | 'profit' | 'active' | string;

export interface Stat {
  key: StatKey;
  label: string;
  value: number;
  suffix?: string;
}

export interface PackageStat {
  name: string; // nama paket dari backend
  percentage: number; // persentase booking dari backend
  imageUrl?: string; // imageUrl dari backend
}

export interface Buyer {
  nama: string; // nama dari backend
  totalBooking?: number; // totalBooking dari backend
  totalUlasan?: number; // totalUlasan dari backend
  profileImage?: string; // profileImage dari backend
}

export interface BookingStatus {
  asia: number; // jumlah booking Asia
  eropa: number; // jumlah booking Eropa
  australia: number; // jumlah booking Australia
  afrika: number; // jumlah booking Afrika
}

export interface DashboardStats {
  totalBooking: number;
  profit: number;
  pembeliAktif: number;
}

export interface TripRow {
  buyer: string;
  tour: string;
  price: number;
}

export interface StatusSegment {
  label: string;
  value: number;
  color?: string;
}

export interface DashboardPayload {
  stats?: DashboardStats;
  packages?: PackageStat[];
  buyers?: Buyer[];
  status?: BookingStatus;
  trips?: TripRow[];
}

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

// Fungsi untuk mengambil statistik dasbor admin
export async function fetchAdminDashboardStats(): Promise<DashboardStats | null> {
  try {
    const res = await api.get(`${apiRoutes.admin}/stats`); // endpoint backend adalah /admin/stats
    const data = unwrapData<any>(res.data);

    // Handle different response structures
    if (data?.results) {
      return data.results;
    } else if (data?.data) {
      return data.data;
    } else {
      return data;
    }
  } catch (error) {
    console.error('Gagal memuat statistik dashboard', error);
    return null;
  }
}

// Fungsi untuk mengambil paket terlaris
export async function fetchTopPackages(): Promise<PackageStat[]> {
  try {
    const res = await api.get(`${apiRoutes.admin}/top-packages`); // endpoint backend adalah /admin/top-packages
    const packages = handlePaginatedResponse<PackageStat>(res.data);
    return Array.isArray(packages) ? packages : [];
  } catch (error) {
    console.error('Gagal memuat paket terlaris', error);
    return [];
  }
}

// Fungsi untuk mengambil pembeli terbanyak
export async function fetchTopBuyers(): Promise<Buyer[]> {
  try {
    const res = await api.get(`${apiRoutes.admin}/top-buyers`); // endpoint backend adalah /admin/top-buyers
    const buyers = handlePaginatedResponse<Buyer>(res.data);
    return Array.isArray(buyers) ? buyers : [];
  } catch (error) {
    console.error('Gagal memuat pembeli terbanyak', error);
    return [];
  }
}

// Fungsi untuk mengambil status booking berdasarkan benua
export async function fetchBookingStatus(): Promise<BookingStatus | null> {
  try {
    const res = await api.get(`${apiRoutes.admin}/booking-status`); // endpoint backend adalah /admin/booking-status
    const data = unwrapData<any>(res.data);

    // Handle different response structures
    if (data?.results) {
      return data.results;
    } else if (data?.data) {
      return data.data;
    } else {
      return data;
    }
  } catch (error) {
    console.error('Gagal memuat status booking', error);
    return null;
  }
}

// Fungsi untuk mengambil perjalanan terbaru
export async function fetchRecentTrips(): Promise<TripRow[]> {
  try {
    const res = await api.get(`${apiRoutes.admin}/recent-trips`); // endpoint backend adalah /admin/recent-trips
    const trips = handlePaginatedResponse<TripRow>(res.data);
    return Array.isArray(trips) ? trips : [];
  } catch (error) {
    console.error('Gagal memuat perjalanan terbaru', error);
    return [];
  }
}

// Fungsi umum untuk mengambil semua data dashboard (kompatibilitas dengan kode lama)
export async function fetchDashboard(): Promise<DashboardPayload> {
  try {
    // Karena endpoint /admin/dashboard tidak sesuai dengan backend,
    // kita kumpulkan data dari endpoint yang sesuai
    const [stats, packages, buyers, status, trips] = await Promise.allSettled([
      fetchAdminDashboardStats(),
      fetchTopPackages(),
      fetchTopBuyers(),
      fetchBookingStatus(),
      fetchRecentTrips(),
    ]);

    return {
      stats: stats.status === 'fulfilled' && stats.value !== null ? stats.value : undefined,
      packages: packages.status === 'fulfilled' && packages.value !== null ? packages.value : [],
      buyers: buyers.status === 'fulfilled' && buyers.value !== null ? buyers.value : [],
      status: status.status === 'fulfilled' && status.value !== null ? status.value : undefined,
      trips: trips.status === 'fulfilled' && trips.value !== null ? trips.value : [],
    };
  } catch (error) {
    console.error('Gagal memuat dashboard', error);
    return {};
  }
}
