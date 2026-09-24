export type Author = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

export const CATEGORIES = ['All', 'Local', 'India', 'Business', 'Tech', 'Sports'] as const;
export type Category = (typeof CATEGORIES)[number];

export type Story = {
  id: string;
  author: Author;
  category: Exclude<Category, 'All'>;
  headline: string;
  summary: string;
  location: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  videoUrl: string;
  posterUrl: string;
};
