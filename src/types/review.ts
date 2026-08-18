export interface Review {
  id: string;
  name: string;
  avatar: string | null;
  rating: number;
  text: string;
  isPublished: boolean;
  createdAt: string;
}

export type ReviewCreateInput = Omit<Review, "id" | "createdAt">;

export type ReviewUpdateInput = Partial<ReviewCreateInput>;
