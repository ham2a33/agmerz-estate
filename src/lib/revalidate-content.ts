import "server-only";

import { revalidatePath } from "next/cache";
import { PAGE_ROUTES, type PageKey } from "@/types/pages";

const PUBLIC_PATHS = [
  "/",
  "/catalog",
  "/about",
  "/services",
  "/request",
  "/contacts",
  "/blog",
  "/reviews",
  "/favorites",
] as const;

export function revalidatePublicContent(paths: string[] = [...PUBLIC_PATHS]) {
  for (const route of paths) {
    revalidatePath(route);
  }
}

export function revalidatePagesContent(pageKeys: string[]) {
  const paths = pageKeys
    .filter((key): key is PageKey => key in PAGE_ROUTES)
    .map((key) => PAGE_ROUTES[key]);

  revalidatePublicContent(paths.length > 0 ? paths : [...PUBLIC_PATHS]);
}

export function revalidatePropertyPages(propertyId?: string) {
  revalidatePublicContent(["/", "/catalog"]);
  if (propertyId) revalidatePath(`/property/${propertyId}`);
}

export function revalidateBlogPages(slug?: string) {
  revalidatePublicContent(["/", "/blog"]);
  if (slug) revalidatePath(`/blog/${slug}`);
}

export function revalidateReviewPages() {
  revalidatePublicContent(["/", "/reviews"]);
}

export function revalidateSettingsPages() {
  revalidatePublicContent();
}

export function revalidateCategoryPages(slug?: string) {
  revalidatePublicContent(["/", "/catalog"]);
  if (slug) {
    revalidatePath(`/catalog/${slug}`);
  }
}
