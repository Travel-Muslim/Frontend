import api from "./axios";
import { apiRoutes } from "./routes";

export type User = {
  id: string;
  fullname: string;
  email: string;
  role: string;
  avatar_url?: string;
};

type LoginResponse = {
  data: {
    id: string;
    fullname: string;
    email: string;
    role: string;
    avatar_url?: string;
    token: string;
    refreshToken?: string;
  };
};

type ProfileResponse = {
  data: User;
};

export async function login(email: string, password: string) {
  const res = await api.post<LoginResponse>(apiRoutes.login, { email, password });
  const user = res.data.data;

  // simpan ke localStorage
  localStorage.setItem("token", user.token);
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
    })
  );

  return user;
}

export function isAdminUser(email?: string) {
  return email?.toLowerCase().includes("admin");
}

export async function register(fullname: string, email: string, password: string) {
  const payload = { fullname, email, password, phone: "" };
  const res = await api.post<{ data?: Partial<User> & { token?: string } }>(apiRoutes.register, payload);
  const data = res.data?.data ?? {};

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  const user: User = {
    id: data.id || "",
    fullname: data.fullname || fullname,
    email: data.email || email,
    role: data.role || "user",
    avatar_url: data.avatar_url,
  };

  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export async function getProfile() {
  const raw = localStorage.getItem("user");
  if (raw) return JSON.parse(raw) as User;
  const res = await api.get<ProfileResponse>(apiRoutes.profile);
  return res.data.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
