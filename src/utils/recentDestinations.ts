import type { Destination } from "../api/destinations";

const STORAGE_KEY = "recent-destinations";

export function pushRecentDestination(dest: Destination) {
  if (typeof window === "undefined") return;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  let stored: Destination[] = [];
  try {
    stored = saved ? JSON.parse(saved) : [];
  } catch {
    stored = [];
  }

  const filtered = stored.filter((item) => item.id !== dest.id);
  stored = [dest, ...filtered].slice(0, 3);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export function readRecentDestinations(): Destination[] {
  if (typeof window === "undefined") return [];
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved) as Destination[];
    return parsed;
  } catch {
    return [];
  }
}
