import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminClientForm } from "@/components/admin/AdminClientForm";
import {
  getClientById,
  getClientFullName,
  getPropertiesForClient,
  getRequestsForClient,
} from "@/lib/clients";

interface AdminClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminClientDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const client = await getClientById(id);

  return {
    title: client
      ? `${getClientFullName(client)} — AGMERZ ADMIN`
      : "Клиент — AGMERZ ADMIN",
    robots: { index: false, follow: false },
  };
}

export default async function AdminClientDetailPage({ params }: AdminClientDetailPageProps) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  const [relatedRequests, relatedProperties] = await Promise.all([
    getRequestsForClient(id),
    getPropertiesForClient(id),
  ]);

  return (
    <>
      <AdminHeader title={getClientFullName(client)} />
      <AdminClientForm
        mode="edit"
        client={client}
        relatedRequests={relatedRequests}
        relatedProperties={relatedProperties}
      />
    </>
  );
}
