import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/contact-helpers";
import { mapClient, mapRequest } from "@/lib/mappers";
import type { PaginatedResult, PaginationParams } from "@/lib/pagination";
import { buildPaginationMeta, getSkipTake } from "@/lib/pagination";
import type { Client, ClientCreateInput, ClientUpdateInput, Request } from "@/types";
import type { ClientStatus, ClientType, Prisma } from "@prisma/client";

export interface ClientListQuery {
  search?: string;
  status?: ClientStatus;
  type?: ClientType;
  sort?: "newest" | "oldest" | "name" | "activity";
}

export { getClientFullName, normalizePhone } from "@/lib/contact-helpers";

function buildWhere(query?: ClientListQuery): Prisma.ClientWhereInput {
  const where: Prisma.ClientWhereInput = {};

  if (query?.status) where.status = query.status;
  if (query?.type) where.type = query.type;

  if (query?.search?.trim()) {
    const search = query.search.trim();
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
      { assignedManager: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildOrderBy(sort?: ClientListQuery["sort"]): Prisma.ClientOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "name":
      return { lastName: "asc" };
    case "activity":
      return { updatedAt: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

async function generateClientId(): Promise<string> {
  const result = await prisma.client.findMany({ select: { id: true } });
  const numericIds = result
    .map((item) => Number(item.id))
    .filter((value) => Number.isFinite(value));

  const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  return String(nextId);
}

export async function listClients(query?: ClientListQuery): Promise<Client[]> {
  const records = await prisma.client.findMany({
    where: buildWhere(query),
    orderBy: buildOrderBy(query?.sort),
  });

  return records.map(mapClient);
}

export async function listClientsPaginated(
  params: PaginationParams,
  query?: ClientListQuery,
): Promise<PaginatedResult<Client>> {
  const where = buildWhere(query);
  const [total, records] = await Promise.all([
    prisma.client.count({ where }),
    prisma.client.findMany({
      where,
      orderBy: buildOrderBy(query?.sort),
      ...getSkipTake(params),
    }),
  ]);

  return {
    items: records.map(mapClient),
    pagination: buildPaginationMeta(total, params),
  };
}

export async function getClientById(id: string): Promise<Client | null> {
  const record = await prisma.client.findUnique({ where: { id } });
  return record ? mapClient(record) : null;
}

export async function findClientByContact(
  phone: string,
  email: string,
): Promise<Client | null> {
  const normalizedPhone = normalizePhone(phone);
  const records = await prisma.client.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const match = records.find((client) => {
    if (normalizedPhone && normalizePhone(client.phone) === normalizedPhone) return true;
    if (email && client.email && client.email.toLowerCase() === email.toLowerCase()) return true;
    return false;
  });

  return match ? mapClient(match) : null;
}

export async function findClientByIdOrContact(
  clientId: string | null | undefined,
  phone: string,
  email: string,
): Promise<Client | null> {
  if (clientId) {
    const byId = await getClientById(clientId);
    if (byId) return byId;
  }

  return findClientByContact(phone, email);
}

function splitRequestName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Клиент", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export async function createClientFromRequest(input: {
  name: string;
  phone: string;
  email: string;
}): Promise<Client> {
  const { firstName, lastName } = splitRequestName(input.name);

  return createClient({
    firstName,
    lastName,
    phone: input.phone.trim(),
    email: input.email.trim(),
    type: "buyer",
    status: "new",
    notes: "Автоматически создан из заявки",
    assignedManager: "",
  });
}

export async function linkExistingRequestsToClient(client: Client): Promise<void> {
  const normalizedPhone = normalizePhone(client.phone);

  const requests = await prisma.request.findMany({
    where: { clientId: null },
  });

  const idsToLink = requests
    .filter((request) => {
      const phoneMatch =
        normalizedPhone.length > 0 && normalizePhone(request.phone) === normalizedPhone;
      const emailMatch =
        client.email &&
        request.email &&
        client.email.toLowerCase() === request.email.toLowerCase();
      return phoneMatch || emailMatch;
    })
    .map((request) => request.id);

  if (idsToLink.length === 0) return;

  await prisma.request.updateMany({
    where: { id: { in: idsToLink } },
    data: { clientId: client.id },
  });
}

export async function createClient(input: ClientCreateInput): Promise<Client> {
  const record = await prisma.client.create({
    data: {
      id: await generateClientId(),
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      email: input.email,
      type: input.type,
      status: input.status,
      notes: input.notes,
      assignedManager: input.assignedManager,
    },
  });

  const client = mapClient(record);
  await linkExistingRequestsToClient(client);
  return client;
}

export async function updateClient(
  id: string,
  input: ClientUpdateInput,
): Promise<Client | null> {
  try {
    const record = await prisma.client.update({
      where: { id },
      data: input,
    });
    return mapClient(record);
  } catch {
    return null;
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    await prisma.$transaction([
      prisma.request.updateMany({
        where: { clientId: id },
        data: { clientId: null },
      }),
      prisma.client.delete({ where: { id } }),
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function getRequestsForClient(clientId: string): Promise<Request[]> {
  const client = await getClientById(clientId);
  if (!client) return [];

  const normalizedPhone = normalizePhone(client.phone);

  const records = await prisma.request.findMany({
    orderBy: { createdAt: "desc" },
  });

  return records
    .filter((request) => {
      if (request.clientId === clientId) return true;
      if (request.clientId) return false;

      const phoneMatch =
        normalizedPhone.length > 0 && normalizePhone(request.phone) === normalizedPhone;
      const emailMatch =
        client.email &&
        request.email &&
        client.email.toLowerCase() === request.email.toLowerCase();

      return phoneMatch || emailMatch;
    })
    .map(mapRequest);
}

export async function getClientRequestCount(clientId: string): Promise<number> {
  const requests = await getRequestsForClient(clientId);
  return requests.length;
}

export async function getClientLastActivity(clientId: string): Promise<string | null> {
  const client = await getClientById(clientId);
  const requests = await getRequestsForClient(clientId);

  const dates = [
    client?.updatedAt,
    ...requests.map((request) => request.createdAt),
  ].filter(Boolean) as string[];

  if (dates.length === 0) return client?.createdAt ?? null;

  return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
}

export const getAllClients = listClients;
