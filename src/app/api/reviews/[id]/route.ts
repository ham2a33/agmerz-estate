import { NextRequest } from "next/server";
import { apiNotFound, apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import {
  deleteReview,
  getReviewById,
  updateReview,
} from "@/lib/repositories/reviews";
import { parseJsonRequest } from "@/lib/validation/parse";
import { reviewUpdateSchema } from "@/lib/validation/review";
import { revalidateReviewPages } from "@/lib/revalidate-content";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const review = await getReviewById(id);
    if (!review) return apiNotFound("Review");

    if (requireAdmin(request) !== null && !review.isPublished) {
      return apiNotFound("Review");
    }

    return apiSuccess(review);
  } catch (error) {
    return handleApiError("reviews:GET:id", error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const existing = await getReviewById(id);
    if (!existing) return apiNotFound("Review");

    const parsed = await parseJsonRequest(request, reviewUpdateSchema);
    if (!parsed.success) return parsed.response;

    const review = await updateReview(id, parsed.data);
    revalidateReviewPages();
    return apiSuccess(review);
  } catch (error) {
    return handleApiError("reviews:PATCH:id", error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const deleted = await deleteReview(id);
    if (!deleted) return apiNotFound("Review");

    revalidateReviewPages();
    return apiSuccess({ id });
  } catch (error) {
    return handleApiError("reviews:DELETE:id", error);
  }
}
