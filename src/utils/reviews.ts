export interface UserReview {
  id: number;
  destId: number;
  title?: string;
  packageName?: string;
  rating: number;
  text: string;
  image?: string | null;
  createdAt: string;
}

const STORAGE_KEY = "destination-reviews";

interface ReviewStorageShape {
  [destId: string]: UserReview[];
}

const safeParse = (value: string | null): ReviewStorageShape => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as ReviewStorageShape;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export function readReviews(destId: number): UserReview[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  const store = safeParse(raw);
  return store[String(destId)] ?? [];
}

export function saveReview(review: UserReview) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const store = safeParse(raw);
  const bucket = store[String(review.destId)] ?? [];
  store[String(review.destId)] = [review, ...bucket];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
