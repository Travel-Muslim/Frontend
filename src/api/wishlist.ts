import api from './axios';
import { apiRoutes } from './routes';

export interface TourPackage {
  id: string;
  title: string;
  destination_country: string;
  price_per_pax: number;
  thumbnail_url: string;
}

export interface WishlistItem {
  id: string;
  created_at: string;
  tour_package: TourPackage;
}

export interface AddToWishlistPayload {
  tour_package_id: string;
}

const unwrapData = <T>(payload: any): T => {
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
};

// Menangani respons paginasi dari backend
const handlePaginatedResponse = <T>(response: any): T[] => {
  const data = unwrapData<any>(response);
  if (data.results && Array.isArray(data.results)) {
    return data.results;
  } else if (data.data && Array.isArray(data.data)) {
    return data.data;
  } else if (Array.isArray(data)) {
    return data;
  }
  return [];
};

/**
 * Get user wishlist
 * @returns Promise with array of wishlist items
 */
export async function fetchWishlist(): Promise<WishlistItem[]> {
  try {
    const res = await api.get(apiRoutes.wishlists);
    const wishlist = handlePaginatedResponse<WishlistItem>(res.data);
    return Array.isArray(wishlist) ? wishlist : [];
  } catch (error) {
    console.error('Gagal memuat wishlist', error);
    return [];
  }
}

/**
 * Add package to wishlist
 * @param payload - Object containing tour_package_id
 * @returns Promise with added wishlist item
 */
export async function addToWishlist(
  payload: AddToWishlistPayload
): Promise<WishlistItem | null> {
  try {
    const res = await api.post(apiRoutes.wishlists, payload);
    const data = unwrapData<any>(res.data);

    if (data?.results) {
      return data.results;
    } else if (data?.data) {
      return data.data;
    } else {
      return data;
    }
  } catch (error) {
    console.error('Gagal menambahkan ke wishlist', error);
    throw error;
  }
}

/**
 * Remove package from wishlist
 * @param id - Wishlist item ID
 * @returns Promise with success status
 */
export async function removeFromWishlist(id: string): Promise<boolean> {
  try {
    await api.delete(apiRoutes.wishlist(id));
    return true;
  } catch (error) {
    console.error('Gagal menghapus dari wishlist', error);
    throw error;
  }
}
