import "server-only";

import { getCategoryImageUrl, type CategoryCardData } from "@/lib/category-image-fallback";
import { listActiveCategories } from "@/lib/repositories/categories";
import { countPropertiesByCategorySlug } from "@/lib/repositories/properties";

export async function getCategoryCardsData(): Promise<CategoryCardData[]> {
  const categories = await listActiveCategories();

  return Promise.all(
    categories.map(async (category) => ({
      slug: category.slug,
      title: category.name,
      description: category.description,
      href: `/catalog/${category.slug}`,
      image: getCategoryImageUrl(category),
      count: await countPropertiesByCategorySlug(category.slug),
    })),
  );
}
