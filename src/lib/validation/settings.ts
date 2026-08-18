import { z } from "zod";
import { emailSchema, urlSchema, assetUrlSchema } from "./common";

const requestStatusSchema = z.enum(["new", "in_progress", "completed", "cancelled"]);

export const settingsFormSchema = z.object({
  agencyName: z.string().trim().min(1, "Agency name is required").max(200),
  description: z.string().trim().max(5000).optional().default(""),
  phone: z.string().trim().max(64).optional().default(""),
  whatsapp: z.string().trim().max(64).optional().default(""),
  email: emailSchema.optional().default(""),
  address: z.string().trim().max(500).optional().default(""),
  city: z.string().trim().max(120).optional().default(""),
  workingHours: z.string().trim().max(500).optional().default(""),
  instagram: urlSchema.optional().default(""),
  telegram: urlSchema.optional().default(""),
  tiktok: urlSchema.optional().default(""),
  facebook: urlSchema.optional().default(""),
  siteTitle: z.string().trim().max(200).optional().default(""),
  metaTitle: z.string().trim().max(200).optional().default(""),
  metaDescription: z.string().trim().max(500).optional().default(""),
  ogImage: urlSchema.optional().default(""),
  googleAnalyticsId: z.string().trim().max(64).optional().default(""),
  language: z.string().trim().max(10).optional().default("ru"),
  currency: z.string().trim().max(10).optional().default("₸"),
  contactPhone: z.string().trim().max(64).optional().default(""),
  contactEmail: emailSchema.optional().default(""),
  contactWhatsapp: z.string().trim().max(64).optional().default(""),
  contactAddress: z.string().trim().max(500).optional().default(""),
  googleMapsUrl: urlSchema.optional().default(""),
  leadEmail: emailSchema.optional().default(""),
  leadWhatsapp: z.string().trim().max(64).optional().default(""),
  notificationsEnabled: z.boolean(),
  defaultRequestStatus: requestStatusSchema,
  logoUrl: assetUrlSchema.optional().default(""),
  faviconUrl: assetUrlSchema.optional().default(""),
});

export type SettingsFormSchema = z.infer<typeof settingsFormSchema>;
