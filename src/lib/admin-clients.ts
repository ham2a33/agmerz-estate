import type { AdminClientListItem } from "@/lib/clients.types";
import type { ClientStatus, ClientType } from "@/types";

export type AdminClientSort = "newest" | "oldest" | "name" | "activity";

export interface AdminClientFilters {
  search: string;
  status: ClientStatus | "";
  type: ClientType | "";
  sort: AdminClientSort;
}

export const DEFAULT_ADMIN_CLIENT_FILTERS: AdminClientFilters = {
  search: "",
  status: "",
  type: "",
  sort: "newest",
};

export function filterAdminClients(
  items: AdminClientListItem[],
  filters: AdminClientFilters,
): AdminClientListItem[] {
  const query = filters.search.trim().toLowerCase();

  return items.filter((client) => {
    if (query) {
      const haystack = [
        client.firstName,
        client.lastName,
        client.phone,
        client.email,
        client.notes,
        client.assignedManager,
        client.id,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    if (filters.status && client.status !== filters.status) return false;
    if (filters.type && client.type !== filters.type) return false;

    return true;
  });
}

export function sortAdminClients(
  items: AdminClientListItem[],
  sort: AdminClientSort,
): AdminClientListItem[] {
  const sorted = [...items];

  if (sort === "oldest") {
    return sorted.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  if (sort === "name") {
    return sorted.sort((a, b) =>
      `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`, "ru"),
    );
  }

  if (sort === "activity") {
    return sorted.sort((a, b) => {
      const activityA = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
      const activityB = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
      return activityB - activityA;
    });
  }

  return sorted.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function countActiveAdminClientFilters(filters: AdminClientFilters): number {
  let count = 0;
  if (filters.status) count++;
  if (filters.type) count++;
  return count;
}
