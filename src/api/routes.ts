const normalizePrefix = (value?: string | null) => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

export const API_PREFIX = normalizePrefix(import.meta.env.VITE_API_PREFIX ?? "");

export const apiRoutes = {
  login: `${API_PREFIX}/user/login`,
  profile: `${API_PREFIX}/user/profile`,
  register: `${API_PREFIX}/user/register`,
  destinations: `${API_PREFIX}/destinations`,
  destination: (id: string | number) => `${API_PREFIX}/destinations/${id}`,
  articles: `${API_PREFIX}/articles`,
  article: (id: string | number) => `${API_PREFIX}/articles/${id}`,
  community: `${API_PREFIX}/community`,
  orders: `${API_PREFIX}/orders`,
  packages: `${API_PREFIX}/packages`,
  package: (id: string | number) => `${API_PREFIX}/packages/${id}`,
  users: `${API_PREFIX}/users`,
  dashboard: `${API_PREFIX}/admin/dashboard`,
};
