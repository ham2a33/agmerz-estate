import { NextRequest } from "next/server";
import { apiError, apiNotFound, apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import {
  deleteMediaRecord,
  getMediaById,
  updateMediaRecord,
} from "@/lib/repositories/media";
import { parseJsonRequest } from "@/lib/validation/parse";
import { mediaUpdateSchema } from "@/lib/validation/media";
import { revalidatePublicContent } from "@/lib/revalidate-content";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const media = await getMediaById(id);
    if (!media) return apiNotFound("Media");
    return apiSuccess(media);
  } catch (error) {
    return handleApiError("media:GET:id", error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const parsed = await parseJsonRequest(request, mediaUpdateSchema);
    if (!parsed.success) return parsed.response;

    const media = await updateMediaRecord(id, parsed.data);
    if (!media) return apiNotFound("Media");

    revalidatePublicContent();
    return apiSuccess(media);
  } catch (error) {
    return handleApiError("media:PATCH", error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const deleted = await deleteMediaRecord(id);
    if (!deleted) return apiNotFound("Media");

    revalidatePublicContent();
    return apiSuccess({ id });
  } catch (error) {
    if (error instanceof Error && error.message.includes("in use")) {
      return apiError(error.message, 409);
    }
    return handleApiError("media:DELETE", error);
  }
}
