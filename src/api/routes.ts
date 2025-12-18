const normalizePrefix = (value?: string | null) => {
  if (!value) return '';
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

export const API_PREFIX = normalizePrefix(
  import.meta.env.VITE_API_PREFIX ?? ''
);

export const apiRoutes = {
  login: `${API_PREFIX}/user/login`,
  register: `${API_PREFIX}/user/register`,
  profile: `${API_PREFIX}/user/profile`,
  logout: `${API_PREFIX}/user/logout`,
  uploadAvatar: `${API_PREFIX}/user/profile/avatar`,
  deleteAvatar: `${API_PREFIX}/user/profile/avatar`,
  forgotPassword: `${API_PREFIX}/user/forgot-password`,
  resetPassword: `${API_PREFIX}/user/reset-password`,
  destinations: `${API_PREFIX}/destinations`,
  destination: (id: string | number) => `${API_PREFIX}/destinations/${id}`,
  articles: `${API_PREFIX}/articles`,
  article: (id: string | number) => `${API_PREFIX}/articles/${id}`,
  community: `${API_PREFIX}/komunitas`,
  orders: `${API_PREFIX}/orders`, // Tetap digunakan untuk endpoint yang lain
  bookings: `${API_PREFIX}/bookings`, // Endpoint untuk booking sesuai dengan backend
  packages: `${API_PREFIX}/packages`,
  package: (id: string | number) => `${API_PREFIX}/packages/${id}`,
  users: `${API_PREFIX}/user`,
  admin: `${API_PREFIX}/admin`, // Endpoint untuk admin API
  payments: `${API_PREFIX}/payments`, // Endpoint untuk pembayaran
  reviews: `${API_PREFIX}/reviews`, // Endpoint untuk review
  dashboard: `${API_PREFIX}/admin/dashboard`, // Endpoint yang lama, tetap untuk kompatibilitas
  wishlists: `${API_PREFIX}/wishlists`, // Endpoint untuk wishlist
  wishlist: (id: string | number) => `${API_PREFIX}/wishlists/${id}`, // Endpoint untuk hapus wishlist item
};
