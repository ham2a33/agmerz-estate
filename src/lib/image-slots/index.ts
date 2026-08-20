import "server-only";

import { prisma } from "@/lib/db";
import { getHomepageConfig, updateHomepageConfig } from "@/lib/homepage";
import { getPagesConfig, updatePagesConfig } from "@/lib/pages";
import { getSettingsRecord, updateSettings } from "@/lib/repositories/settings";
import { getCategoryBySlug, setCategoryImage } from "@/lib/categories";
import type { PageKey } from "@/types/pages";
import {
  IMAGE_SLOT_REGISTRY,
  PROPERTY_FALLBACK_TYPES,
  getImageSlotDefinition,
} from "./registry";
export {
  IMAGE_SLOT_REGISTRY,
  IMAGE_SLOT_MAP,
  IMAGE_SLOT_GROUPS,
  SERVICE_OVERVIEW_SLOT_MAP,
  PROPERTY_FALLBACK_TYPES,
  getImageSlotDefinition,
} from "./registry";
import type {
  ImageSlotValue,
  ResolvedImageSlot,
  SiteImagesConfig,
} from "./types";
import type { PropertyType } from "@/types";

function mergeSlotValue(
  definition: { defaultUrl: string; defaultAlt: string },
  stored?: Partial<ImageSlotValue>,
  externalUrl?: string,
): ImageSlotValue {
  const url = stored?.url?.trim() || externalUrl?.trim() || definition.defaultUrl;
  const alt = stored?.alt?.trim() || definition.defaultAlt;
  return { url, alt };
}

function readHomepageExternalUrl(
  homepageConfig: Awaited<ReturnType<typeof getHomepageConfig>>,
  field: "hero.imageUrl" | "sectionImages.requestHero" | "sectionImages.contactHero",
): string {
  if (field === "hero.imageUrl") return homepageConfig.hero.imageUrl;
  if (field === "sectionImages.requestHero") return homepageConfig.sectionImages.requestHero;
  return homepageConfig.sectionImages.contactHero;
}

async function readExternalUrl(
  definition: NonNullable<ReturnType<typeof getImageSlotDefinition>>,
  context: {
    homepageConfig: Awaited<ReturnType<typeof getHomepageConfig>>;
    pagesConfig: Awaited<ReturnType<typeof getPagesConfig>>;
    settings: Awaited<ReturnType<typeof getSettingsRecord>>;
    categoryImages: Record<string, string | null>;
  },
): Promise<string> {
  switch (definition.storage.type) {
    case "homepageConfig":
      return readHomepageExternalUrl(context.homepageConfig, definition.storage.field);
    case "pagesConfig":
      return context.pagesConfig[definition.storage.pageKey as PageKey]?.imageUrl ?? "";
    case "settings":
      return context.settings[definition.storage.field] ?? "";
    case "category":
      return context.categoryImages[definition.storage.slug] ?? "";
    default:
      return "";
  }
}

async function loadCategoryImages(): Promise<Record<string, string | null>> {
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true, image: true },
    });
    return Object.fromEntries(categories.map((category) => [category.slug, category.image]));
  } catch {
    return {};
  }
}

export async function getSiteImagesConfig(): Promise<SiteImagesConfig> {
  try {
    const record = await getSettingsRecord();
    if (!record.siteImagesConfig || typeof record.siteImagesConfig !== "object") {
      return {};
    }
    return record.siteImagesConfig as SiteImagesConfig;
  } catch {
    return {};
  }
}

export async function resolveImageSlot(id: string): Promise<ImageSlotValue> {
  const definition = getImageSlotDefinition(id);
  if (!definition) {
    return { url: "", alt: "" };
  }

  if (definition.storage.type === "dynamic") {
    return { url: definition.defaultUrl, alt: definition.defaultAlt };
  }

  try {
    const [stored, homepageConfig, pagesConfig, settings, categoryImages] = await Promise.all([
      getSiteImagesConfig(),
      getHomepageConfig(),
      getPagesConfig(),
      getSettingsRecord(),
      loadCategoryImages(),
    ]);

    const externalUrl = await readExternalUrl(definition, {
      homepageConfig,
      pagesConfig,
      settings,
      categoryImages,
    });

    return mergeSlotValue(definition, stored[id], externalUrl);
  } catch {
    return mergeSlotValue(definition, undefined, "");
  }
}

export async function resolveAllImageSlots(): Promise<ResolvedImageSlot[]> {
  try {
    const [stored, homepageConfig, pagesConfig, settings, categoryImages] = await Promise.all([
      getSiteImagesConfig(),
      getHomepageConfig(),
      getPagesConfig(),
      getSettingsRecord(),
      loadCategoryImages(),
    ]);

    const context = { homepageConfig, pagesConfig, settings, categoryImages };

    return Promise.all(
      IMAGE_SLOT_REGISTRY.map(async (definition) => {
        const isDynamic = definition.storage.type === "dynamic";
        const externalUrl = isDynamic
          ? ""
          : await readExternalUrl(definition, context);
        const value = mergeSlotValue(definition, stored[definition.id], externalUrl);

        return {
          id: definition.id,
          group: definition.group,
          label: definition.label,
          usage: definition.usage,
          url: value.url,
          alt: value.alt,
          editable: !isDynamic,
          adminPath:
            definition.storage.type === "dynamic" ? definition.storage.adminPath : undefined,
        };
      }),
    );
  } catch {
    return IMAGE_SLOT_REGISTRY.map((definition) => ({
      id: definition.id,
      group: definition.group,
      label: definition.label,
      usage: definition.usage,
      url: definition.defaultUrl,
      alt: definition.defaultAlt,
      editable: definition.storage.type !== "dynamic",
      adminPath:
        definition.storage.type === "dynamic" ? definition.storage.adminPath : undefined,
    }));
  }
}

export async function resolveImageSlotMap(ids: string[]): Promise<Record<string, ImageSlotValue>> {
  const entries = await Promise.all(ids.map(async (id) => [id, await resolveImageSlot(id)] as const));
  return Object.fromEntries(entries);
}

export async function updateImageSlot(
  id: string,
  input: Partial<ImageSlotValue>,
): Promise<ImageSlotValue> {
  const definition = getImageSlotDefinition(id);
  if (!definition || definition.storage.type === "dynamic") {
    throw new Error("Slot is not editable");
  }

  const current = await resolveImageSlot(id);
  const next: ImageSlotValue = {
    url: input.url !== undefined ? input.url : current.url,
    alt: input.alt !== undefined ? input.alt : current.alt,
  };

  switch (definition.storage.type) {
    case "siteImages": {
      const stored = await getSiteImagesConfig();
      const updated: SiteImagesConfig = {
        ...stored,
        [id]: { url: next.url, alt: next.alt },
      };
      await prisma.siteSettings.update({
        where: { id: "default" },
        data: { siteImagesConfig: updated },
      });
      break;
    }
    case "pagesConfig":
      await updatePagesConfig({
        [definition.storage.pageKey as PageKey]: { imageUrl: next.url },
      });
      await persistSlotAlt(id, next.alt);
      break;
    case "homepageConfig":
      if (definition.storage.field === "hero.imageUrl") {
        await updateHomepageConfig({ hero: { imageUrl: next.url } });
      } else if (definition.storage.field === "sectionImages.requestHero") {
        await updateHomepageConfig({ sectionImages: { requestHero: next.url } });
      } else {
        await updateHomepageConfig({ sectionImages: { contactHero: next.url } });
      }
      await persistSlotAlt(id, next.alt);
      break;
    case "settings":
      await updateSettings({ [definition.storage.field]: next.url });
      await persistSlotAlt(id, next.alt);
      break;
    case "category": {
      const category = await getCategoryBySlug(definition.storage.slug);
      if (!category) throw new Error("Category not found");
      if (next.url) {
        await setCategoryImage(category.id, next.url);
      } else {
        await setCategoryImage(category.id, null);
      }
      await persistSlotAlt(id, next.alt);
      break;
    }
  }

  return resolveImageSlot(id);
}

async function persistSlotAlt(id: string, alt: string) {
  const stored = await getSiteImagesConfig();
  const updated: SiteImagesConfig = {
    ...stored,
    [id]: { ...(stored[id] ?? {}), alt },
  };
  await prisma.siteSettings.update({
    where: { id: "default" },
    data: { siteImagesConfig: updated },
  });
}

export async function clearImageSlot(id: string): Promise<ImageSlotValue> {
  const definition = getImageSlotDefinition(id);
  if (!definition || definition.storage.type === "dynamic") {
    throw new Error("Slot is not editable");
  }

  switch (definition.storage.type) {
    case "siteImages": {
      const stored = await getSiteImagesConfig();
      const updated = { ...stored };
      delete updated[id];
      await prisma.siteSettings.update({
        where: { id: "default" },
        data: { siteImagesConfig: updated },
      });
      break;
    }
    case "pagesConfig":
      await updatePagesConfig({
        [definition.storage.pageKey as PageKey]: { imageUrl: "" },
      });
      break;
    case "homepageConfig":
      if (definition.storage.field === "hero.imageUrl") {
        await updateHomepageConfig({ hero: { imageUrl: "" } });
      } else if (definition.storage.field === "sectionImages.requestHero") {
        await updateHomepageConfig({ sectionImages: { requestHero: "" } });
      } else {
        await updateHomepageConfig({ sectionImages: { contactHero: "" } });
      }
      break;
    case "settings":
      await updateSettings({ [definition.storage.field]: "" });
      break;
    case "category": {
      const category = await getCategoryBySlug(definition.storage.slug);
      if (category) await setCategoryImage(category.id, null);
      break;
    }
  }

  return resolveImageSlot(id);
}

export async function getPropertyFallbackPools(): Promise<Record<PropertyType, string[]>> {
  const pools = {} as Record<PropertyType, string[]>;

  for (const type of PROPERTY_FALLBACK_TYPES) {
    const urls: string[] = [];
    for (let index = 1; index <= 4; index += 1) {
      const slot = await resolveImageSlot(`property.fallback.${type}.${index}`);
      if (slot.url) urls.push(slot.url);
    }
    pools[type as PropertyType] = urls.length > 0 ? urls : [];
  }

  return pools;
}

export function getSlotUsageLabels(id: string): string[] {
  const definition = getImageSlotDefinition(id);
  if (!definition) return [];
  return [`${definition.group} → ${definition.label}`];
}
