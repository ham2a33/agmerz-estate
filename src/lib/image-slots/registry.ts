import type { ImageSlotDefinition } from "./types";

const UNSPLASH = "https://images.unsplash.com";

export const IMAGE_SLOT_GROUPS = [
  "Главная",
  "Каталог",
  "Услуги",
  "О компании",
  "Блог",
  "Контакты",
  "Избранное",
  "Подобрать недвижимость",
  "Отзывы",
  "Категории каталога",
  "Страницы недвижимости",
  "Общие изображения",
] as const;

export const IMAGE_SLOT_REGISTRY: ImageSlotDefinition[] = [
  // Главная
  {
    id: "homepage.hero",
    group: "Главная",
    label: "Главное изображение Hero",
    usage: "Главная страница — блок Hero справа",
    defaultUrl: `${UNSPLASH}/photo-1600596542815-ffad4c1539a9?w=1200&q=80`,
    defaultAlt: "Современный дом — AGMERZ ESTATE",
    storage: { type: "homepageConfig", field: "hero.imageUrl" },
  },

  // Каталог
  {
    id: "pages.catalog.hero",
    group: "Каталог",
    label: "Главное изображение",
    usage: "Страница «Каталог» — Hero-блок",
    defaultUrl: `${UNSPLASH}/photo-1600585154340-be6161a56a0c?w=640&q=80`,
    defaultAlt: "Каталог недвижимости AGMERZ ESTATE",
    storage: { type: "pagesConfig", pageKey: "catalog" },
  },

  // Услуги
  {
    id: "pages.services.hero",
    group: "Услуги",
    label: "Главное изображение",
    usage: "Страница «Услуги» — Hero-блок",
    defaultUrl: "",
    defaultAlt: "Услуги AGMERZ ESTATE",
    storage: { type: "pagesConfig", pageKey: "services" },
  },
  {
    id: "services.purchase",
    group: "Услуги",
    label: "Покупка недвижимости",
    usage: "Страница «Услуги» — карточка «Покупка недвижимости»",
    defaultUrl: `${UNSPLASH}/photo-1600596542815-ffad4c1539a9?w=900&q=80`,
    defaultAlt: "Покупка недвижимости — консультация клиента",
    storage: { type: "siteImages" },
  },
  {
    id: "services.sale",
    group: "Услуги",
    label: "Продажа недвижимости",
    usage: "Страница «Услуги» — карточка «Продажа недвижимости»",
    defaultUrl: `${UNSPLASH}/photo-1600585154340-be6161a56a0c?w=700&q=80`,
    defaultAlt: "Продажа недвижимости — презентация объекта",
    storage: { type: "siteImages" },
  },
  {
    id: "services.rent",
    group: "Услуги",
    label: "Аренда недвижимости",
    usage: "Страница «Услуги» — карточка «Аренда»",
    defaultUrl: `${UNSPLASH}/photo-1560448204-e02f11c3d0e2?w=700&q=80`,
    defaultAlt: "Аренда недвижимости",
    storage: { type: "siteImages" },
  },
  {
    id: "services.commercial",
    group: "Услуги",
    label: "Коммерческая недвижимость",
    usage: "Страница «Услуги» — карточка «Коммерческая недвижимость»",
    defaultUrl: `${UNSPLASH}/photo-1486406146926-c627a92ad1ab?w=900&q=80`,
    defaultAlt: "Коммерческая недвижимость",
    storage: { type: "siteImages" },
  },
  {
    id: "services.selection",
    group: "Услуги",
    label: "Персональный подбор",
    usage: "Страница «Услуги» — карточка «Персональный подбор»",
    defaultUrl: `${UNSPLASH}/photo-1600607687939-ce8a6c25118c?w=900&q=80`,
    defaultAlt: "Персональный подбор недвижимости",
    storage: { type: "siteImages" },
  },
  {
    id: "services.featured",
    group: "Услуги",
    label: "Персональный подбор — блок секции",
    usage: "Страница «Услуги» — выделенный блок «Персональный подбор недвижимости»",
    defaultUrl: `${UNSPLASH}/photo-1600566753190-17f0baa2a6c3?w=1000&q=80`,
    defaultAlt: "Персональный подбор — работа с клиентом",
    storage: { type: "siteImages" },
  },
  {
    id: "services.sell-rent-cta",
    group: "Услуги",
    label: "Продать или сдать — баннер",
    usage: "Страница «Услуги» — CTA-блок «Хотите продать или сдать недвижимость?»",
    defaultUrl: `${UNSPLASH}/photo-1613490493576-7fde63acd811?w=1400&q=80`,
    defaultAlt: "Продажа или сдача недвижимости в аренду",
    storage: { type: "siteImages" },
  },

  // О компании
  {
    id: "pages.about.hero",
    group: "О компании",
    label: "Главное изображение",
    usage: "Страница «О компании» — Hero-блок",
    defaultUrl: "",
    defaultAlt: "О компании AGMERZ ESTATE",
    storage: { type: "pagesConfig", pageKey: "about" },
  },
  {
    id: "about.local-expertise",
    group: "О компании",
    label: "Локальная экспертиза — «Мы знаем Грозный»",
    usage: "Страница «О компании» — секция локальной экспертизы",
    defaultUrl: `${UNSPLASH}/photo-1449824913935-59a10b8d2000?w=1000&q=80`,
    defaultAlt: "Грозный — локальная экспертиза AGMERZ ESTATE",
    storage: { type: "siteImages" },
  },
  {
    id: "about.client-experience",
    group: "О компании",
    label: "Клиентский опыт — «Клиент всегда в центре»",
    usage: "Страница «О компании» — секция клиентского опыта",
    defaultUrl: `${UNSPLASH}/photo-1600607687644-c7171b42498f?w=1000&q=80`,
    defaultAlt: "Клиентский опыт AGMERZ ESTATE",
    storage: { type: "siteImages" },
  },
  {
    id: "about.team",
    group: "О компании",
    label: "Команда AGMERZ",
    usage: "Страница «О компании» — секция «Команда AGMERZ»",
    defaultUrl: `${UNSPLASH}/photo-1497366216548-37526070297c?w=1000&q=80`,
    defaultAlt: "Команда AGMERZ ESTATE",
    storage: { type: "siteImages" },
  },

  // Блог
  {
    id: "pages.blog.hero",
    group: "Блог",
    label: "Главное изображение",
    usage: "Страница «Блог» — Hero-блок",
    defaultUrl: `${UNSPLASH}/photo-1600607687939-ce8a6c25118c?w=900&q=80`,
    defaultAlt: "Блог AGMERZ ESTATE",
    storage: { type: "pagesConfig", pageKey: "blog" },
  },
  {
    id: "blog.article-inline.house-checklist",
    group: "Блог",
    label: "Статья «Чек-лист перед покупкой дома» — встроенное фото",
    usage: "Страница статьи — встроенное изображение в тексте",
    defaultUrl: `${UNSPLASH}/photo-1605276374101-dee2a0ed3cd6?w=1200&q=80`,
    defaultAlt: "Дом перед покупкой — чек-лист",
    storage: { type: "siteImages" },
  },

  // Контакты
  {
    id: "pages.contacts.hero",
    group: "Контакты",
    label: "Главное изображение",
    usage: "Страница «Контакты» — Hero-блок",
    defaultUrl: `${UNSPLASH}/photo-1497366216548-37526070297c?w=1000&q=80`,
    defaultAlt: "Офис AGMERZ ESTATE",
    storage: { type: "pagesConfig", pageKey: "contacts" },
  },

  // Избранное
  {
    id: "pages.favorites.hero",
    group: "Избранное",
    label: "Главное изображение",
    usage: "Страница «Избранное» — Hero-блок",
    defaultUrl: `${UNSPLASH}/photo-1600585154340-be6161a56a0c?w=640&q=80`,
    defaultAlt: "Избранные объекты AGMERZ ESTATE",
    storage: { type: "pagesConfig", pageKey: "favorites" },
  },
  {
    id: "pages.favorites.empty-state",
    group: "Избранное",
    label: "Пустое состояние",
    usage: "Страница «Избранное» — блок «Здесь пока ничего нет»",
    defaultUrl: `${UNSPLASH}/photo-1600585154340-be6161a56a0c?w=640&q=80`,
    defaultAlt: "Пустое изображение — избранное",
    storage: { type: "siteImages" },
  },

  // Подобрать недвижимость
  {
    id: "pages.request.hero",
    group: "Подобрать недвижимость",
    label: "Главное изображение",
    usage: "Страница «Подобрать недвижимость» — Hero-блок",
    defaultUrl: `${UNSPLASH}/photo-1600566753086-00f18fb6b3ea?w=800&q=80`,
    defaultAlt: "Подбор недвижимости AGMERZ ESTATE",
    storage: { type: "pagesConfig", pageKey: "request" },
  },
  {
    id: "pages.request.sidebar",
    group: "Подобрать недвижимость",
    label: "Боковая панель — «Почему AGMERZ?»",
    usage: "Страница «Подобрать недвижимость» — изображение в боковой панели",
    defaultUrl: `${UNSPLASH}/photo-1600585154340-be6161a56a0c?w=600&q=80`,
    defaultAlt: "AGMERZ ESTATE — подбор недвижимости",
    storage: { type: "siteImages" },
  },

  // Отзывы
  {
    id: "pages.reviews.hero",
    group: "Отзывы",
    label: "Главное изображение",
    usage: "Страница «Отзывы» — Hero-блок",
    defaultUrl: `${UNSPLASH}/photo-1600607687939-ce8a6c25118c?w=800&q=80`,
    defaultAlt: "Отзывы клиентов AGMERZ ESTATE",
    storage: { type: "siteImages" },
  },

  // Категории
  {
    id: "category.apartments",
    group: "Категории каталога",
    label: "Квартиры — фотография категории",
    usage: "Каталог, главная — карточка категории «Квартиры»",
    defaultUrl: `${UNSPLASH}/photo-1502672260266-1c1ef2d93688?w=800&q=80`,
    defaultAlt: "Квартиры в Грозном",
    storage: { type: "category", slug: "apartments" },
  },
  {
    id: "category.houses",
    group: "Категории каталога",
    label: "Дома — фотография категории",
    usage: "Каталог, главная — карточка категории «Дома»",
    defaultUrl: `${UNSPLASH}/photo-1600585154340-be6161a56a0c?w=800&q=80`,
    defaultAlt: "Дома и коттеджи",
    storage: { type: "category", slug: "houses" },
  },
  {
    id: "category.commercial",
    group: "Категории каталога",
    label: "Коммерция — фотография категории",
    usage: "Каталог, главная — карточка категории «Коммерция»",
    defaultUrl: `${UNSPLASH}/photo-1486406146926-c627a92ad1ab?w=800&q=80`,
    defaultAlt: "Коммерческая недвижимость",
    storage: { type: "category", slug: "commercial" },
  },
  {
    id: "category.land",
    group: "Категории каталога",
    label: "Участки — фотография категории",
    usage: "Каталог, главная — карточка категории «Участки»",
    defaultUrl: `${UNSPLASH}/photo-1500382017468-90403fed87ef?w=800&q=80`,
    defaultAlt: "Земельные участки",
    storage: { type: "category", slug: "land" },
  },
  {
    id: "category.rent",
    group: "Категории каталога",
    label: "Аренда — фотография категории",
    usage: "Каталог, главная — карточка категории «Аренда»",
    defaultUrl: `${UNSPLASH}/photo-1560448204-e02f11c3d0e2?w=800&q=80`,
    defaultAlt: "Аренда недвижимости",
    storage: { type: "category", slug: "rent" },
  },

  // Общие
  {
    id: "settings.logo",
    group: "Общие изображения",
    label: "Логотип агентства",
    usage: "Header, страницы «О компании», «Услуги», «Подобрать недвижимость»",
    defaultUrl: "/images/agmerz-estate-logo.png",
    defaultAlt: "AGMERZ ESTATE — логотип",
    storage: { type: "settings", field: "logoUrl" },
  },
  {
    id: "settings.favicon",
    group: "Общие изображения",
    label: "Favicon сайта",
    usage: "Иконка вкладки браузера",
    defaultUrl: "",
    defaultAlt: "AGMERZ ESTATE",
    storage: { type: "settings", field: "faviconUrl" },
  },
  {
    id: "settings.og-image",
    group: "Общие изображения",
    label: "OG-изображение (соцсети)",
    usage: "Превью при публикации ссылки в соцсетях",
    defaultUrl: "",
    defaultAlt: "AGMERZ ESTATE",
    storage: { type: "settings", field: "ogImage" },
  },

  // Property fallbacks
  ...buildPropertyFallbackSlots("apartment", "Квартира", [
    `${UNSPLASH}/photo-1600596542815-ffad4c1539a9?w=1200&q=80`,
    `${UNSPLASH}/photo-1600607687939-ce8a6c25118c?w=1200&q=80`,
    `${UNSPLASH}/photo-1600566753190-17f0baa2a6c3?w=1200&q=80`,
    `${UNSPLASH}/photo-1502672260266-1c1ef2d93688?w=1200&q=80`,
  ]),
  ...buildPropertyFallbackSlots("house", "Дом", [
    `${UNSPLASH}/photo-1613490493576-7fde63acd811?w=1200&q=80`,
    `${UNSPLASH}/photo-1600585154340-be6161a56a0c?w=1200&q=80`,
    `${UNSPLASH}/photo-1605276374101-dee2a0ed3cd6?w=1200&q=80`,
    `${UNSPLASH}/photo-1600047509807-ba8f99d2cdde?w=1200&q=80`,
  ]),
  ...buildPropertyFallbackSlots("commercial", "Коммерция", [
    `${UNSPLASH}/photo-1486406146926-c627a92ad1ab?w=1200&q=80`,
    `${UNSPLASH}/photo-1497366216548-37526070297c?w=1200&q=80`,
    `${UNSPLASH}/photo-1586528116311-ad8dd3c8310d?w=1200&q=80`,
    `${UNSPLASH}/photo-1497366754035-f200968a6e72?w=1200&q=80`,
  ]),
  ...buildPropertyFallbackSlots("land", "Участок", [
    `${UNSPLASH}/photo-1500382017468-90403fed87ef?w=1200&q=80`,
    `${UNSPLASH}/photo-1464822759023-fed622ff2c3b?w=1200&q=80`,
    `${UNSPLASH}/photo-1449844908441-8829872d2607?w=1200&q=80`,
    `${UNSPLASH}/photo-1500382017468-90403fed87ef?w=1200&q=81`,
  ]),
  ...buildPropertyFallbackSlots("rent", "Аренда", [
    `${UNSPLASH}/photo-1560448204-e02f11c3d0e2?w=1200&q=80`,
    `${UNSPLASH}/photo-1522708323590-d24dbb6b0267?w=1200&q=80`,
    `${UNSPLASH}/photo-1502672260266-1c1ef2d93688?w=1200&q=80`,
    `${UNSPLASH}/photo-1600607687644-c7171b42498f?w=1200&q=80`,
  ]),

  // Dynamic - informational only in admin
  {
    id: "dynamic.property-images",
    group: "Страницы недвижимости",
    label: "Фотографии объектов",
    usage: "Управляются через «Объекты» → конкретный объект → Фотографии",
    defaultUrl: "",
    defaultAlt: "",
    storage: {
      type: "dynamic",
      adminPath: "/admin/properties",
      description: "Фотографии каждого объекта редактируются в карточке объекта",
    },
  },
  {
    id: "dynamic.blog-covers",
    group: "Блог",
    label: "Обложки статей блога",
    usage: "Управляются через «Блог» → редактирование статьи",
    defaultUrl: "",
    defaultAlt: "",
    storage: {
      type: "dynamic",
      adminPath: "/admin/blog",
      description: "Обложки статей редактируются в админке блога",
    },
  },
  {
    id: "dynamic.review-avatars",
    group: "Отзывы",
    label: "Аватары клиентов",
    usage: "Управляются через «Отзывы» → редактирование отзыва",
    defaultUrl: "",
    defaultAlt: "",
    storage: {
      type: "dynamic",
      adminPath: "/admin/reviews",
      description: "Аватары редактируются в админке отзывов",
    },
  },
];

function buildPropertyFallbackSlots(
  type: string,
  label: string,
  urls: string[],
): ImageSlotDefinition[] {
  return urls.map((url, index) => ({
    id: `property.fallback.${type}.${index + 1}`,
    group: "Страницы недвижимости",
    label: `Запасное фото — ${label} ${index + 1}`,
    usage: `Страница объекта — галерея (если у объекта меньше 2 фото)`,
    defaultUrl: url,
    defaultAlt: `${label} — запасное фото ${index + 1}`,
    storage: { type: "siteImages" },
  }));
}

export const IMAGE_SLOT_MAP = Object.fromEntries(
  IMAGE_SLOT_REGISTRY.map((slot) => [slot.id, slot]),
) as Record<string, ImageSlotDefinition>;

export function getImageSlotDefinition(id: string): ImageSlotDefinition | undefined {
  return IMAGE_SLOT_MAP[id];
}

export const SERVICE_IMAGE_SLOT_IDS = [
  "services.purchase",
  "services.sale",
  "services.rent",
  "services.commercial",
  "services.selection",
] as const;

export const SERVICE_OVERVIEW_SLOT_MAP: Record<string, string> = {
  "01": "services.purchase",
  "02": "services.sale",
  "03": "services.rent",
  "04": "services.commercial",
  "05": "services.selection",
};

export const PROPERTY_FALLBACK_TYPES = ["apartment", "house", "commercial", "land", "rent"] as const;
