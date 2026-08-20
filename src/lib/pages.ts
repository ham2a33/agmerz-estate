import "server-only";

import { prisma } from "@/lib/db";
import { DEFAULT_HOMEPAGE_CONFIG } from "@/lib/homepage-defaults";
import { DEFAULT_PAGES_CONFIG } from "@/lib/pages-defaults";
import { getSettingsRecord } from "@/lib/repositories/settings";
import type { PageHeroConfig, PageKey, PagesConfig } from "@/types/pages";
import { PAGE_KEYS } from "@/types/pages";
import type { PagesUpdateSchema } from "@/lib/validation/pages";
import type { Prisma } from "@prisma/client";

function mergePageHero(
  defaults: PageHeroConfig,
  value: Partial<PageHeroConfig> | undefined,
): PageHeroConfig {
  return {
    title: value?.title ?? defaults.title,
    description: value?.description ?? defaults.description,
    imageUrl: value?.imageUrl ?? defaults.imageUrl,
  };
}

function applyHomepageFallbacks(
  config: PagesConfig,
  homepageConfig: unknown,
): PagesConfig {
  const homepage =
    homepageConfig && typeof homepageConfig === "object"
      ? (homepageConfig as Partial<typeof DEFAULT_HOMEPAGE_CONFIG>)
      : null;

  const sectionImages = homepage?.sectionImages;

  return {
    ...config,
    contacts: mergePageHero(config.contacts, {
      imageUrl:
        config.contacts.imageUrl ||
        sectionImages?.contactHero ||
        DEFAULT_PAGES_CONFIG.contacts.imageUrl,
    }),
    request: mergePageHero(config.request, {
      imageUrl:
        config.request.imageUrl ||
        sectionImages?.requestHero ||
        DEFAULT_PAGES_CONFIG.request.imageUrl,
    }),
  };
}

export function mergePagesConfig(raw: unknown, homepageConfig?: unknown): PagesConfig {
  const value =
    raw && typeof raw === "object" ? (raw as Partial<PagesConfig>) : {};

  const merged = PAGE_KEYS.reduce((acc, key) => {
    acc[key] = mergePageHero(DEFAULT_PAGES_CONFIG[key], value[key]);
    return acc;
  }, {} as PagesConfig);

  return applyHomepageFallbacks(merged, homepageConfig);
}

export async function getPagesConfig(): Promise<PagesConfig> {
  try {
    const record = await getSettingsRecord();
    return mergePagesConfig(record.pagesConfig, record.homepageConfig);
  } catch {
    return DEFAULT_PAGES_CONFIG;
  }
}

export async function updatePagesConfig(input: PagesUpdateSchema): Promise<PagesConfig> {
  const record = await getSettingsRecord();
  const current = mergePagesConfig(record.pagesConfig, record.homepageConfig);

  const next = { ...current };
  for (const key of PAGE_KEYS) {
    if (input[key]) {
      next[key] = mergePageHero(current[key], input[key]);
    }
  }

  await prisma.siteSettings.update({
    where: { id: "default" },
    data: { pagesConfig: next as unknown as Prisma.InputJsonValue },
  });

  return next;
}

export async function getPageHero(pageKey: PageKey): Promise<PageHeroConfig> {
  const config = await getPagesConfig();
  return config[pageKey];
}
