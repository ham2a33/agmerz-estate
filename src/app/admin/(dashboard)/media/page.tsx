import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMediaView } from "@/components/admin/AdminMediaView";

export const metadata: Metadata = {
  title: "Медиа — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default function AdminMediaPage() {
  return (
    <>
      <AdminHeader title="Медиа" />
      <AdminMediaView />
    </>
  );
}
