import { mockBlogPosts } from "@/lib/mock-data/blog-posts";
import { articleContents, type ArticleBlock } from "@/lib/blog-content";
import {
  getArticleBlocksForSlug,
  getPostBySlug as getDbPostBySlug,
  listPublishedPosts,
} from "@/lib/repositories/blog";
import { checkDatabaseConnection } from "@/lib/db";
import { logError } from "@/lib/logger";
import type { BlogPost } from "@/types";

export type { ArticleBlock };

async function getPublishedPostsWithFallback(): Promise<BlogPost[]> {
  try {
    const connected = await checkDatabaseConnection();
    if (!connected) {
      return mockBlogPosts
        .filter((post) => post.isPublished)
        .sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return dateB - dateA;
        });
    }

    return await listPublishedPosts();
  } catch (error) {
    logError("blog", error);
    return mockBlogPosts.filter((post) => post.isPublished);
  }
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  return getPublishedPostsWithFallback();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const connected = await checkDatabaseConnection();
    if (connected) {
      const post = await getDbPostBySlug(slug);
      if (post) return post;
    }
  } catch (error) {
    logError("blog:getPostBySlug", error);
  }

  return mockBlogPosts.find((post) => post.slug === slug && post.isPublished);
}

export async function getFeaturedPost(): Promise<BlogPost | null> {
  const published = await getPublishedPosts();
  return published[0] ?? null;
}

export async function getPostsWithoutFeatured(featured: BlogPost | null): Promise<BlogPost[]> {
  const published = await getPublishedPosts();
  if (!featured) return published;
  return published.filter((post) => post.id !== featured.id);
}

export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const published = await getPublishedPosts();
  return published.filter((item) => item.id !== post.id).slice(0, limit);
}

export async function getArticleBlocks(post: BlogPost): Promise<ArticleBlock[]> {
  try {
    const connected = await checkDatabaseConnection();
    if (connected) {
      const blocks = await getArticleBlocksForSlug(post.slug);
      if (blocks && blocks.length > 0) return blocks;
    }
  } catch (error) {
    logError("blog:getArticleBlocks", error);
  }

  const blocks = articleContents[post.slug];
  if (blocks && blocks.length > 0) return blocks;

  if (post.content.trim()) {
    return [{ type: "paragraph", text: post.content }];
  }

  return [{ type: "paragraph", text: post.excerpt }];
}

export async function getReadingTimeMinutes(post: BlogPost): Promise<number | null> {
  const blocks = await getArticleBlocks(post);
  return estimateReadingTimeFromText(
    blocks
      .map((block) => {
        if (block.type === "paragraph" || block.type === "blockquote") return block.text;
        if (block.type === "heading") return block.text;
        if (block.type === "list") return block.items.join(" ");
        return "";
      })
      .join(" "),
  );
}

export function estimateReadingTimeFromPost(post: BlogPost): number | null {
  return estimateReadingTimeFromText([post.excerpt, post.content].filter(Boolean).join(" "));
}

function estimateReadingTimeFromText(text: string): number | null {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return null;

  return Math.max(1, Math.ceil(words / 200));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} мин чтения`;
}

export function getTableOfContents(blocks: ArticleBlock[]): { id: string; text: string; number: string }[] {
  const headings = blocks.filter(
    (block): block is Extract<ArticleBlock, { type: "heading" }> =>
      block.type === "heading" && block.level === 2,
  );

  if (headings.length < 3) return [];

  return headings.map((heading, index) => ({
    id: heading.id,
    text: heading.text,
    number: String(index + 1).padStart(2, "0"),
  }));
}

export function getPostJsonLd(post: BlogPost, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ?? undefined,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    datePublished: post.publishedAt ?? undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
