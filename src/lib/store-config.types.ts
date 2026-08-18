export type StoreConfig = {
  brand: string;
  logoUrl: string;
  faviconUrl: string;
  phone: {
    display: string;
    href: string;
    raw: string;
  };
  whatsapp: {
    display: string;
    href: string;
  };
  email: {
    display: string;
    href: string;
  };
  instagram: {
    display: string;
    href: string;
  };
  address: {
    city: string;
    region: string;
    full: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  mapRouteUrl: string;
  workingHours: readonly {
    days: string;
    hours: string;
  }[];
};

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  brand: "AGMERZ ESTATE",
  logoUrl: "/images/agmerz-estate-logo.png",
  faviconUrl: "",
  phone: {
    display: "+7 (928) 888-88-88",
    href: "tel:+79288888888",
    raw: "+79288888888",
  },
  whatsapp: {
    display: "Написать в WhatsApp",
    href: "https://wa.me/79288888888",
  },
  email: {
    display: "info@agmerz.ru",
    href: "mailto:info@agmerz.ru",
  },
  instagram: {
    display: "Instagram",
    href: "https://instagram.com",
  },
  address: {
    city: "Грозный",
    region: "Чеченская Республика",
    full: "Грозный, Чеченская Республика",
  },
  coordinates: {
    lat: 43.3178,
    lng: 45.6949,
  },
  mapRouteUrl: "https://yandex.ru/maps/?text=Grozny",
  workingHours: [
    { days: "Пн — Пт", hours: "09:00 — 19:00" },
    { days: "Сб", hours: "10:00 — 17:00" },
    { days: "Вс", hours: "Выходной" },
  ],
};

/** Static fallback config safe for client imports. */
export const storeConfig = DEFAULT_STORE_CONFIG;
