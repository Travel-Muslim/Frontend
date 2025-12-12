import api from "./axios";
import { apiRoutes } from "./routes";

export type OrderStatus = "Selesai" | "Diproses" | "Dibatalkan" | string;

export interface OrderRow {
  id: string;
  name: string;
  packageName: string;
  date: string;
  time?: string;
  status: OrderStatus;
  payment?: string;
}

const unwrapData = <T>(payload: any): T => {
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
};

const normalizeOrder = (raw: any): OrderRow => ({
  id: String(raw?.id ?? raw?._id ?? raw?.orderId ?? ""),
  name: raw?.name ?? raw?.customer_name ?? raw?.fullname ?? "-",
  packageName: raw?.packageName ?? raw?.package_name ?? raw?.tour_name ?? "-",
  date: raw?.date ?? raw?.created_at ?? "",
  time: raw?.time ?? raw?.created_time ?? "",
  status: raw?.status ?? raw?.state ?? "Diproses",
  payment: raw?.payment ?? raw?.amount ?? raw?.total ? String(raw.total) : undefined,
});

export async function fetchOrders(): Promise<OrderRow[]> {
  try {
    const res = await api.get(apiRoutes.orders);
    const list = unwrapData<any[]>(res.data);
    return Array.isArray(list) ? list.map(normalizeOrder) : [];
  } catch (error) {
    console.error("Gagal memuat orders", error);
    return [];
  }
}
