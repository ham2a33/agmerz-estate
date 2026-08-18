import type { Metadata } from "next";
import { CatalogPage, createCatalogMetadata } from "@/components/catalog/CatalogPage";

export const metadata: Metadata = createCatalogMetadata({
  title: "Аренда — Каталог AGMERZ ESTATE",
  description: "Недвижимость в аренду: квартиры, дома и офисы от AGMERZ ESTATE.",
});

export default function RentCatalogPage() {
  return <CatalogPage categorySlug="rent" />;
}
