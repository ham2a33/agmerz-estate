import { NextRequest } from "next/server";
import { apiNotFound, apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { deleteRequest, getRequestById, updateRequest } from "@/lib/requests";
import { formValuesToRequestUpdate } from "@/lib/request-admin-form";
import { parseJsonRequest } from "@/lib/validation/parse";
import { requestUpdateSchema } from "@/lib/validation/request";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const item = await getRequestById(id);
    if (!item) return apiNotFound("Request");

    return apiSuccess(item);
  } catch (error) {
    return handleApiError("requests:GET:id", error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const existing = await getRequestById(id);
    if (!existing) return apiNotFound("Request");

    const parsed = await parseJsonRequest(request, requestUpdateSchema);
    if (!parsed.success) return parsed.response;

    const updated = await updateRequest(id, formValuesToRequestUpdate(parsed.data));
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError("requests:PUT", error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const deleted = await deleteRequest(id);

    if (!deleted) return apiNotFound("Request");

    return apiSuccess({ id });
  } catch (error) {
    return handleApiError("requests:DELETE", error);
  }
}
