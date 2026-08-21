import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";
import { apiPaginatedSuccess, handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { parsePaginationParams } from "@/lib/pagination";
import {
  createProperty,
  getAllProperties,
  getPublicActiveProperties,
  isSlugAvailable,
  listPropertiesPaginated,
} from "@/lib/properties";
import { formValuesToPropertyInput } from "@/lib/property-form";
import { revalidatePropertyPages } from "@/lib/revalidate-content";
import { parseJsonRequest } from "@/lib/validation/parse";
import { propertyFormSchema } from "@/lib/validation/property";

export async function GET(request: NextRequest) {
  try {
    const pagination = parsePaginationParams(request.nextUrl.searchParams);
    const isAdmin = requireAdmin(request) === null;

    if (pagination) {
      const result = isAdmin
        ? await listPropertiesPaginated(pagination)
        : await listPropertiesPaginated(pagination, { status: "active" });

      return apiPaginatedSuccess(result);
    }

    const data = isAdmin ? await getAllProperties() : await getPublicActiveProperties();
    return apiSuccess(data);
  } catch (error) {
    return handleApiError("properties:GET", error);
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const parsed = await parseJsonRequest(request, propertyFormSchema);
    if (!parsed.success) return parsed.response;

    const input = formValuesToPropertyInput(parsed.data);
    if (!(await isSlugAvailable(input.slug))) {
      return apiError("Slug already in use", 409);
    }

    const property = await createProperty(input);
    revalidatePropertyPages(property.id);
    return apiSuccess(property, 201);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Category not found")) {
      return apiError(
        "Категория не найдена в базе данных. Убедитесь, что выполнен prisma db seed.",
        400,
      );
    }
    return handleApiError("properties:POST", error);
  }
}
