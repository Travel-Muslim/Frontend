import api from "./axios";

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
  const res = await api.post<LoginResponse>("/user/login", { email, password });
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

export async function register(
  fullname: string,
  email: string,
  password: string
) {
  await api.post("/user/register", { fullname, email, password });
}

export async function getProfile() {
  const res = await api.get<ProfileResponse>("/user/profile");
  return res.data.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
