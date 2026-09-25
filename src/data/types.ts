export type Author = {
  id: string;
  name: string;
  handle: string;
  verified: boolean;
  bio: string;
  location: string;
  followers: number;
  following: number;
  /** Background tone for the initials avatar. */
  tone: string;
  avatarUrl?: string | null;
};

export type Story = {
  id: string;
  authorId: string;
  coAuthorIds: string[];
  /** Short topic chip shown on the full-screen player, e.g. "Noida Metro". */
  tag: string;
  headline: string;
  summary: string;
  location: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  videoUrl: string;
  posterUrl: string;
};
