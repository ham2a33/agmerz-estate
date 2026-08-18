import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminBlogView } from "@/components/admin/AdminBlogView";
import { listPosts } from "@/lib/repositories/blog";

export const metadata: Metadata = {
  title: "Блог — AGMERZ ADMIN",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const posts = await listPosts();

  return (
    <>
      <AdminHeader title="Блог" />
      <AdminBlogView initialPosts={posts} />
    </>
  );
}
