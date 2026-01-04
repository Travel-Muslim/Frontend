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
  user_id?: string;
  package_id?: string;
  booking_id?: string;
  booking_code?: string;
  booking_date?: string;
  booking_departure_date?: string;
  booking_return_date?: string;
  booking_total_participants?: number;
  booking_total_price?: string;
  booking_status?: BookingStatus;
  booking_payment_status?: PaymentStatus;
  booking_payment_deadline?: string;
  booking_fullname?: string;
  booking_phone_number?: string;
  booking_email?: string;
  booking_passport_number?: string;
  booking_passport_expiry?: string;
  booking_nationality?: string;
  package_name?: string;
  package_image?: string;
  package_location?: string;
  package_benua?: string;
  package_periode_start?: string;
  package_periode_end?: string;
  package_maskapai?: string;
  package_bandara?: string;
  has_review?: boolean;
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
  // Backend sends 'id', frontend uses 'booking_id'
  booking_id: raw?.booking_id || raw?.id,
  user_id: raw?.user_id,
  package_id: raw?.package_id,
  booking_code: raw?.booking_code,
  // Handle both formats for dates
  booking_date: raw?.booking_date,
  booking_departure_date: raw?.booking_departure_date || raw?.departure_date,
  booking_return_date: raw?.booking_return_date || raw?.return_date,
  booking_total_participants:
    raw?.booking_total_participants || raw?.total_participants,
  booking_total_price: raw?.booking_total_price || raw?.total_price,
  booking_status: raw?.booking_status || raw?.status,
  booking_payment_status: raw?.booking_payment_status || raw?.payment_status,
  booking_payment_deadline:
    raw?.booking_payment_deadline || raw?.payment_deadline,
  booking_fullname: raw?.booking_fullname || raw?.fullname || raw?.full_name,
  booking_phone_number: raw?.booking_phone_number || raw?.phone_number,
  booking_email: raw?.booking_email || raw?.email,
  booking_passport_number: raw?.booking_passport_number || raw?.passport_number,
  booking_passport_expiry: raw?.booking_passport_expiry || raw?.passport_expiry,
  booking_nationality: raw?.booking_nationality || raw?.nationality,
  package_name: raw?.package_name,
  package_image: raw?.package_image,
  package_location: raw?.package_location || raw?.destination_name,
  package_benua: raw?.package_benua || raw?.destination_location,
  package_periode_start: raw?.package_periode_start,
  package_periode_end: raw?.package_periode_end,
  package_maskapai: raw?.package_maskapai,
  package_bandara: raw?.package_bandara,
  has_review: raw?.has_review || raw?.hasReview || false,
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
    const normalized = Array.isArray(bookings)
      ? bookings.map(normalizeBooking)
      : [];
    return normalized;
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
    console.log('Fetching booking detail for ID:', bookingId);
    const res = await api.get(`${apiRoutes.bookings}/${bookingId}`);
    console.log('Raw booking response:', res.data);
    const data = unwrapData<any>(res.data);
    console.log('Unwrapped data:', data);

    // Handle different response structures
    let rawBooking = null;
    if (data?.results) {
      rawBooking = data.results;
    } else if (data?.data) {
      rawBooking = data.data;
    } else {
      rawBooking = data;
    }

    console.log('Raw booking before normalize:', rawBooking);
    const normalized = rawBooking ? normalizeBooking(rawBooking) : null;
    console.log('Normalized booking:', normalized);

    return normalized;
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
    console.log('Downloading ticket for booking ID:', bookingId);
    const res = await api.get(
      `${apiRoutes.bookings}/${bookingId}/download-ticket`,
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf',
        },
      }
    );
    console.log('Ticket download response:', res);
    return res.data;
  } catch (error) {
    console.error('Gagal mengunduh tiket', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    return null;
  }
}
