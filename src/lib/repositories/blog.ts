import { prisma } from "@/lib/db";
import { getBlogContentBlocks, mapBlogPost } from "@/lib/mappers";
import type { ArticleBlock } from "@/lib/blog-content";
import type { BlogPost } from "@/types";
import type { BlogCreateSchema, BlogUpdateSchema } from "@/lib/validation/blog";

export async function listPublishedPosts(): Promise<BlogPost[]> {
  const records = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return records.map(mapBlogPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const record = await prisma.blogPost.findUnique({ where: { slug } });
  if (!record || !record.isPublished) return null;
  return mapBlogPost(record);
}

export async function getArticleBlocksForSlug(slug: string): Promise<ArticleBlock[] | null> {
  const record = await prisma.blogPost.findUnique({ where: { slug } });
  if (!record) return null;
  return getBlogContentBlocks(record);
}

export async function listPosts(): Promise<BlogPost[]> {
  const records = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return records.map(mapBlogPost);
}

export async function getPostRecordBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const record = await prisma.blogPost.findUnique({ where: { id } });
  return record ? mapBlogPost(record) : null;
}

async function generateBlogPostId(): Promise<string> {
  const records = await prisma.blogPost.findMany({ select: { id: true } });
  const numericIds = records.map((item) => Number(item.id)).filter((value) => Number.isFinite(value));
  return String(numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1);
}

export async function createBlogPost(input: BlogCreateSchema) {
  const contentBlocks = input.contentBlocks as ArticleBlock[] | undefined;
  const id = await generateBlogPostId();
  const record = await prisma.blogPost.create({
    data: {
      id,
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content ?? "",
      contentBlocks: contentBlocks ?? undefined,
      coverImage: input.coverImage ?? null,
      author: input.author ?? "AGMERZ ESTATE",
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      isPublished: input.isPublished ?? false,
    },
  });

  return mapBlogPost(record);
}

export async function updateBlogPost(id: string, input: BlogUpdateSchema) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return null;

  const contentBlocks =
    input.contentBlocks === undefined
      ? undefined
      : (input.contentBlocks as ArticleBlock[] | undefined);

  const record = await prisma.blogPost.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      contentBlocks,
      coverImage: input.coverImage,
      author: input.author,
      publishedAt:
        input.publishedAt === undefined
          ? undefined
          : input.publishedAt
            ? new Date(input.publishedAt)
            : null,
      isPublished: input.isPublished,
    },
  });

  return mapBlogPost(record);
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    await prisma.blogPost.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function isBlogSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (!existing) return true;
  return excludeId ? existing.id === excludeId : false;
}
