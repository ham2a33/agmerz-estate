import { NextRequest } from "next/server";
import { apiError, apiNotFound, apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import {
  deleteProperty,
  getPropertyById,
  isSlugAvailable,
  updateProperty,
} from "@/lib/properties";
import { formValuesToPropertyInput } from "@/lib/property-form";
import { parseJsonRequest } from "@/lib/validation/parse";
import { propertyFormSchema } from "@/lib/validation/property";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) return apiNotFound("Property");

    return apiSuccess(property);
  } catch (error) {
    return handleApiError("properties:GET:id", error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const existing = await getPropertyById(id);
    if (!existing) return apiNotFound("Property");

    const parsed = await parseJsonRequest(request, propertyFormSchema);
    if (!parsed.success) return parsed.response;

    const input = formValuesToPropertyInput(parsed.data);
    if (!(await isSlugAvailable(input.slug, id))) {
      return apiError("Slug already in use", 409);
    }

    const updated = await updateProperty(id, input);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError("properties:PUT", error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const deleted = await deleteProperty(id);

    if (!deleted) return apiNotFound("Property");

    return apiSuccess({ id });
  } catch (error) {
    return handleApiError("properties:DELETE", error);
  }
}
