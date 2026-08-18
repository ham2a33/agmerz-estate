import type { Metadata } from "next";
import { CatalogPage, createCatalogMetadata } from "@/components/catalog/CatalogPage";

export const metadata: Metadata = createCatalogMetadata({
  title: "Квартиры — Каталог AGMERZ ESTATE",
  description: "Квартиры в продаже и аренде от AGMERZ ESTATE. Подберите квартиру в лучших районах Грозного.",
});

export default function ApartmentsCatalogPage() {
  return <CatalogPage categorySlug="apartments" />;
}
