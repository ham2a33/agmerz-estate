import type { Property, PropertyType } from "@/types";

export type CatalogCategorySlug =
  | "all"
  | "apartments"
  | "houses"
  | "commercial"
  | "land"
  | "rent";

export type CatalogSortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "area-asc"
  | "area-desc";

export type CatalogDealType = "sale" | "rent";

export type CatalogPropertyType = Exclude<PropertyType, "rent">;

export interface CatalogFiltersState {
  type: CatalogPropertyType | "";
  deal: CatalogDealType | "";
  district: string;
  rooms: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  sort: CatalogSortOption;
}

export const CATALOG_DISTRICTS = [
  "Центральный",
  "Ахматовский",
  "Старопромысловский",
  "Ленинский",
  "Заводской",
  "Октябрьский",
];

export const CATEGORY_LINKS: { slug: CatalogCategorySlug; label: string; href: string }[] = [
  { slug: "all", label: "Все", href: "/catalog" },
  { slug: "apartments", label: "Квартиры", href: "/catalog/apartments" },
  { slug: "houses", label: "Дома", href: "/catalog/houses" },
  { slug: "commercial", label: "Коммерция", href: "/catalog/commercial" },
  { slug: "land", label: "Участки", href: "/catalog/land" },
  { slug: "rent", label: "Аренда", href: "/catalog/rent" },
];

const CATEGORY_TYPE_MAP: Record<CatalogCategorySlug, PropertyType | ""> = {
  all: "",
  apartments: "apartment",
  houses: "house",
  commercial: "commercial",
  land: "land",
  rent: "rent",
};

export function getDefaultFilters(categorySlug: CatalogCategorySlug): CatalogFiltersState {
  const categoryType = CATEGORY_TYPE_MAP[categorySlug];
  return {
    type: categoryType === "rent" || categoryType === "" ? "" : categoryType,
    deal: categorySlug === "rent" ? "rent" : "",
    district: "",
    rooms: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    sort: "newest",
  };
}

export function parseSearchParams(
  params: URLSearchParams,
  categorySlug: CatalogCategorySlug
): CatalogFiltersState {
  const defaults = getDefaultFilters(categorySlug);
  const type = params.get("type") as CatalogPropertyType | null;
  const deal = params.get("deal") as CatalogDealType | null;
  const sort = params.get("sort") as CatalogSortOption | null;

  return {
    type: type ?? defaults.type,
    deal: deal ?? defaults.deal,
    district: params.get("district") ?? defaults.district,
    rooms: params.get("rooms") ?? defaults.rooms,
    minPrice: params.get("minPrice") ?? defaults.minPrice,
    maxPrice: params.get("maxPrice") ?? defaults.maxPrice,
    minArea: params.get("minArea") ?? defaults.minArea,
    maxArea: params.get("maxArea") ?? defaults.maxArea,
    sort: sort && isValidSort(sort) ? sort : defaults.sort,
  };
}

function isValidSort(value: string): value is CatalogSortOption {
  return ["newest", "price-asc", "price-desc", "area-asc", "area-desc"].includes(value);
}

export function buildSearchParams(
  filters: CatalogFiltersState,
  categorySlug: CatalogCategorySlug
): URLSearchParams {
  const params = new URLSearchParams();
  const defaults = getDefaultFilters(categorySlug);

  if (filters.type && filters.type !== defaults.type) params.set("type", filters.type);
  if (filters.deal && filters.deal !== defaults.deal) params.set("deal", filters.deal);
  if (filters.district) params.set("district", filters.district);
  if (filters.rooms) params.set("rooms", filters.rooms);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.minArea) params.set("minArea", filters.minArea);
  if (filters.maxArea) params.set("maxArea", filters.maxArea);
  if (filters.sort !== "newest") params.set("sort", filters.sort);

  return params;
}

export function filterProperties(
  properties: Property[],
  filters: CatalogFiltersState,
  categorySlug: CatalogCategorySlug
): Property[] {
  const categoryType = CATEGORY_TYPE_MAP[categorySlug];

  return properties.filter((property) => {
    if (property.status === "draft") return false;

    if (categorySlug === "rent") {
      if (property.type !== "rent") return false;
    } else if (categoryType && property.type !== categoryType) {
      return false;
    }

    if (filters.type && property.type !== filters.type) return false;

    if (filters.deal === "sale" && property.type === "rent") return false;
    if (filters.deal === "rent" && property.type !== "rent") return false;

    if (filters.district && property.district !== filters.district) return false;

    if (filters.rooms) {
      if (property.rooms === null) return false;
      if (filters.rooms === "4+") {
        if (property.rooms < 4) return false;
      } else if (property.rooms !== Number(filters.rooms)) {
        return false;
      }
    }

    if (filters.minPrice && property.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && property.price > Number(filters.maxPrice)) return false;
    if (filters.minArea && property.area < Number(filters.minArea)) return false;
    if (filters.maxArea && property.area > Number(filters.maxArea)) return false;

    return true;
  });
}

export function sortProperties(
  properties: Property[],
  sort: CatalogSortOption
): Property[] {
  const sorted = [...properties];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "area-asc":
      return sorted.sort((a, b) => a.area - b.area);
    case "area-desc":
      return sorted.sort((a, b) => b.area - a.area);
    case "newest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function formatPropertyCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 19) return `${count} объектов`;
  if (mod10 === 1) return `${count} объект`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} объекта`;
  return `${count} объектов`;
}

export function countActiveFilters(
  filters: CatalogFiltersState,
  categorySlug: CatalogCategorySlug
): number {
  const defaults = getDefaultFilters(categorySlug);
  let count = 0;

  if (filters.type && filters.type !== defaults.type) count++;
  if (filters.deal && filters.deal !== defaults.deal) count++;
  if (filters.district) count++;
  if (filters.rooms) count++;
  if (filters.minPrice) count++;
  if (filters.maxPrice) count++;
  if (filters.minArea) count++;
  if (filters.maxArea) count++;

  return count;
}
