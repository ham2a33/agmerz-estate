import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminBlogForm } from "@/components/admin/AdminBlogForm";

export const metadata: Metadata = {
  title: "Новая статья — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default function AdminBlogNewPage() {
  return (
    <>
      <AdminHeader title="Новая статья" />
      <AdminBlogForm mode="create" />
    </>
  );
}
