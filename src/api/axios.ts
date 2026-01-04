import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only set Content-Type for non-FormData and non-blob requests
    if (!(config.data instanceof FormData) && config.responseType !== 'blob') {
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
    } else if (config.data instanceof FormData) {
      console.log('=== AXIOS INTERCEPTOR: FormData detected ===');
      console.log('Config data:', config.data);
      console.log('Headers before send:', config.headers);
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
      return Promise.reject(new Error('Tidak dapat terhubung ke server'));
    }
    return Promise.reject(new Error('Terjadi kesalahan tak terduga'));
  }
);

export default api;
