import {
  BlogPost,
  Category,
  Client,
  Property,
  Request,
  Review,
  SiteSettings,
} from "@/types";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings-defaults";

/* In-memory store stub — replace with database integration later */

export const properties: Property[] = [];
export const categories: Category[] = [];
export const requests: Request[] = [];
export const clients: Client[] = [];
export const reviews: Review[] = [];
export const blogPosts: BlogPost[] = [];
export const settings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };
