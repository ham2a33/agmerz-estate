import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPropertyForm } from "@/components/admin/AdminPropertyForm";

export const metadata: Metadata = {
  title: "Новый объект — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default function AdminNewPropertyPage() {
  return (
    <>
      <AdminHeader title="Новый объект" />
      <AdminPropertyForm mode="create" />
    </>
  );
}
