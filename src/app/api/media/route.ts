import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { createMediaRecord, listMedia } from "@/lib/repositories/media";
import { uploadImageFile, validateUploadFile } from "@/lib/media-storage";
import { revalidatePublicContent } from "@/lib/revalidate-content";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    return apiSuccess(await listMedia());
  } catch (error) {
    return handleApiError("media:GET", error);
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return apiError("File is required", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const validationError = validateUploadFile({
      buffer,
      mimeType: file.type,
      originalName: file.name,
    });

    if (validationError) return apiError(validationError, 400);

    const stored = await uploadImageFile({
      buffer,
      mimeType: file.type,
      originalName: file.name,
    });

    const media = await createMediaRecord({
      url: stored.url,
      title: (formData.get("title") as string | null) ?? file.name,
      alt: (formData.get("alt") as string | null) ?? null,
    });

    revalidatePublicContent();
    return apiSuccess(media, 201);
  } catch (error) {
    return handleApiError("media:POST", error);
  }
}
