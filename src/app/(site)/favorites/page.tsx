import type { Metadata } from "next";
import { FavoritesContent } from "@/components/favorites/FavoritesContent";

export const metadata: Metadata = {
  title: "Избранное — AGMERZ ESTATE",
  description: "Сохранённые объекты недвижимости AGMERZ ESTATE.",
};

export default function FavoritesPage() {
  return <FavoritesContent />;
}
