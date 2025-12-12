import api from "./axios";
import { apiRoutes } from "./routes";

export type StatKey = "booking" | "profit" | "active" | string;

export interface Stat {
  key: StatKey;
  label: string;
  value: number;
  suffix?: string;
}

export interface PackageStat {
  title: string;
  image?: string;
  progress?: number;
}

export interface Buyer {
  name: string;
  bookings?: number;
  reviews?: number;
  avatar?: string;
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
  stats?: Stat[];
  packages?: PackageStat[];
  buyers?: Buyer[];
  status?: StatusSegment[];
  trips?: TripRow[];
}

const unwrapData = <T>(payload: any): T => {
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
};

export async function fetchDashboard(): Promise<DashboardPayload> {
  try {
    const res = await api.get(apiRoutes.dashboard);
    return unwrapData<DashboardPayload>(res.data) || {};
  } catch (error) {
    console.error("Gagal memuat dashboard", error);
    return {};
  }
}
