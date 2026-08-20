import type { Metadata } from "next";
import { FavoritesContent } from "@/components/favorites/FavoritesContent";
import { getPagesConfig } from "@/lib/pages";
import { resolveImageSlot } from "@/lib/image-slots";

export const metadata: Metadata = {
  title: "Избранное — AGMERZ ESTATE",
  description: "Сохранённые объекты недвижимости AGMERZ ESTATE.",
};

export default async function FavoritesPage() {
  const [pages, heroImage, emptyStateImage] = await Promise.all([
    getPagesConfig(),
    resolveImageSlot("pages.favorites.hero"),
    resolveImageSlot("pages.favorites.empty-state"),
  ]);

  return (
    <FavoritesContent
      hero={{ ...pages.favorites, imageUrl: heroImage.url }}
      emptyStateImage={emptyStateImage}
    />
  );
}
