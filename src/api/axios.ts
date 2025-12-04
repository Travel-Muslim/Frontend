import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const msg =
        (error.response.data as any)?.message ||
        `Request gagal (${error.response.status})`;
      return Promise.reject(new Error(msg));
    }
    if (error.request) {
      return Promise.reject(new Error("Tidak dapat terhubung ke server"));
    }
    return Promise.reject(new Error("Terjadi kesalahan tak terduga"));
  }
);

export default api;
