import { prisma } from "@/lib/db";
import { checkDatabaseConnection } from "@/lib/db";
import { mockCategories } from "@/lib/mock-data/categories";
import { logError } from "@/lib/logger";
import { deleteStoredFile } from "@/lib/media-storage";
import { mapCategory } from "@/lib/mappers";
import type { Category, CategoryCreateInput, CategoryUpdateInput } from "@/types";

const MOCK_ADMIN_CATEGORIES: Category[] = mockCategories.map((category, index) => ({
  id: String(index + 1),
  name: category.title,
  slug: category.slug,
  description: category.description,
  image: category.image,
  isActive: true,
  sortOrder: index + 1,
}));

async function withCategoryFallback<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const connected = await checkDatabaseConnection();
    if (!connected) return fallback;
    return await operation();
  } catch (error) {
    logError("categories", error);
    return fallback;
  }
}

export async function listCategories(): Promise<Category[]> {
  return withCategoryFallback(async () => {
    const records = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return records.map(mapCategory);
  }, MOCK_ADMIN_CATEGORIES);
}

export async function listActiveCategories(): Promise<Category[]> {
  return withCategoryFallback(async () => {
    const records = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return records.map(mapCategory);
  }, MOCK_ADMIN_CATEGORIES.filter((category) => category.isActive));
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return withCategoryFallback(async () => {
    const record = await prisma.category.findUnique({ where: { id } });
    return record ? mapCategory(record) : null;
  }, MOCK_ADMIN_CATEGORIES.find((category) => category.id === id) ?? null);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return withCategoryFallback(async () => {
    const record = await prisma.category.findUnique({ where: { slug } });
    return record ? mapCategory(record) : null;
  }, MOCK_ADMIN_CATEGORIES.find((category) => category.slug === slug) ?? null);
}

export async function resolveCategoryForProperty(slug: string) {
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return existing;

  const mockIndex = mockCategories.findIndex((category) => category.slug === slug);
  const mock = mockIndex >= 0 ? mockCategories[mockIndex] : null;
  if (!mock) {
    throw new Error(`Category not found: ${slug}`);
  }

  const id = await generateCategoryId();

  return prisma.category.create({
    data: {
      id,
      name: mock.title,
      slug: mock.slug,
      description: mock.description,
      image: mock.image,
      isActive: true,
      sortOrder: mockIndex + 1,
    },
  });
}

async function generateCategoryId(): Promise<string> {
  const result = await prisma.category.findMany({ select: { id: true } });
  const numericIds = result
    .map((item) => Number(item.id))
    .filter((value) => Number.isFinite(value));

  const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  return String(nextId);
}

export async function createCategory(input: CategoryCreateInput): Promise<Category> {
  const record = await prisma.category.create({
    data: {
      id: await generateCategoryId(),
      name: input.name,
      slug: input.slug,
      description: input.description,
      image: input.image,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
    },
  });

  return mapCategory(record);
}

export async function setCategoryImage(
  id: string,
  image: string | null,
): Promise<Category | null> {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return null;

  const oldImage = existing.image;
  if (oldImage === image) return mapCategory(existing);

  const record = await prisma.category.update({
    where: { id },
    data: { image },
  });

  if (oldImage && oldImage !== image) {
    await deleteStoredFile(oldImage);
  }

  return mapCategory(record);
}

export async function updateCategory(
  id: string,
  input: CategoryUpdateInput,
): Promise<Category | null> {
  try {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return null;

    const record = await prisma.category.update({
      where: { id },
      data: input,
    });

    if (
      input.image !== undefined &&
      existing.image &&
      existing.image !== input.image
    ) {
      await deleteStoredFile(existing.image);
    }

    return mapCategory(record);
  } catch {
    return null;
  }
}

export async function deleteCategory(id: string): Promise<{ success: boolean; reason?: "in_use" }> {
  const count = await prisma.property.count({ where: { categoryId: id } });
  if (count > 0) {
    return { success: false, reason: "in_use" };
  }

  try {
    await prisma.category.delete({ where: { id } });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function isCategoryInUse(id: string): Promise<boolean> {
  const count = await prisma.property.count({ where: { categoryId: id } });
  return count > 0;
}

export const getAllCategories = listCategories;
export const getActiveCategories = listActiveCategories;
