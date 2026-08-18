import { getAllCategories } from "@/lib/categories";
import { getAllClients } from "@/lib/clients";
import { getAllProperties } from "@/lib/properties";
import { getAllRequests } from "@/lib/requests";
import type { PropertyStatus } from "@/types";

export async function getAdminCategoriesCount(): Promise<number> {
  const categories = await getAllCategories();
  return categories.length;
}

export async function getAdminProperties() {
  return getAllProperties();
}

export interface DashboardStats {
  properties: number;
  activeProperties: number;
  requests: number;
  newRequests: number;
  clients: number;
  activeClients: number;
  categories: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [allProperties, allRequests, allClients, categoriesCount] = await Promise.all([
    getAllProperties(),
    getAllRequests(),
    getAllClients(),
    getAdminCategoriesCount(),
  ]);

  return {
    properties: allProperties.length,
    activeProperties: allProperties.filter((property) => property.status === "active").length,
    requests: allRequests.length,
    newRequests: allRequests.filter((request) => request.status === "new").length,
    clients: allClients.length,
    activeClients: allClients.filter((client) => client.status === "active").length,
    categories: categoriesCount,
  };
}

export async function getPropertyStatusBreakdown(): Promise<{ status: PropertyStatus; count: number }[]> {
  const adminProperties = await getAllProperties();
  const statuses: PropertyStatus[] = ["active", "reserved", "sold", "rented", "draft"];

  return statuses.map((status) => ({
    status,
    count: adminProperties.filter((property) => property.status === status).length,
  }));
}

export async function getRecentProperties(limit = 5) {
  const properties = await getAllProperties();
  return [...properties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getRecentRequests(limit = 5) {
  const requests = await getAllRequests();
  return [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
