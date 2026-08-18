import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminHomepageView } from "@/components/admin/AdminHomepageView";
import { getHomepageConfig } from "@/lib/homepage";
import { listFeaturedProperties } from "@/lib/repositories/properties";

export const metadata: Metadata = {
  title: "Главная — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default async function AdminHomepagePage() {
  const [config, featuredProperties] = await Promise.all([
    getHomepageConfig(),
    listFeaturedProperties(),
  ]);

  return (
    <>
      <AdminHeader title="Главная" />
      <AdminHomepageView
        initialConfig={config}
        initialFeaturedProperties={featuredProperties}
      />
    </>
  );
}
