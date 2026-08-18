import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminClientsView } from "@/components/admin/AdminClientsView";
import { getClientsForAdminList } from "@/lib/clients";

export const metadata: Metadata = {
  title: "Клиенты — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default async function AdminClientsPage() {
  const clients = await getClientsForAdminList();

  return (
    <>
      <AdminHeader title="Клиенты" />
      <AdminClientsView initialClients={clients} />
    </>
  );
}
