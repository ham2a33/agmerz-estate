export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  publishedAt: string | null;
  isPublished: boolean;
}

export type BlogPostCreateInput = Omit<BlogPost, "id">;

export type BlogPostUpdateInput = Partial<BlogPostCreateInput>;
