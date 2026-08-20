import type { Metadata } from "next";
import { FavoritesContent } from "@/components/favorites/FavoritesContent";
import { getPagesConfig } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Избранное — AGMERZ ESTATE",
  description: "Сохранённые объекты недвижимости AGMERZ ESTATE.",
};

export default async function FavoritesPage() {
  const pages = await getPagesConfig();

  return <FavoritesContent hero={pages.favorites} />;
}
