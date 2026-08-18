import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminBlogForm } from "@/components/admin/AdminBlogForm";
import { getPostById } from "@/lib/repositories/blog";

interface AdminBlogDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminBlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);

  return {
    title: post ? `${post.title} — AGMERZ ADMIN` : "Статья — AGMERZ ADMIN",
    robots: { index: false, follow: false },
  };
}

export default async function AdminBlogDetailPage({ params }: AdminBlogDetailPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <>
      <AdminHeader title={post.title} />
      <AdminBlogForm mode="edit" post={post} />
    </>
  );
}
