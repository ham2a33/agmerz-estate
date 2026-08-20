import { IMAGE_SLOT_MAP } from "@/lib/image-slots/registry";
import type { Category } from "@/types";

const DEFAULT_FALLBACK_IMAGE =
  IMAGE_SLOT_MAP["category.apartments"]?.defaultUrl ?? "/images/agmerz-estate-logo.png";

export function getCategoryImageUrl(category: Pick<Category, "slug" | "image">): string {
  if (category.image?.trim()) return category.image.trim();

  const slot = IMAGE_SLOT_MAP[`category.${category.slug}`];
  return slot?.defaultUrl ?? DEFAULT_FALLBACK_IMAGE;
}

export interface CategoryCardData {
  slug: string;
  title: string;
  description: string;
  count: number;
  href: string;
  image: string;
}
