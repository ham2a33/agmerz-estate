import type { Metadata } from "next";
import { CatalogPage, createCatalogMetadata } from "@/components/catalog/CatalogPage";

export const metadata: Metadata = createCatalogMetadata({
  title: "Коммерция — Каталог AGMERZ ESTATE",
  description: "Коммерческая недвижимость: офисы, торговые и складские помещения от AGMERZ ESTATE.",
});

export default function CommercialCatalogPage() {
  return <CatalogPage categorySlug="commercial" />;
}
