import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminCategoriesView } from "@/components/admin/AdminCategoriesView";
import { getCategoriesForAdminList } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Категории — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesForAdminList();

  return (
    <>
      <AdminHeader title="Категории" />
      <AdminCategoriesView initialCategories={categories} />
    </>
  );
}
