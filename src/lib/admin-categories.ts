import type { AdminCategoryListItem } from "@/lib/categories";

export type AdminCategorySort = "order" | "name" | "newest";

export interface AdminCategoryFilters {
  search: string;
  status: "active" | "hidden" | "";
  sort: AdminCategorySort;
}

export const DEFAULT_ADMIN_CATEGORY_FILTERS: AdminCategoryFilters = {
  search: "",
  status: "",
  sort: "order",
};

export function filterAdminCategories(
  items: AdminCategoryListItem[],
  filters: AdminCategoryFilters,
): AdminCategoryListItem[] {
  const query = filters.search.trim().toLowerCase();

  return items.filter((category) => {
    if (query) {
      const haystack = [category.name, category.slug, category.description, category.id]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    if (filters.status === "active" && !category.isActive) return false;
    if (filters.status === "hidden" && category.isActive) return false;

    return true;
  });
}

export function sortAdminCategories(
  items: AdminCategoryListItem[],
  sort: AdminCategorySort,
): AdminCategoryListItem[] {
  const sorted = [...items];

  if (sort === "name") {
    return sorted.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  }

  if (sort === "newest") {
    return sorted.sort((a, b) => Number(b.id) - Number(a.id));
  }

  return sorted.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "ru"));
}

export function countActiveAdminCategoryFilters(filters: AdminCategoryFilters): number {
  return filters.status ? 1 : 0;
}
