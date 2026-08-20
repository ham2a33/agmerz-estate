import type { Metadata } from "next";
import { BlogHero } from "@/components/blog/BlogHero";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { getFeaturedPost, getPostsWithoutFeatured } from "@/lib/blog";
import { getPagesConfig } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Блог — AGMERZ ESTATE",
  description:
    "Полезные статьи AGMERZ ESTATE о недвижимости, покупке, продаже, аренде и рынке.",
};

export default async function BlogPage() {
  const [featuredPost, pages] = await Promise.all([getFeaturedPost(), getPagesConfig()]);
  const gridPosts = await getPostsWithoutFeatured(featuredPost);

  return (
    <>
      <BlogHero hero={pages.blog} />
      {featuredPost && <FeaturedPost post={featuredPost} />}
      {gridPosts.length > 0 && <BlogGrid posts={gridPosts} />}
    </>
  );
}
