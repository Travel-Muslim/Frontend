import api from "./axios";
import { apiRoutes } from "./routes";

export interface AdminUser {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  registered?: string;
  role?: string;
}

const unwrapData = <T>(payload: any): T => {
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
};

const normalizeUser = (raw: any): AdminUser => ({
  id: raw?.id ?? raw?._id ?? Date.now(),
  name: raw?.name ?? raw?.fullname ?? raw?.fullName ?? "User",
  email: raw?.email ?? "",
  phone: raw?.phone ?? raw?.phone_number ?? "",
  password: raw?.password,
  registered: raw?.registered ?? raw?.created_at ?? "",
  role: raw?.role ?? raw?.user_role,
});

export async function fetchUsers(): Promise<AdminUser[]> {
  try {
    const res = await api.get(apiRoutes.users);
    const list = unwrapData<any[]>(res.data);
    return Array.isArray(list) ? list.map(normalizeUser) : [];
  } catch (error) {
    console.error("Gagal memuat pengguna", error);
    return [];
  }
}

export async function deleteUser(id: string | number): Promise<boolean> {
  try {
    await api.delete(`${apiRoutes.users}/${id}`);
    return true;
  } catch (error) {
    console.error("Gagal menghapus pengguna", error);
    return false;
  }
}

export async function saveUser(payload: Partial<AdminUser>, id?: string | number): Promise<AdminUser | null> {
  try {
    if (id) {
      const res = await api.put(`${apiRoutes.users}/${id}`, payload);
      return normalizeUser(unwrapData<any>(res.data));
    }
    const res = await api.post(apiRoutes.users, payload);
    return normalizeUser(unwrapData<any>(res.data));
  } catch (error) {
    console.error("Gagal menyimpan pengguna", error);
    throw error;
  }
}
