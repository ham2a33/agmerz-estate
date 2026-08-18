import "server-only";

import {
  getClientLastActivity,
  getClientRequestCount,
} from "@/lib/repositories/clients";

export {
  normalizePhone,
  getClientFullName,
  getAllClients,
  getClientById,
  findClientByContact,
  createClient,
  updateClient,
  deleteClient,
  getRequestsForClient,
  listClientsPaginated,
} from "@/lib/repositories/clients";

export type { AdminClientListItem } from "@/lib/clients.types";

export async function getClientsForAdminList(): Promise<
  import("@/lib/clients.types").AdminClientListItem[]
> {
  const { getAllClients } = await import("@/lib/repositories/clients");
  const clients = await getAllClients();

  return Promise.all(
    clients.map(async (client) => ({
      ...client,
      requestCount: await getClientRequestCount(client.id),
      lastActivity: await getClientLastActivity(client.id),
    })),
  );
}

export async function getPropertiesForClient(clientId: string) {
  const { listProperties } = await import("@/lib/repositories/properties");
  const { getRequestsForClient } = await import("@/lib/repositories/clients");

  const clientRequests = await getRequestsForClient(clientId);
  const propertyIds = new Set(
    clientRequests
      .map((request) => request.propertyId)
      .filter((id): id is string => Boolean(id)),
  );

  if (propertyIds.size === 0) return [];

  const properties = await listProperties();
  return properties.filter((property) => propertyIds.has(property.id));
}
