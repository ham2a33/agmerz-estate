import type { RequestStatus } from "./request";

export interface SiteSettings {
  agencyName: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  workingHours: string;
  instagram: string;
  telegram: string;
  tiktok: string;
  facebook: string;
  siteTitle: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  googleAnalyticsId: string;
  language: string;
  currency: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsapp: string;
  contactAddress: string;
  googleMapsUrl: string;
  leadEmail: string;
  leadWhatsapp: string;
  notificationsEnabled: boolean;
  defaultRequestStatus: RequestStatus;
  logoUrl: string;
  faviconUrl: string;
}

export type SiteSettingsUpdateInput = Partial<SiteSettings>;
