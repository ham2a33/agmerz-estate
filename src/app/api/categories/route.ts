import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { createCategory, getActiveCategories, getAllCategories } from "@/lib/categories";
import { formValuesToCategoryInput } from "@/lib/category-admin-form";
import { parseJsonRequest } from "@/lib/validation/parse";
import { categoryFormSchema } from "@/lib/validation/category";

export async function GET(request: NextRequest) {
  try {
    if (requireAdmin(request) === null) {
      return apiSuccess(await getAllCategories());
    }

    return apiSuccess(await getActiveCategories());
  } catch (error) {
    return handleApiError("categories:GET", error);
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const parsed = await parseJsonRequest(request, categoryFormSchema);
    if (!parsed.success) return parsed.response;

    const category = await createCategory(formValuesToCategoryInput(parsed.data));
    return apiSuccess(category, 201);
  } catch (error) {
    return handleApiError("categories:POST", error);
  }
}
