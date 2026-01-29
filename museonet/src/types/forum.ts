export type ForumCategory = {
  id: number;
  title: string;
  slug: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ForumThread = {
  id: number;
  categoryId: number;
  title: string;
  authorName: string;
  authorEmail: string;
  pinned: boolean;
  locked: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastPostAt: string;
  repliesCount: number;
};

export type ForumPost = {
  id: number;
  threadId: number;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  editedAt: string | null;
  isDeleted: boolean;
};

export type ForumReport = {
  id: number;
  postId: number;
  reporterEmail: string;
  reason: string;
  status: 'open' | 'reviewed' | 'dismissed';
  createdAt: string;
};
