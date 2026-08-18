import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPropertiesView } from "@/components/admin/AdminPropertiesView";
import { getAdminProperties } from "@/lib/admin-dashboard";

export const metadata: Metadata = {
  title: "Объекты — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default async function AdminPropertiesPage() {
  const properties = await getAdminProperties();

  return (
    <>
      <AdminHeader title="Объекты" />
      <AdminPropertiesView initialProperties={properties} />
    </>
  );
}
