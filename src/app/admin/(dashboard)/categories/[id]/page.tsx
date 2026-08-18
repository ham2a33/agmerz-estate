import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminCategoryForm } from "@/components/admin/AdminCategoryForm";
import { countPropertiesInCategory, getCategoryById, isCategoryInUse } from "@/lib/categories";

interface AdminCategoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminCategoryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryById(id);

  return {
    title: category ? `${category.name} — AGMERZ ADMIN` : "Категория — AGMERZ ADMIN",
    robots: { index: false, follow: false },
  };
}

export default async function AdminCategoryDetailPage({ params }: AdminCategoryDetailPageProps) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  const [propertyCount, categoryInUse] = await Promise.all([
    countPropertiesInCategory(category),
    isCategoryInUse(category),
  ]);

  return (
    <>
      <AdminHeader title={category.name} />
      <AdminCategoryForm
        mode="edit"
        category={category}
        propertyCount={propertyCount}
        categoryInUse={categoryInUse}
      />
    </>
  );
}
