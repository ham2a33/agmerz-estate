import { NextRequest } from "next/server";
import { apiError, apiNotFound, apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { getCategoryById, setCategoryImage } from "@/lib/categories";
import { createMediaRecord } from "@/lib/repositories/media";
import { uploadImageFile, validateUploadFile } from "@/lib/media-storage";
import { revalidateCategoryPages } from "@/lib/revalidate-content";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const category = await getCategoryById(id);
    if (!category) return apiNotFound("Category");

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

    await createMediaRecord({
      url: stored.url,
      title: `Category: ${category.name}`,
      alt: category.name,
    });

    const updated = await setCategoryImage(id, stored.url);
    if (!updated) return apiNotFound("Category");

    revalidateCategoryPages(category.slug);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError("categories:image:POST", error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const category = await getCategoryById(id);
    if (!category) return apiNotFound("Category");

    const updated = await setCategoryImage(id, null);
    if (!updated) return apiNotFound("Category");

    revalidateCategoryPages(category.slug);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError("categories:image:DELETE", error);
  }
}
