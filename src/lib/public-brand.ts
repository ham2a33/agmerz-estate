import { DEFAULT_STORE_CONFIG } from "@/lib/store-config.types";

const TEST_BRAND_PATTERNS = [/persistence\s*test/i, /persistence-test/i];

/** Maps E2E / test pollution in SiteSettings to the production brand name. */
export function resolvePublicBrandName(agencyName?: string | null): string {
  const value = agencyName?.trim();
  if (!value) return DEFAULT_STORE_CONFIG.brand;
  if (TEST_BRAND_PATTERNS.some((pattern) => pattern.test(value))) {
    return DEFAULT_STORE_CONFIG.brand;
  }
  return value;
}
