export interface ImageSlotValue {
  url: string;
  alt: string;
}

export type ImageSlotStorage =
  | { type: "siteImages" }
  | { type: "pagesConfig"; pageKey: string }
  | { type: "homepageConfig"; field: "hero.imageUrl" | "sectionImages.requestHero" | "sectionImages.contactHero" }
  | { type: "settings"; field: "logoUrl" | "faviconUrl" | "ogImage" }
  | { type: "category"; slug: string }
  | { type: "dynamic"; adminPath: string; description: string };

export interface ImageSlotDefinition {
  id: string;
  group: string;
  label: string;
  usage: string;
  defaultUrl: string;
  defaultAlt: string;
  storage: ImageSlotStorage;
}

export interface ResolvedImageSlot extends ImageSlotValue {
  id: string;
  group: string;
  label: string;
  usage: string;
  editable: boolean;
  adminPath?: string;
}

export type SiteImagesConfig = Record<string, Partial<ImageSlotValue>>;
