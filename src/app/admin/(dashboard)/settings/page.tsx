import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSettingsForm } from "@/components/admin/AdminSettingsForm";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Настройки — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <>
      <AdminHeader title="Настройки" />
      <AdminSettingsForm initialSettings={settings} />
    </>
  );
}
