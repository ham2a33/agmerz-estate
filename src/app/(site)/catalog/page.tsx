import type { Metadata } from "next";
import { CatalogPage, createCatalogMetadata } from "@/components/catalog/CatalogPage";

export const metadata: Metadata = createCatalogMetadata({
  title: "Каталог недвижимости — AGMERZ ESTATE",
  description:
    "Квартиры, дома, коммерческая недвижимость и участки от AGMERZ ESTATE. Подберите подходящий объект.",
});

export default function CatalogPageRoute() {
  return <CatalogPage categorySlug="all" />;
}
