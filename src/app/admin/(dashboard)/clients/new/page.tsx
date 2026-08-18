import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminClientForm } from "@/components/admin/AdminClientForm";

export const metadata: Metadata = {
  title: "Новый клиент — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default function AdminClientNewPage() {
  return (
    <>
      <AdminHeader title="Новый клиент" />
      <AdminClientForm mode="create" />
    </>
  );
}
