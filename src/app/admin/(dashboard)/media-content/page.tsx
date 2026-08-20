import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMediaContentView } from "@/components/admin/AdminMediaContentView";
import { resolveAllImageSlots } from "@/lib/image-slots";

export const metadata: Metadata = {
  title: "Изображения сайта — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default async function AdminMediaContentPage() {
  const slots = await resolveAllImageSlots();

  return (
    <>
      <AdminHeader title="Изображения сайта" />
      <AdminMediaContentView initialSlots={slots} />
    </>
  );
}
