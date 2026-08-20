import { getPropertyById as getStoredPropertyById, getAllProperties } from "@/lib/properties";
import type { Property, PropertyType } from "@/types";

const DEFAULT_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
];

const CATEGORY_HREF: Record<PropertyType, string> = {
  apartment: "/catalog/apartments",
  house: "/catalog/houses",
  commercial: "/catalog/commercial",
  land: "/catalog/land",
  rent: "/catalog/rent",
};

export async function getPropertyById(id: string): Promise<Property | undefined> {
  const property = await getStoredPropertyById(id);
  return property ?? undefined;
}

export function getGalleryImages(
  property: Property,
  pools?: Partial<Record<PropertyType, string[]>>,
): string[] {
  if (property.images.length >= 2) return property.images;

  const pool = pools?.[property.type]?.length ? pools[property.type]! : DEFAULT_IMAGE_POOL;
  const primary = property.images[0] ?? pool[0];
  const rest = pool.filter((img) => img !== primary);

  return [primary, ...rest.slice(0, 3)];
}

export function getCategoryHref(type: PropertyType): string {
  return CATEGORY_HREF[type];
}

export function getDealBadge(property: Property): string {
  return property.type === "rent" ? "В АРЕНДЕ" : "В ПРОДАЖЕ";
}

export function getPricePerSqm(property: Property): number | null {
  if (property.area <= 0) return null;
  return Math.round(property.price / property.area);
}

export function isRental(property: Property): boolean {
  return property.type === "rent";
}

export async function getSimilarProperties(property: Property, limit = 4): Promise<Property[]> {
  const allProperties = await getAllProperties();
  const priceMin = property.price * 0.7;
  const priceMax = property.price * 1.3;

  const scored = allProperties
    .filter((p) => p.id !== property.id && p.status !== "draft")
    .map((p) => {
      let score = 0;
      if (p.type === property.type) score += 3;
      if (p.district === property.district) score += 2;
      if (p.price >= priceMin && p.price <= priceMax) score += 2;
      return { property: p, score };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.property.createdAt).getTime() - new Date(a.property.createdAt).getTime(),
    );

  if (scored.length >= limit) {
    return scored.slice(0, limit).map((item) => item.property);
  }

  const fallback = allProperties
    .filter((p) => p.id !== property.id && p.type === property.type && p.status !== "draft")
    .slice(0, limit);

  return fallback.length > 0
    ? fallback
    : allProperties.filter((p) => p.id !== property.id).slice(0, limit);
}

export function getPropertyJsonLd(property: Property, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url,
    datePosted: property.createdAt,
    image: getGalleryImages(property),
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "RUB",
      availability:
        property.status === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: "Грозный",
      addressRegion: property.district,
      addressCountry: "RU",
    },
    ...(property.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: property.coordinates.lat,
        longitude: property.coordinates.lng,
      },
    }),
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.area,
      unitCode: "MTK",
    },
  };
}

export interface PropertyCharacteristic {
  label: string;
  value: string;
}

export function getKeyCharacteristics(property: Property): PropertyCharacteristic[] {
  const items: PropertyCharacteristic[] = [{ label: "Площадь", value: `${property.area} м²` }];

  if (property.type === "apartment" || property.type === "rent") {
    if (property.rooms !== null) items.push({ label: "Комнаты", value: String(property.rooms) });
    if (property.floor !== null) items.push({ label: "Этаж", value: String(property.floor) });
    if (property.totalFloors !== null) items.push({ label: "Этажей", value: String(property.totalFloors) });
  }

  if (property.type === "house") {
    if (property.rooms !== null) items.push({ label: "Комнаты", value: String(property.rooms) });
    if (property.totalFloors !== null) items.push({ label: "Этажей", value: String(property.totalFloors) });
  }

  if (property.type === "commercial") {
    if (property.floor !== null) items.push({ label: "Этаж", value: String(property.floor) });
    if (property.totalFloors !== null) items.push({ label: "Этажей в здании", value: String(property.totalFloors) });
  }

  if (property.type === "land") {
    items.push({ label: "Назначение", value: "Индивидуальное строительство" });
    if (property.features.some((f) => f.toLowerCase().includes("коммун"))) {
      items.push({ label: "Коммуникации", value: "Подведены" });
    }
  }

  if (property.yearBuilt) {
    items.push({ label: "Год постройки", value: String(property.yearBuilt) });
  }

  return items;
}

export function getSeoDescription(property: Property): string {
  const typeLabel =
    property.type === "apartment"
      ? `${property.rooms ?? ""}-комнатная квартира`.trim()
      : property.title;

  return `${typeLabel} площадью ${property.area} м² в ${property.district} районе Грозного. ${property.description.slice(0, 120)}`;
}
