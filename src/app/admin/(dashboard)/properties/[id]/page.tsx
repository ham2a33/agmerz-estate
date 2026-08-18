import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPropertyForm } from "@/components/admin/AdminPropertyForm";
import { getPropertyById } from "@/lib/properties";

interface AdminPropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminPropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  return {
    title: property ? `${property.title} — AGMERZ ADMIN` : "Объект — AGMERZ ADMIN",
    robots: { index: false, follow: false },
  };
}

export default async function AdminPropertyDetailPage({ params }: AdminPropertyDetailPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <>
      <AdminHeader title={property.title} />
      <AdminPropertyForm mode="edit" property={property} />
    </>
  );
}
