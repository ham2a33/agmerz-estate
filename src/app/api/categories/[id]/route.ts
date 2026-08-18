import { NextRequest } from "next/server";
import { apiError, apiNotFound, apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { deleteCategory, getCategoryById, updateCategory } from "@/lib/categories";
import { formValuesToCategoryInput } from "@/lib/category-admin-form";
import { revalidateCategoryPages } from "@/lib/revalidate-content";
import { parseJsonRequest } from "@/lib/validation/parse";
import { categoryFormSchema } from "@/lib/validation/category";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const category = await getCategoryById(id);
    if (!category) return apiNotFound("Category");
    if (!category.isActive) return apiNotFound("Category");

    return apiSuccess(category);
  } catch (error) {
    return handleApiError("categories:GET:id", error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const existing = await getCategoryById(id);
    if (!existing) return apiNotFound("Category");

    const parsed = await parseJsonRequest(request, categoryFormSchema);
    if (!parsed.success) return parsed.response;

    const updated = await updateCategory(id, formValuesToCategoryInput(parsed.data));
    if (!updated) return apiNotFound("Category");

    revalidateCategoryPages(updated.slug);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError("categories:PATCH", error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const result = await deleteCategory(id);

    if (!result.success) {
      if (result.reason === "in_use") {
        return apiError("Category is in use by properties and cannot be deleted", 409);
      }
      return apiNotFound("Category");
    }

    return apiSuccess({ id });
  } catch (error) {
    return handleApiError("categories:DELETE", error);
  }
}
