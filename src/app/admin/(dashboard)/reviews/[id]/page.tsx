import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminReviewForm } from "@/components/admin/AdminReviewForm";
import { getReviewById } from "@/lib/repositories/reviews";

interface AdminReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminReviewDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const review = await getReviewById(id);

  return {
    title: review ? `${review.name} — AGMERZ ADMIN` : "Отзыв — AGMERZ ADMIN",
    robots: { index: false, follow: false },
  };
}

export default async function AdminReviewDetailPage({ params }: AdminReviewDetailPageProps) {
  const { id } = await params;
  const review = await getReviewById(id);

  if (!review) {
    notFound();
  }

  return (
    <>
      <AdminHeader title={review.name} />
      <AdminReviewForm mode="edit" review={review} />
    </>
  );
}
