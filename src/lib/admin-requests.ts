import type { Request, RequestStatus, RequestType } from "@/types";

export type AdminRequestSort = "newest" | "oldest";

export interface AdminRequestFilters {
  search: string;
  status: RequestStatus | "";
  type: RequestType | "";
  sort: AdminRequestSort;
}

export const DEFAULT_ADMIN_REQUEST_FILTERS: AdminRequestFilters = {
  search: "",
  status: "",
  type: "",
  sort: "newest",
};

export function filterAdminRequests(
  items: Request[],
  filters: AdminRequestFilters,
): Request[] {
  const query = filters.search.trim().toLowerCase();

  return items.filter((request) => {
    if (query) {
      const haystack = [
        request.name,
        request.phone,
        request.email,
        request.message,
        request.district ?? "",
        request.id,
        request.type,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    if (filters.status && request.status !== filters.status) return false;
    if (filters.type && request.type !== filters.type) return false;

    return true;
  });
}

export function sortAdminRequests(items: Request[], sort: AdminRequestSort): Request[] {
  const sorted = [...items];

  if (sort === "oldest") {
    return sorted.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  return sorted.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function countActiveAdminRequestFilters(filters: AdminRequestFilters): number {
  let count = 0;
  if (filters.status) count++;
  if (filters.type) count++;
  return count;
}
