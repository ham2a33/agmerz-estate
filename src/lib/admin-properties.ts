import type { Property, PropertyStatus, PropertyType } from "@/types";

export type AdminPropertySort =
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "area-asc"
  | "area-desc";

export interface AdminPropertyFilters {
  search: string;
  type: PropertyType | "";
  status: PropertyStatus | "";
  deal: "sale" | "rent" | "";
  district: string;
  minPrice: string;
  maxPrice: string;
  sort: AdminPropertySort;
}

export const DEFAULT_ADMIN_PROPERTY_FILTERS: AdminPropertyFilters = {
  search: "",
  type: "",
  status: "",
  deal: "",
  district: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
};

export function filterAdminProperties(
  properties: Property[],
  filters: AdminPropertyFilters,
): Property[] {
  const query = filters.search.trim().toLowerCase();

  return properties.filter((property) => {
    if (query) {
      const haystack = [
        property.title,
        property.address,
        property.district,
        property.id,
        property.slug,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    if (filters.type && property.type !== filters.type) return false;
    if (filters.status && property.status !== filters.status) return false;

    if (filters.deal === "rent" && property.type !== "rent") return false;
    if (filters.deal === "sale" && property.type === "rent") return false;

    if (filters.district && property.district !== filters.district) return false;
    if (filters.minPrice && property.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && property.price > Number(filters.maxPrice)) return false;

    return true;
  });
}

export function sortAdminProperties(
  properties: Property[],
  sort: AdminPropertySort,
): Property[] {
  const sorted = [...properties];

  switch (sort) {
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
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
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}

export function countActiveAdminFilters(filters: AdminPropertyFilters): number {
  let count = 0;
  if (filters.type) count++;
  if (filters.status) count++;
  if (filters.deal) count++;
  if (filters.district) count++;
  if (filters.minPrice) count++;
  if (filters.maxPrice) count++;
  return count;
}
