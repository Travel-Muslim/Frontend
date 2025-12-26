import api from './axios';
import { apiRoutes } from './routes';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'done'
  | string;
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | string;

export interface BookingPassenger {
  id?: string;
  nama?: string;
  umur?: number;
  jenis_kelamin?: string;
  nomor_paspor?: string;
  tanggal_lahir?: string;
  kewarganegaraan?: string;
  hubungan?: string;
}

export interface Booking {
  id: string;
  userId: string;
  packageId: string;
  bookingCode: string;
  bookingDate: string;
  departureDate?: string;
  totalParticipants: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  fullname?: string;
  email?: string;
  phoneNumber?: string;
  whatsappContact?: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportUrl?: string;
  nationality?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  bookingPassengers?: BookingPassenger[];
  facilities?: any;
  specialRequests?: string;
  cancelReason?: string;
  cancelledAt?: string;
  paymentDeadline?: string;

  // Fields for compatibility with different response formats
  user_id?: string;
  package_id?: string;
  booking_code?: string;
  booking_date?: string;
  total_participants?: number;
  total_price?: number;
  package_name?: string;
  package_image?: string;
  duration?: string;
  airline?: string;
  airport?: string;
  departure_month?: string;
}

// Type untuk pembuatan booking baru
export interface CreateBookingPayload {
  packageId: string;
  totalParticipants: number;
  departureDate?: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  whatsappContact: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
  notes?: string;
  bookingPassengers?: BookingPassenger[];
  paymentMethod?: string;
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

const normalizeBooking = (raw: any): Booking => ({
  id: raw?.id ?? raw?._id ?? raw?.booking_id ?? '',
  userId: raw?.userId ?? raw?.user_id ?? '',
  packageId: raw?.packageId ?? raw?.package_id ?? '',
  bookingCode: raw?.bookingCode ?? raw?.booking_code ?? '',
  bookingDate: raw?.bookingDate ?? raw?.booking_date ?? '',
  departureDate: raw?.departureDate ?? raw?.departure_date,
  totalParticipants: raw?.totalParticipants ?? raw?.total_participants ?? 0,
  totalPrice: raw?.totalPrice ?? raw?.total_price ?? 0,
  status: raw?.status ?? 'pending',
  paymentStatus: raw?.paymentStatus ?? raw?.payment_status ?? 'unpaid',
  fullname: raw?.fullname ?? raw?.name ?? '',
  email: raw?.email ?? '',
  phoneNumber: raw?.phoneNumber ?? raw?.phone_number ?? '',
  whatsappContact: raw?.whatsappContact ?? raw?.whatsapp_contact ?? '',
  passportNumber: raw?.passportNumber ?? raw?.passport_number ?? '',
  passportExpiry: raw?.passportExpiry ?? raw?.passport_expiry,
  passportUrl: raw?.passportUrl ?? raw?.passport_url,
  nationality: raw?.nationality ?? raw?.nationality ?? 'Indonesia',
  notes: raw?.notes ?? '',
  createdAt: raw?.createdAt ?? raw?.created_at ?? '',
  updatedAt: raw?.updatedAt ?? raw?.updated_at ?? '',
  bookingPassengers: raw?.bookingPassengers ?? raw?.booking_passengers,
  facilities: raw?.facilities,
  specialRequests: raw?.specialRequests ?? raw?.special_requests,
  cancelReason: raw?.cancelReason ?? raw?.cancel_reason,
  cancelledAt: raw?.cancelledAt ?? raw?.cancelled_at,
  paymentDeadline: raw?.paymentDeadline ?? raw?.payment_deadline,

  // Fields for compatibility
  package_name: raw?.package_name,
  package_image: raw?.package_image,
  duration: raw?.duration,
  airline: raw?.airline,
  airport: raw?.airport,
  departure_month: raw?.departure_month,
});

export async function fetchActiveBookings(): Promise<Booking[]> {
  try {
    const res = await api.get(`${apiRoutes.bookings}/active`);
    const bookings = handlePaginatedResponse<Booking>(res.data);
    return Array.isArray(bookings) ? bookings.map(normalizeBooking) : [];
  } catch (error) {
    console.error('Gagal memuat booking aktif', error);
    return [];
  }
}

export async function fetchBookingHistory(): Promise<Booking[]> {
  try {
    const res = await api.get(`${apiRoutes.bookings}/history`);
    const bookings = handlePaginatedResponse<Booking>(res.data);
    return Array.isArray(bookings) ? bookings.map(normalizeBooking) : [];
  } catch (error) {
    console.error('Gagal memuat riwayat booking', error);
    return [];
  }
}

export async function fetchBookingWithFilters(
  status?: string,
  from?: string,
  to?: string
): Promise<Booking[]> {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (from) params.append('date_from', from);
    if (to) params.append('date_to', to);

    const queryString = params.toString();
    const url = queryString
      ? `${apiRoutes.bookings}?${queryString}`
      : apiRoutes.bookings;

    const res = await api.get(url);
    const bookings = handlePaginatedResponse<Booking>(res.data);
    return Array.isArray(bookings) ? bookings.map(normalizeBooking) : [];
  } catch (error) {
    console.error('Gagal memuat booking dengan filter', error);
    return [];
  }
}

export async function fetchBookingDetail(
  bookingId: string
): Promise<Booking | null> {
  try {
    const res = await api.get(`${apiRoutes.bookings}/${bookingId}`);
    const data = unwrapData<any>(res.data);

    // Handle different response structures
    if (data?.results) {
      return normalizeBooking(data.results);
    } else if (data?.data) {
      return normalizeBooking(data.data);
    } else {
      return data ? normalizeBooking(data) : null;
    }
  } catch (error) {
    console.error('Gagal memuat detail booking', error);
    return null;
  }
}

export async function createBooking(
  payload: CreateBookingPayload
): Promise<Booking | null> {
  try {
    // Mapping field dari format frontend ke format backend
    const backendPayload = {
      package_id: payload.packageId,
      total_participants: payload.totalParticipants,
      departure_date: payload.departureDate,
      fullname: payload.fullname,
      email: payload.email,
      phone_number: payload.phoneNumber,
      whatsapp_contact: payload.whatsappContact,
      passport_number: payload.passportNumber,
      passport_expiry: payload.passportExpiry,
      nationality: payload.nationality,
      notes: payload.notes,
      booking_passengers: payload.bookingPassengers,
      payment_method: payload.paymentMethod,
    };

    const res = await api.post(apiRoutes.bookings, backendPayload);
    const data = unwrapData<any>(res.data);

    // Handle different response structures
    if (data?.results) {
      return normalizeBooking(data.results);
    } else if (data?.data) {
      return normalizeBooking(data.data);
    } else {
      return data ? normalizeBooking(data) : null;
    }
  } catch (error) {
    console.error('Gagal membuat booking', error);
    throw error;
  }
}

export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<boolean> {
  try {
    const payload = reason ? { cancel_reason: reason } : {};
    await api.patch(`${apiRoutes.bookings}/${bookingId}/cancel`, payload);
    return true;
  } catch (error) {
    console.error('Gagal membatalkan booking', error);
    return false;
  }
}

export async function downloadTicket(bookingId: string): Promise<Blob | null> {
  try {
    const res = await api.get(
      `${apiRoutes.bookings}/${bookingId}/download-ticket`,
      {
        responseType: 'blob',
      }
    );
    return res.data;
  } catch (error) {
    console.error('Gagal mengunduh tiket', error);
    return null;
  }
}
