import { prisma } from "@/lib/db";
import { mapRequest } from "@/lib/mappers";
import {
  findClientByIdOrContact,
  normalizePhone,
} from "@/lib/repositories/clients";
import { getSettingsRecord } from "@/lib/repositories/settings";
import type { PaginatedResult, PaginationParams } from "@/lib/pagination";
import { buildPaginationMeta, getSkipTake } from "@/lib/pagination";
import type { Request, RequestCreateInput, RequestUpdateInput } from "@/types";
import type { Prisma, RequestStatus, RequestType } from "@prisma/client";

export interface RequestListQuery {
  search?: string;
  status?: RequestStatus;
  type?: RequestType;
  sort?: "newest" | "oldest";
}

function buildWhere(query?: RequestListQuery): Prisma.RequestWhereInput {
  const where: Prisma.RequestWhereInput = {};

  if (query?.status) where.status = query.status;
  if (query?.type) where.type = query.type;

  if (query?.search?.trim()) {
    const search = query.search.trim();
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
      { district: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function listRequests(query?: RequestListQuery): Promise<Request[]> {
  const records = await prisma.request.findMany({
    where: buildWhere(query),
    orderBy: { createdAt: query?.sort === "oldest" ? "asc" : "desc" },
  });

  return records.map(mapRequest);
}

export async function listRequestsPaginated(
  params: PaginationParams,
  query?: RequestListQuery,
): Promise<PaginatedResult<Request>> {
  const where = buildWhere(query);
  const [total, records] = await Promise.all([
    prisma.request.count({ where }),
    prisma.request.findMany({
      where,
      orderBy: { createdAt: query?.sort === "oldest" ? "asc" : "desc" },
      ...getSkipTake(params),
    }),
  ]);

  return {
    items: records.map(mapRequest),
    pagination: buildPaginationMeta(total, params),
  };
}

export async function getRequestById(id: string): Promise<Request | null> {
  const record = await prisma.request.findUnique({ where: { id } });
  return record ? mapRequest(record) : null;
}

export async function createRequest(input: RequestCreateInput): Promise<Request> {
  return prisma.$transaction(async (tx) => {
    const settings = await getSettingsRecord(tx);

    let clientId = input.clientId ?? null;

    if (clientId) {
      const existingClient = await tx.client.findUnique({ where: { id: clientId } });
      if (!existingClient) {
        clientId = null;
      }
    }

    if (!clientId) {
      const matchedClient = await findClientByIdOrContact(null, input.phone, input.email);
      if (matchedClient) {
        clientId = matchedClient.id;
      } else if (normalizePhone(input.phone) || input.email.trim()) {
        const { firstName, lastName } = splitRequestName(input.name);
        const createdClient = await tx.client.create({
          data: {
            id: await nextClientId(tx),
            firstName,
            lastName,
            phone: input.phone.trim(),
            email: input.email.trim(),
            type: "buyer",
            status: "new",
            notes: "Автоматически создан из заявки",
            assignedManager: "",
          },
        });
        clientId = createdClient.id;
      }
    }

    if (input.propertyId) {
      const property = await tx.property.findUnique({ where: { id: input.propertyId } });
      if (!property) {
        throw new Error("Property not found");
      }
    }

    const record = await tx.request.create({
      data: {
        id: await nextRequestId(tx),
        name: input.name,
        phone: input.phone,
        email: input.email,
        type: input.type,
        budget: input.budget,
        district: input.district,
        rooms: input.rooms,
        message: input.message,
        internalNotes: input.internalNotes ?? "",
        status: settings.defaultRequestStatus,
        clientId,
        propertyId: input.propertyId ?? null,
      },
    });

    if (clientId) {
      await tx.request.updateMany({
        where: {
          clientId: null,
          OR: [
            { phone: input.phone },
            ...(input.email
              ? [{ email: { equals: input.email, mode: "insensitive" as const } }]
              : []),
          ],
        },
        data: { clientId },
      });
    }

    return mapRequest(record);
  });
}

function splitRequestName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Клиент", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

async function nextRequestId(tx: Prisma.TransactionClient): Promise<string> {
  const result = await tx.request.findMany({ select: { id: true } });
  const numericIds = result
    .map((item) => Number(item.id))
    .filter((value) => Number.isFinite(value));
  const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  return String(nextId);
}

async function nextClientId(tx: Prisma.TransactionClient): Promise<string> {
  const result = await tx.client.findMany({ select: { id: true } });
  const numericIds = result
    .map((item) => Number(item.id))
    .filter((value) => Number.isFinite(value));
  const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  return String(nextId);
}

export async function updateRequest(
  id: string,
  input: RequestUpdateInput,
): Promise<Request | null> {
  try {
    const record = await prisma.request.update({
      where: { id },
      data: input,
    });
    return mapRequest(record);
  } catch {
    return null;
  }
}

export async function deleteRequest(id: string): Promise<boolean> {
  try {
    await prisma.request.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export { getEmailHref, getPhoneHref } from "@/lib/contact-helpers";

export const getAllRequests = listRequests;
