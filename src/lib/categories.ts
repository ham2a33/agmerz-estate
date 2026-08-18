import type { Category } from "@/types";
import {
  isCategoryInUse as isCategoryInUseById,
} from "@/lib/repositories/categories";
import { countPropertiesByCategorySlug } from "@/lib/repositories/properties";

export * from "@/lib/repositories/categories";

export async function countPropertiesInCategory(category: Category): Promise<number> {
  return countPropertiesByCategorySlug(category.slug);
}

export async function isCategoryInUse(category: Category): Promise<boolean> {
  return isCategoryInUseById(category.id);
}

export type AdminCategoryListItem = Category & {
  propertyCount: number;
  inUse: boolean;
};

export async function getCategoriesForAdminList(): Promise<AdminCategoryListItem[]> {
  const { getAllCategories } = await import("@/lib/repositories/categories");
  const categories = await getAllCategories();

  return Promise.all(
    categories.map(async (category) => ({
      ...category,
      propertyCount: await countPropertiesInCategory(category),
      inUse: await isCategoryInUse(category),
    })),
  );
}
