import { prisma } from "@/lib/db";
import { mapReview } from "@/lib/mappers";
import type { Review } from "@/types";
import type { ReviewCreateSchema, ReviewUpdateSchema } from "@/lib/validation/review";

export async function listPublishedReviews(): Promise<Review[]> {
  const records = await prisma.review.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return records.map(mapReview);
}

export async function getReviewById(id: string): Promise<Review | null> {
  const record = await prisma.review.findUnique({ where: { id } });
  return record ? mapReview(record) : null;
}

export async function listReviews(): Promise<Review[]> {
  const records = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  return records.map(mapReview);
}

async function generateReviewId(): Promise<string> {
  const records = await prisma.review.findMany({ select: { id: true } });
  const numericIds = records.map((item) => Number(item.id)).filter((value) => Number.isFinite(value));
  return String(numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1);
}

export async function createReview(input: ReviewCreateSchema) {
  const id = await generateReviewId();
  const record = await prisma.review.create({
    data: {
      id,
      name: input.name,
      avatar: input.avatar ?? null,
      rating: input.rating,
      text: input.text,
      isPublished: input.isPublished ?? true,
    },
  });

  return mapReview(record);
}

export async function updateReview(id: string, input: ReviewUpdateSchema) {
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) return null;

  const record = await prisma.review.update({
    where: { id },
    data: {
      name: input.name,
      avatar: input.avatar,
      rating: input.rating,
      text: input.text,
      isPublished: input.isPublished,
    },
  });

  return mapReview(record);
}

export async function deleteReview(id: string): Promise<boolean> {
  try {
    await prisma.review.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
