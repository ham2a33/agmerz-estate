import type { Metadata } from "next";
import { CatalogPage, createCatalogMetadata } from "@/components/catalog/CatalogPage";

export const metadata: Metadata = createCatalogMetadata({
  title: "Дома — Каталог AGMERZ ESTATE",
  description: "Коттеджи, таунхаусы и загородные дома от AGMERZ ESTATE.",
});

export default function HousesCatalogPage() {
  return <CatalogPage categorySlug="houses" />;
}
