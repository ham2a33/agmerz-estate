import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { createReview, listPublishedReviews, listReviews } from "@/lib/repositories/reviews";
import { parseJsonRequest } from "@/lib/validation/parse";
import { reviewCreateSchema } from "@/lib/validation/review";
import { revalidateReviewPages } from "@/lib/revalidate-content";

export async function GET(request: NextRequest) {
  try {
    if (requireAdmin(request) === null) {
      return apiSuccess(await listReviews());
    }

    return apiSuccess(await listPublishedReviews());
  } catch (error) {
    return handleApiError("reviews:GET", error);
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const parsed = await parseJsonRequest(request, reviewCreateSchema);
    if (!parsed.success) return parsed.response;

    const review = await createReview(parsed.data);
    revalidateReviewPages();
    return apiSuccess(review, 201);
  } catch (error) {
    return handleApiError("reviews:POST", error);
  }
}
