import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminReviewsView } from "@/components/admin/AdminReviewsView";
import { listReviews } from "@/lib/repositories/reviews";

export const metadata: Metadata = {
  title: "Отзывы — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default async function AdminReviewsPage() {
  const reviews = await listReviews();

  return (
    <>
      <AdminHeader title="Отзывы" />
      <AdminReviewsView initialReviews={reviews} />
    </>
  );
}
