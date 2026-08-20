import type { Metadata } from "next";
import { BlogHero } from "@/components/blog/BlogHero";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { getFeaturedPost, getPostsWithoutFeatured } from "@/lib/blog";
import { getPagesConfig } from "@/lib/pages";
import { resolveImageSlot } from "@/lib/image-slots";

export const metadata: Metadata = {
  title: "Блог — AGMERZ ESTATE",
  description:
    "Полезные статьи AGMERZ ESTATE о недвижимости, покупке, продаже, аренде и рынке.",
};

export default async function BlogPage() {
  const [featuredPost, pages, heroImage] = await Promise.all([
    getFeaturedPost(),
    getPagesConfig(),
    resolveImageSlot("pages.blog.hero"),
  ]);
  const gridPosts = await getPostsWithoutFeatured(featuredPost);

  return (
    <>
      <BlogHero
        hero={{
          ...pages.blog,
          imageUrl: heroImage.url,
        }}
      />
      {featuredPost && <FeaturedPost post={featuredPost} />}
      {gridPosts.length > 0 && <BlogGrid posts={gridPosts} />}
    </>
  );
}
