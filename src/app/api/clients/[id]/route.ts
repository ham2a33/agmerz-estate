import { NextRequest } from "next/server";
import { apiNotFound, apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { deleteClient, getClientById, updateClient } from "@/lib/clients";
import { formValuesToClientInput } from "@/lib/client-admin-form";
import { parseJsonRequest } from "@/lib/validation/parse";
import { clientFormSchema } from "@/lib/validation/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const client = await getClientById(id);
    if (!client) return apiNotFound("Client");

    return apiSuccess(client);
  } catch (error) {
    return handleApiError("clients:GET:id", error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const existing = await getClientById(id);
    if (!existing) return apiNotFound("Client");

    const parsed = await parseJsonRequest(request, clientFormSchema);
    if (!parsed.success) return parsed.response;

    const updated = await updateClient(id, formValuesToClientInput(parsed.data));
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError("clients:PATCH", error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const deleted = await deleteClient(id);

    if (!deleted) return apiNotFound("Client");

    return apiSuccess({ id });
  } catch (error) {
    return handleApiError("clients:DELETE", error);
  }
}
