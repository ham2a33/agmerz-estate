import "server-only";

import { getCategoryImageUrl, type CategoryCardData } from "@/lib/category-image-fallback";
import { mockCategories } from "@/lib/mock-data/categories";
import { listActiveCategories } from "@/lib/repositories/categories";
import { countPropertiesByCategorySlug } from "@/lib/repositories/properties";

export async function getCategoryCardsData(): Promise<CategoryCardData[]> {
  const categories = await listActiveCategories();

  return Promise.all(
    categories.map(async (category) => {
      const fallbackCount =
        mockCategories.find((item) => item.slug === category.slug)?.count ?? 0;

      let count = fallbackCount;
      try {
        count = await countPropertiesByCategorySlug(category.slug);
      } catch {
        // Use mock count when database is unavailable (e.g. Docker build).
      }

      return {
        slug: category.slug,
        title: category.name,
        description: category.description,
        href: `/catalog/${category.slug}`,
        image: getCategoryImageUrl(category),
        count,
      };
    }),
  );
}
