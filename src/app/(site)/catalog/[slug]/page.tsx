import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { getCategoryBySlug } from "@/lib/categories";
import { isKnownCatalogCategorySlug } from "@/lib/catalog";

interface DynamicCatalogPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: DynamicCatalogPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isKnownCatalogCategorySlug(slug)) {
    return { title: "Каталог — AGMERZ ESTATE" };
  }

  const category = await getCategoryBySlug(slug);
  if (!category) {
    return { title: "Категория не найдена — AGMERZ ESTATE" };
  }

  return {
    title: `${category.name} — Каталог AGMERZ ESTATE`,
    description: category.description || undefined,
  };
}

export default async function DynamicCatalogPage({ params }: DynamicCatalogPageProps) {
  const { slug } = await params;

  if (isKnownCatalogCategorySlug(slug)) {
    notFound();
  }

  const category = await getCategoryBySlug(slug);
  if (!category || !category.isActive) {
    notFound();
  }

  return <CatalogPage categorySlug={slug} />;
}
