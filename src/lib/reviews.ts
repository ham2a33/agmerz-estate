import { mockReviews } from "@/lib/mock-data/reviews";
import { listPublishedReviews } from "@/lib/repositories/reviews";
import { checkDatabaseConnection } from "@/lib/db";
import { logError } from "@/lib/logger";
import type { Review } from "@/types";

async function getReviewsWithFallback(): Promise<Review[]> {
  try {
    const connected = await checkDatabaseConnection();
    if (!connected) return mockReviews.filter((review) => review.isPublished);
    return await listPublishedReviews();
  } catch (error) {
    logError("reviews", error);
    return mockReviews.filter((review) => review.isPublished);
  }
}

export async function getPublishedReviews(): Promise<Review[]> {
  return getReviewsWithFallback();
}

export async function getFeaturedReview(): Promise<Review | null> {
  const published = await getPublishedReviews();
  return published[0] ?? null;
}

export function getAverageRating(reviews: Review[]): number | null {
  if (reviews.length === 0) return null;

  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export async function getReviewsWithoutFeatured(featured: Review | null): Promise<Review[]> {
  const published = await getPublishedReviews();
  if (!featured) return published;
  return published.filter((review) => review.id !== featured.id);
}
