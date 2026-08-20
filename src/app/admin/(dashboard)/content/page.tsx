import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminContentView } from "@/components/admin/AdminContentView";
import { getPagesConfig } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Контент сайта — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default async function AdminContentPage() {
  const config = await getPagesConfig();

  return (
    <>
      <AdminHeader title="Контент сайта" />
      <AdminContentView initialConfig={config} />
    </>
  );
}
