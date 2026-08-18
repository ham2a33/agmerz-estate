import "server-only";

import { prisma } from "@/lib/db";
import { DEFAULT_HOMEPAGE_CONFIG } from "@/lib/homepage-defaults";
import { getSettingsRecord } from "@/lib/repositories/settings";
import type { HomepageConfig } from "@/types/homepage";
import type { HomepageUpdateSchema } from "@/lib/validation/homepage";
import type { Prisma } from "@prisma/client";

function mergeHomepageConfig(raw: unknown): HomepageConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_HOMEPAGE_CONFIG;

  const value = raw as Partial<HomepageConfig>;
  return {
    hero: { ...DEFAULT_HOMEPAGE_CONFIG.hero, ...value.hero },
    featured: { ...DEFAULT_HOMEPAGE_CONFIG.featured, ...value.featured },
    aboutSection: { ...DEFAULT_HOMEPAGE_CONFIG.aboutSection, ...value.aboutSection },
    servicesSection: {
      ...DEFAULT_HOMEPAGE_CONFIG.servicesSection,
      ...value.servicesSection,
    },
    contactCta: { ...DEFAULT_HOMEPAGE_CONFIG.contactCta, ...value.contactCta },
    sectionImages: { ...DEFAULT_HOMEPAGE_CONFIG.sectionImages, ...value.sectionImages },
  };
}

export async function getHomepageConfig(): Promise<HomepageConfig> {
  const record = await getSettingsRecord();
  return mergeHomepageConfig(record.homepageConfig);
}

export async function updateHomepageConfig(input: HomepageUpdateSchema): Promise<HomepageConfig> {
  const current = await getHomepageConfig();
  const next = mergeHomepageConfig({
    ...current,
    ...input,
    hero: input.hero ? { ...current.hero, ...input.hero } : current.hero,
    featured: input.featured ? { ...current.featured, ...input.featured } : current.featured,
    aboutSection: input.aboutSection
      ? { ...current.aboutSection, ...input.aboutSection }
      : current.aboutSection,
    servicesSection: input.servicesSection
      ? { ...current.servicesSection, ...input.servicesSection }
      : current.servicesSection,
    contactCta: input.contactCta
      ? { ...current.contactCta, ...input.contactCta }
      : current.contactCta,
    sectionImages: input.sectionImages
      ? { ...current.sectionImages, ...input.sectionImages }
      : current.sectionImages,
  });

  await prisma.siteSettings.update({
    where: { id: "default" },
    data: { homepageConfig: next as unknown as Prisma.InputJsonValue },
  });

  return next;
}
