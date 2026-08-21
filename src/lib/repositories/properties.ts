import { prisma } from "@/lib/db";
import { checkDatabaseConnection } from "@/lib/db";
import { mockProperties } from "@/lib/mock-data/properties";
import { logError } from "@/lib/logger";
import { mapProperty, propertyInclude } from "@/lib/mappers";
import { resolveCategoryForProperty } from "@/lib/repositories/categories";
import type { PaginatedResult, PaginationParams } from "@/lib/pagination";
import { buildPaginationMeta, getSkipTake } from "@/lib/pagination";
import type { Property, PropertyCreateInput, PropertyUpdateInput } from "@/types";
import type { Prisma, PropertyStatus } from "@prisma/client";

export interface PropertyListQuery {
  search?: string;
  status?: PropertyStatus;
  categorySlug?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
}

function buildWhere(query?: PropertyListQuery): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {};

  if (query?.status) {
    where.status = query.status;
  }

  if (query?.categorySlug) {
    where.category = { slug: query.categorySlug };
  }

  if (query?.search?.trim()) {
    const search = query.search.trim();
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
      { district: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildOrderBy(sort?: PropertyListQuery["sort"]): Prisma.PropertyOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

async function generatePropertyId(): Promise<string> {
  const result = await prisma.property.findMany({
    select: { id: true },
  });

  const numericIds = result
    .map((item) => Number(item.id))
    .filter((value) => Number.isFinite(value));

  const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  return String(nextId);
}

function filterMockProperties(query?: PropertyListQuery): Property[] {
  let items = [...mockProperties];

  if (query?.status) {
    items = items.filter((property) => property.status === query.status);
  }

  if (query?.categorySlug) {
    items = items.filter((property) => property.category === query.categorySlug);
  }

  if (query?.search?.trim()) {
    const search = query.search.trim().toLowerCase();
    items = items.filter((property) =>
      [property.title, property.address, property.district, property.slug]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }

  return items;
}

export async function listProperties(query?: PropertyListQuery): Promise<Property[]> {
  try {
    const connected = await checkDatabaseConnection();
    if (!connected) {
      return filterMockProperties(query);
    }

    const records = await prisma.property.findMany({
      where: buildWhere(query),
      include: propertyInclude,
      orderBy: buildOrderBy(query?.sort),
    });

    return records.map(mapProperty);
  } catch (error) {
    logError("properties:list", error);
    return filterMockProperties(query);
  }
}

export async function listActiveProperties(): Promise<Property[]> {
  return listProperties({ status: "active" });
}

export async function listPropertiesPaginated(
  params: PaginationParams,
  query?: PropertyListQuery,
): Promise<PaginatedResult<Property>> {
  try {
    const connected = await checkDatabaseConnection();
    if (!connected) {
      const items = filterMockProperties(query);
      const start = (params.page - 1) * params.limit;
      const paginatedItems = items.slice(start, start + params.limit);

      return {
        items: paginatedItems,
        pagination: buildPaginationMeta(items.length, params),
      };
    }

    const where = buildWhere(query);
    const [total, records] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        include: propertyInclude,
        orderBy: buildOrderBy(query?.sort),
        ...getSkipTake(params),
      }),
    ]);

    return {
      items: records.map(mapProperty),
      pagination: buildPaginationMeta(total, params),
    };
  } catch (error) {
    logError("properties:paginated", error);
    const items = filterMockProperties(query);
    const start = (params.page - 1) * params.limit;
    const paginatedItems = items.slice(start, start + params.limit);

    return {
      items: paginatedItems,
      pagination: buildPaginationMeta(items.length, params),
    };
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const connected = await checkDatabaseConnection();
    if (!connected) {
      return mockProperties.find((property) => property.id === id) ?? null;
    }

    const record = await prisma.property.findUnique({
      where: { id },
      include: propertyInclude,
    });

    return record ? mapProperty(record) : null;
  } catch (error) {
    logError("properties:getById", error);
    return mockProperties.find((property) => property.id === id) ?? null;
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const record = await prisma.property.findUnique({
    where: { slug },
    include: propertyInclude,
  });

  return record ? mapProperty(record) : null;
}

export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.property.findUnique({ where: { slug } });
  if (!existing) return true;
  return excludeId ? existing.id === excludeId : false;
}

export async function createProperty(input: PropertyCreateInput): Promise<Property> {
  const category = await resolveCategoryForProperty(input.category);

  const id = await generatePropertyId();

  const record = await prisma.property.create({
    data: {
      id,
      title: input.title,
      slug: input.slug,
      type: input.type,
      status: input.status,
      price: input.price,
      currency: input.currency,
      address: input.address,
      district: input.district,
      area: input.area,
      rooms: input.rooms,
      floor: input.floor,
      totalFloors: input.totalFloors,
      yearBuilt: input.yearBuilt,
      description: input.description,
      features: input.features,
      lat: input.coordinates?.lat ?? null,
      lng: input.coordinates?.lng ?? null,
      categoryId: category.id,
      images: {
        create: input.images.map((url, index) => ({
          url,
          sortOrder: index,
        })),
      },
    },
    include: propertyInclude,
  });

  return mapProperty(record);
}

export async function updateProperty(
  id: string,
  input: PropertyUpdateInput,
): Promise<Property | null> {
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return null;

  let categoryId = existing.categoryId;
  if (input.category) {
    const category = await resolveCategoryForProperty(input.category);
    categoryId = category.id;
  }

  await prisma.$transaction(async (tx) => {
    if (input.images) {
      await tx.propertyImage.deleteMany({ where: { propertyId: id } });
      if (input.images.length > 0) {
        await tx.propertyImage.createMany({
          data: input.images.map((url, index) => ({
            propertyId: id,
            url,
            sortOrder: index,
          })),
        });
      }
    }

    await tx.property.update({
      where: { id },
      data: {
        title: input.title,
        slug: input.slug,
        type: input.type,
        status: input.status,
        price: input.price,
        currency: input.currency,
        address: input.address,
        district: input.district,
        area: input.area,
        rooms: input.rooms,
        floor: input.floor,
        totalFloors: input.totalFloors,
        yearBuilt: input.yearBuilt,
        description: input.description,
        features: input.features,
        lat: input.coordinates === undefined ? undefined : input.coordinates?.lat ?? null,
        lng: input.coordinates === undefined ? undefined : input.coordinates?.lng ?? null,
        categoryId,
      },
    });
  });

  return getPropertyById(id);
}

export async function deleteProperty(id: string): Promise<boolean> {
  try {
    await prisma.property.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getFeaturedProperties(limit = 3): Promise<Property[]> {
  try {
    const connected = await checkDatabaseConnection();
    if (!connected) {
      return filterMockProperties({ status: "active" }).slice(0, limit);
    }

    const featuredRecords = await prisma.property.findMany({
      where: { status: "active", isFeatured: true },
      include: propertyInclude,
      orderBy: [{ featuredOrder: "asc" }, { createdAt: "desc" }],
      take: limit,
    });

    if (featuredRecords.length > 0) {
      return featuredRecords.map(mapProperty);
    }

    const records = await prisma.property.findMany({
      where: { status: "active" },
      include: propertyInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return records.map(mapProperty);
  } catch (error) {
    logError("properties:featured", error);
    return filterMockProperties({ status: "active" }).slice(0, limit);
  }
}

export async function listFeaturedProperties(): Promise<Property[]> {
  const records = await prisma.property.findMany({
    where: { isFeatured: true },
    include: propertyInclude,
    orderBy: [{ featuredOrder: "asc" }, { createdAt: "desc" }],
  });

  return records.map(mapProperty);
}

export async function setPropertyFeatured(
  id: string,
  isFeatured: boolean,
  featuredOrder?: number | null,
): Promise<Property | null> {
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return null;

  const record = await prisma.property.update({
    where: { id },
    data: {
      isFeatured,
      featuredOrder: isFeatured ? (featuredOrder ?? existing.featuredOrder ?? Date.now()) : null,
    },
    include: propertyInclude,
  });

  return mapProperty(record);
}

export async function reorderFeaturedProperties(ids: string[]): Promise<Property[]> {
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.property.update({
        where: { id },
        data: { isFeatured: true, featuredOrder: index + 1 },
      }),
    ),
  );

  return listFeaturedProperties();
}

export async function updatePropertyImages(id: string, images: string[]): Promise<Property | null> {
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return null;

  await prisma.$transaction(async (tx) => {
    await tx.propertyImage.deleteMany({ where: { propertyId: id } });
    if (images.length > 0) {
      await tx.propertyImage.createMany({
        data: images.map((url, index) => ({
          propertyId: id,
          url,
          sortOrder: index,
        })),
      });
    }
  });

  return getPropertyById(id);
}

export async function getPublicPropertyIds(): Promise<string[]> {
  try {
    const connected = await checkDatabaseConnection();
    if (!connected) {
      return mockProperties.filter((property) => property.status !== "draft").map((property) => property.id);
    }

    const records = await prisma.property.findMany({
      where: { status: { not: "draft" } },
      select: { id: true },
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => record.id);
  } catch (error) {
    logError("properties:publicIds", error);
    return mockProperties.filter((property) => property.status !== "draft").map((property) => property.id);
  }
}

export async function countPropertiesByCategorySlug(slug: string): Promise<number> {
  return prisma.property.count({
    where: { category: { slug } },
  });
}

export const getAllProperties = listProperties;
export const getPublicActiveProperties = listActiveProperties;
