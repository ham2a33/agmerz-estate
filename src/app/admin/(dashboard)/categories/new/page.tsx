import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminCategoryForm } from "@/components/admin/AdminCategoryForm";

export const metadata: Metadata = {
  title: "Новая категория — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default function AdminCategoryNewPage() {
  return (
    <>
      <AdminHeader title="Новая категория" />
      <AdminCategoryForm mode="create" />
    </>
  );
}
