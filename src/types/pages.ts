export const PAGE_KEYS = [
  "catalog",
  "services",
  "about",
  "blog",
  "contacts",
  "favorites",
  "request",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export interface PageHeroConfig {
  title: string;
  description: string;
  imageUrl: string;
}

export type PagesConfig = Record<PageKey, PageHeroConfig>;

export const PAGE_LABELS: Record<PageKey, string> = {
  catalog: "Каталог",
  services: "Услуги",
  about: "О компании",
  blog: "Блог",
  contacts: "Контакты",
  favorites: "Избранное",
  request: "Подобрать недвижимость",
};

export const PAGE_ROUTES: Record<PageKey, string> = {
  catalog: "/catalog",
  services: "/services",
  about: "/about",
  blog: "/blog",
  contacts: "/contacts",
  favorites: "/favorites",
  request: "/request",
};
