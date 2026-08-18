import "server-only";

import { DEFAULT_SITE_SETTINGS } from "@/lib/settings-defaults";
import { getSettings } from "@/lib/settings";
import { checkDatabaseConnection } from "@/lib/db";
import { logError } from "@/lib/logger";
import {
  DEFAULT_STORE_CONFIG,
  type StoreConfig,
} from "@/lib/store-config.types";
import { resolvePublicBrandName } from "@/lib/public-brand";
import type { SiteSettings } from "@/types";

function normalizePhoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits
    ? `tel:+${digits.startsWith("7") ? digits : `7${digits}`}`
    : DEFAULT_STORE_CONFIG.phone.href;
}

function normalizeWhatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : DEFAULT_STORE_CONFIG.whatsapp.href;
}

function buildStoreConfig(settings: SiteSettings): StoreConfig {
  const phoneDisplay = settings.contactPhone || settings.phone || DEFAULT_STORE_CONFIG.phone.display;
  const phoneRaw = settings.contactPhone || settings.phone || DEFAULT_STORE_CONFIG.phone.raw;
  const whatsappRaw = settings.contactWhatsapp || settings.whatsapp || DEFAULT_STORE_CONFIG.phone.raw;
  const email = settings.contactEmail || settings.email || DEFAULT_STORE_CONFIG.email.display;
  const addressFull = settings.contactAddress || settings.address || DEFAULT_STORE_CONFIG.address.full;

  return {
    brand: resolvePublicBrandName(settings.agencyName),
    logoUrl: settings.logoUrl || DEFAULT_STORE_CONFIG.logoUrl,
    faviconUrl: settings.faviconUrl || "",
    phone: {
      display: phoneDisplay,
      href: normalizePhoneHref(phoneRaw),
      raw: phoneRaw,
    },
    whatsapp: {
      display: "Написать в WhatsApp",
      href: normalizeWhatsappHref(whatsappRaw),
    },
    email: {
      display: email,
      href: `mailto:${email}`,
    },
    instagram: {
      display: "Instagram",
      href: settings.instagram || DEFAULT_STORE_CONFIG.instagram.href,
    },
    address: {
      city: settings.city || DEFAULT_STORE_CONFIG.address.city,
      region: DEFAULT_STORE_CONFIG.address.region,
      full: addressFull,
    },
    coordinates: DEFAULT_STORE_CONFIG.coordinates,
    mapRouteUrl: settings.googleMapsUrl || DEFAULT_STORE_CONFIG.mapRouteUrl,
    workingHours: settings.workingHours
      ? [{ days: "Режим работы", hours: settings.workingHours }]
      : DEFAULT_STORE_CONFIG.workingHours,
  };
}

export async function getStoreConfig(): Promise<StoreConfig> {
  try {
    const connected = await checkDatabaseConnection();
    if (!connected) return DEFAULT_STORE_CONFIG;

    const settings = await getSettings();
    return buildStoreConfig(settings);
  } catch (error) {
    logError("store-config", error);
    return buildStoreConfig(DEFAULT_SITE_SETTINGS);
  }
}
