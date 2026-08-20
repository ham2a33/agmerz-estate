import "server-only";

import { prisma } from "@/lib/db";
import { deleteStoredFile } from "@/lib/media-storage";

export interface MediaRecord {
  id: string;
  url: string;
  type: string;
  alt: string | null;
  title: string | null;
  createdAt: string;
  usage: string[];
}

async function findMediaUsage(url: string): Promise<string[]> {
  const usage: string[] = [];

  const [settings, properties, blogPosts, reviews, categories] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.propertyImage.findMany({ where: { url }, include: { property: true } }),
    prisma.blogPost.findMany({ where: { coverImage: url } }),
    prisma.review.findMany({ where: { avatar: url } }),
    prisma.category.findMany({ where: { image: url } }),
  ]);

  if (settings) {
    if (settings.logoUrl === url) usage.push("Branding: Logo");
    if (settings.faviconUrl === url) usage.push("Branding: Favicon");
    if (settings.ogImage === url) usage.push("SEO: OG Image");

    const config = settings.homepageConfig as Record<string, unknown> | null;
    if (config?.hero && typeof config.hero === "object") {
      const hero = config.hero as Record<string, string>;
      if (hero.imageUrl === url) usage.push("Homepage Hero");
    }
    if (config?.sectionImages && typeof config.sectionImages === "object") {
      const images = config.sectionImages as Record<string, string>;
      if (images.homepageHero === url) usage.push("Homepage Hero");
      if (images.requestHero === url) usage.push("Request Hero");
      if (images.contactHero === url) usage.push("Contact Hero");
    }

    const pagesConfig = settings.pagesConfig as Record<string, { imageUrl?: string }> | null;
    if (pagesConfig) {
      const pageLabels: Record<string, string> = {
        catalog: "Catalog Hero",
        services: "Services Hero",
        about: "About Hero",
        blog: "Blog Hero",
        contacts: "Contacts Hero",
        favorites: "Favorites Hero",
        request: "Request Hero",
      };

      for (const [key, label] of Object.entries(pageLabels)) {
        if (pagesConfig[key]?.imageUrl === url) {
          usage.push(`Page: ${label}`);
        }
      }
    }

    const siteImagesConfig = settings.siteImagesConfig as Record<
      string,
      { url?: string; alt?: string }
    > | null;

    if (siteImagesConfig) {
      for (const [slotId, value] of Object.entries(siteImagesConfig)) {
        if (value?.url === url) {
          usage.push(`Site image: ${slotId}`);
        }
      }
    }
  }

  for (const image of properties) {
    usage.push(`Property: ${image.property.title}`);
  }

  for (const post of blogPosts) {
    usage.push(`Blog: ${post.title}`);
  }

  for (const review of reviews) {
    usage.push(`Review: ${review.name}`);
  }

  for (const category of categories) {
    usage.push(`Category: ${category.name}`);
  }

  return usage;
}

export async function listMedia(): Promise<MediaRecord[]> {
  const records = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return Promise.all(
    records.map(async (record) => ({
      id: record.id,
      url: record.url,
      type: record.type,
      alt: record.alt,
      title: record.title,
      createdAt: record.createdAt.toISOString(),
      usage: await findMediaUsage(record.url),
    })),
  );
}

export async function createMediaRecord(input: {
  url: string;
  type?: string;
  alt?: string | null;
  title?: string | null;
}) {
  const record = await prisma.media.create({
    data: {
      url: input.url,
      type: input.type ?? "image",
      alt: input.alt ?? null,
      title: input.title ?? null,
    },
  });

  return {
    id: record.id,
    url: record.url,
    type: record.type,
    alt: record.alt,
    title: record.title,
    createdAt: record.createdAt.toISOString(),
    usage: await findMediaUsage(record.url),
  };
}

export async function updateMediaRecord(
  id: string,
  input: { alt?: string | null; title?: string | null; url?: string },
) {
  const record = await prisma.media.update({
    where: { id },
    data: input,
  });

  return {
    id: record.id,
    url: record.url,
    type: record.type,
    alt: record.alt,
    title: record.title,
    createdAt: record.createdAt.toISOString(),
    usage: await findMediaUsage(record.url),
  };
}

export async function deleteMediaRecord(id: string): Promise<boolean> {
  const record = await prisma.media.findUnique({ where: { id } });
  if (!record) return false;

  const usage = await findMediaUsage(record.url);
  if (usage.length > 0) {
    throw new Error("Media is in use and cannot be deleted");
  }

  await prisma.media.delete({ where: { id } });
  await deleteStoredFile(record.url);
  return true;
}

export async function getMediaById(id: string) {
  const record = await prisma.media.findUnique({ where: { id } });
  if (!record) return null;

  return {
    id: record.id,
    url: record.url,
    type: record.type,
    alt: record.alt,
    title: record.title,
    createdAt: record.createdAt.toISOString(),
    usage: await findMediaUsage(record.url),
  };
}
