import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminRequestsView } from "@/components/admin/AdminRequestsView";
import { getAllRequests } from "@/lib/requests";

export const metadata: Metadata = {
  title: "Заявки — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default async function AdminRequestsPage() {
  const requests = await getAllRequests();

  return (
    <>
      <AdminHeader title="Заявки" />
      <AdminRequestsView initialRequests={requests} />
    </>
  );
}
