export type ArticleStatus = "Selesai" | "Draft";

export type ArticleBlockType = "text" | "image" | "link";

export interface ArticleBlock {
  type: ArticleBlockType;
  value: string;
  label?: string;
}

export interface Article {
  id: number;
  title: string;
  displayDate: string;
  date: string;
  time: string;
  status: ArticleStatus;
  content: string;
  image?: string;
  gallery?: string[];
  link?: string;
  blocks?: ArticleBlock[];
}

// Dummy data dihapus, gunakan API untuk mengisi data artikel.
export const ARTICLES: Article[] = [];
