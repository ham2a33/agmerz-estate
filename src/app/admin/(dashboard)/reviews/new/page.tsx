import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminReviewForm } from "@/components/admin/AdminReviewForm";

export const metadata: Metadata = {
  title: "Новый отзыв — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default function AdminReviewNewPage() {
  return (
    <>
      <AdminHeader title="Новый отзыв" />
      <AdminReviewForm mode="create" />
    </>
  );
}
