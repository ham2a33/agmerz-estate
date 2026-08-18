import "server-only";

import { prisma } from "@/lib/db";
import { mapSettings } from "@/lib/mappers";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings-defaults";
import type { SiteSettings, SiteSettingsUpdateInput } from "@/types";
import type { Prisma } from "@prisma/client";

type DbClient = Prisma.TransactionClient | typeof prisma;

export async function getSettingsRecord(client: DbClient = prisma) {
  const record = await client.siteSettings.findUnique({ where: { id: "default" } });
  if (record) return record;

  return client.siteSettings.create({
    data: {
      id: "default",
      ...DEFAULT_SITE_SETTINGS,
    },
  });
}

export async function getSettings(): Promise<SiteSettings> {
  const record = await getSettingsRecord();
  return mapSettings(record);
}

export async function updateSettings(input: SiteSettingsUpdateInput): Promise<SiteSettings> {
  const record = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: input,
    create: {
      id: "default",
      ...DEFAULT_SITE_SETTINGS,
      ...input,
    },
  });

  return mapSettings(record);
}

export async function getPublicSettings(): Promise<SiteSettings> {
  return getSettings();
}
