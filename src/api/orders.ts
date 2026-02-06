import api from "./axios";
import { apiRoutes } from "./routes";

export type OrderStatus = "pending" | "confirmed" | "paid" | "cancelled" | "completed" | string;
export type PaymentStatus = "unpaid" | "paid" | "refunded" | string;

export interface OrderRow {
  id: string;
  name: string;
  packageName: string;
  date: string;
  time?: string;
  status: OrderStatus;
  payment?: string;
  paymentStatus?: PaymentStatus;
  totalParticipants?: number;
  email?: string;
  phoneNumber?: string;
}

export interface OrderDetail extends OrderRow {
  bookingCode?: string;
  departureDate?: string;
  returnDate?: string;
  fullname?: string;
  passportNumber?: string;
  passportExpiry?: string;
  nationality?: string;
  specialRequests?: string;
  packageLocation?: string;
  packageBenua?: string;
  packageMaskapai?: string;
  packageBandara?: string;
}

const unwrapData = <T>(payload: any): T => {
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
};

const normalizeOrder = (raw: any): OrderRow => ({
  id: String(raw?.id ?? raw?._id ?? raw?.booking_id ?? raw?.orderId ?? ""),
  name: raw?.name ?? raw?.fullname ?? raw?.customer_name ?? raw?.user_name ?? "-",
  packageName: raw?.packageName ?? raw?.package_name ?? raw?.tour_name ?? "-",
  date: raw?.date ?? raw?.booking_date ?? raw?.created_at ?? "",
  time: raw?.time ?? raw?.created_time ?? "",
  status: raw?.status ?? raw?.booking_status ?? raw?.state ?? "pending",
  payment: raw?.payment ?? raw?.total_price ?? raw?.amount ?? raw?.total ?? raw?.price ?? "0",
  paymentStatus: raw?.payment_status ?? raw?.paymentStatus ?? "unpaid",
  totalParticipants: raw?.total_participants ?? raw?.totalParticipants,
  email: raw?.email,
  phoneNumber: raw?.phone_number ?? raw?.phoneNumber,
});

const normalizeOrderDetail = (raw: any): OrderDetail => ({
  ...normalizeOrder(raw),
  bookingCode: raw?.booking_code ?? raw?.bookingCode,
  departureDate: raw?.departure_date ?? raw?.departureDate,
  returnDate: raw?.return_date ?? raw?.returnDate,
  fullname: raw?.fullname ?? raw?.full_name,
  passportNumber: raw?.passport_number ?? raw?.passportNumber,
  passportExpiry: raw?.passport_expiry ?? raw?.passportExpiry,
  nationality: raw?.nationality,
  specialRequests: raw?.special_requests ?? raw?.specialRequests,
  packageLocation: raw?.destination_name ?? raw?.package_location,
  packageBenua: raw?.package_benua,
  packageMaskapai: raw?.package_maskapai,
  packageBandara: raw?.package_bandara,
});

export async function fetchOrders(): Promise<OrderRow[]> {
  try {
    const res = await api.get(apiRoutes.bookings + '/admin/all');
    const list = unwrapData<any[]>(res.data);
    return Array.isArray(list) ? list.map(normalizeOrder) : [];
  } catch (error) {
    console.error("Gagal memuat orders", error);
    return [];
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  try {
    await api.put(`${apiRoutes.bookings}/${id}/admin-update-status`, { status });
    return true;
  } catch (error) {
    console.error("Gagal update status order", error);
    return false;
  }
}

export async function updatePaymentStatus(id: string, payment_status: PaymentStatus): Promise<boolean> {
  try {
    await api.put(`${apiRoutes.bookings}/${id}/admin-update-payment`, { payment_status });
    return true;
  } catch (error) {
    console.error("Gagal update payment status", error);
    return false;
  }
}

export async function fetchOrder(id: string): Promise<OrderDetail | null> {
  try {
    const res = await api.get(`${apiRoutes.bookings}/${id}`);
    const data = unwrapData<any>(res.data);
    return normalizeOrderDetail(data);
  } catch (error) {
    console.error("Gagal memuat detail order", error);
    return null;
  }
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    await api.delete(`${apiRoutes.bookings}/${id}`);
    return true;
  } catch (error) {
    console.error("Gagal menghapus order", error);
    return false;
  }
}
