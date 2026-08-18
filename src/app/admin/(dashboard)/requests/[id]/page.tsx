import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminRequestForm } from "@/components/admin/AdminRequestForm";
import { getRequestById } from "@/lib/requests";

interface AdminRequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminRequestDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const request = await getRequestById(id);

  return {
    title: request ? `Заявка ${request.name} — AGMERZ ADMIN` : "Заявка — AGMERZ ADMIN",
    robots: { index: false, follow: false },
  };
}

export default async function AdminRequestDetailPage({ params }: AdminRequestDetailPageProps) {
  const { id } = await params;
  const request = await getRequestById(id);

  if (!request) {
    notFound();
  }

  return (
    <>
      <AdminHeader title={`Заявка #${request.id}`} />
      <AdminRequestForm request={request} />
    </>
  );
}
