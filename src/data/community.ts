export interface CommunityPost {
  id: number;
  title: string;
  body: string;
  author: string;
  rating: number;
  timeAgo: string;
  avatar: string;
}

// Dummy data dihapus, gunakan API untuk mengisi data komunitas.
export const COMMUNITY_POSTS: CommunityPost[] = [];
