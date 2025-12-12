export type StoredUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
};

const STORAGE_KEY = "admin_users";

const defaultUsers: StoredUser[] = [];

export const loadUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUsers;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as StoredUser[];
    return defaultUsers;
  } catch (err) {
    console.error("Failed to load users", err);
    return defaultUsers;
  }
};

export const saveUsers = (list: StoredUser[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export const upsertUser = (user: StoredUser) => {
  const list = loadUsers();
  const idx = list.findIndex((u) => u.id === user.id);
  const next = idx >= 0 ? list.map((u) => (u.id === user.id ? { ...u, ...user } : u)) : [...list, user];
  saveUsers(next);
  return next;
};

export const deleteUser = (id: number) => {
  const next = loadUsers().filter((u) => u.id !== id);
  saveUsers(next);
  return next;
};
