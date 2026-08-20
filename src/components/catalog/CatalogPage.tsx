import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProperties } from "@/lib/properties";
import { getCategoryBySlug } from "@/lib/categories";
import { getCategoryImageUrl } from "@/lib/category-image-fallback";
import { getPagesConfig } from "@/lib/pages";
import type { CatalogCategorySlug } from "@/lib/catalog";
import { CatalogView, CatalogViewFallback } from "@/components/catalog/CatalogView";

interface CatalogPageConfig {
  categorySlug: CatalogCategorySlug;
  title: string;
  description: string;
}

export function createCatalogMetadata({
  title,
  description,
}: Pick<CatalogPageConfig, "title" | "description">): Metadata {
  return { title, description };
}

export async function CatalogPage({ categorySlug }: Pick<CatalogPageConfig, "categorySlug">) {
  const properties = await getAllProperties();

  let heroTitle: string | undefined;
  let heroDescription: string | undefined;
  let heroImageUrl: string | undefined;

  if (categorySlug === "all") {
    const pages = await getPagesConfig();
    heroTitle = pages.catalog.title;
    heroDescription = pages.catalog.description;
    heroImageUrl = pages.catalog.imageUrl || undefined;
  } else {
    const category = await getCategoryBySlug(categorySlug);
    if (category) {
      heroTitle = category.name;
      heroDescription = category.description;
      heroImageUrl = getCategoryImageUrl(category);
    }
  }

  return (
    <Suspense fallback={<CatalogViewFallback />}>
      <CatalogView
        categorySlug={categorySlug}
        properties={properties}
        heroTitle={heroTitle}
        heroDescription={heroDescription}
        heroImageUrl={heroImageUrl}
      />
    </Suspense>
  );
}
