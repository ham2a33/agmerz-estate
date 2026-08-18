export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
}

export type CategoryCreateInput = Omit<Category, "id">;

export type CategoryUpdateInput = Partial<CategoryCreateInput>;
