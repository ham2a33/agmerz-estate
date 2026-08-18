import { mockCategories } from "@/lib/mock-data/categories";
import type { Category } from "@/types";

const FALLBACK_IMAGES = Object.fromEntries(
  mockCategories.map((category) => [category.slug, category.image]),
) as Record<string, string>;

const DEFAULT_FALLBACK_IMAGE = mockCategories[0]?.image ?? "/images/agmerz-estate-logo.png";

export function getCategoryImageUrl(category: Pick<Category, "slug" | "image">): string {
  if (category.image?.trim()) return category.image.trim();
  return FALLBACK_IMAGES[category.slug] ?? DEFAULT_FALLBACK_IMAGE;
}

export interface CategoryCardData {
  slug: string;
  title: string;
  description: string;
  count: number;
  href: string;
  image: string;
}
