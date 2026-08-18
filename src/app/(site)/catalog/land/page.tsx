import type { Metadata } from "next";
import { CatalogPage, createCatalogMetadata } from "@/components/catalog/CatalogPage";

export const metadata: Metadata = createCatalogMetadata({
  title: "Участки — Каталог AGMERZ ESTATE",
  description: "Земельные участки под строительство и инвестиции от AGMERZ ESTATE.",
});

export default function LandCatalogPage() {
  return <CatalogPage categorySlug="land" />;
}
