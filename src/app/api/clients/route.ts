import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { apiPaginatedSuccess, handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { parsePaginationParams } from "@/lib/pagination";
import { createClient, getAllClients, listClientsPaginated } from "@/lib/clients";
import { formValuesToClientInput } from "@/lib/client-admin-form";
import { parseJsonRequest } from "@/lib/validation/parse";
import { clientFormSchema } from "@/lib/validation/client";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const pagination = parsePaginationParams(request.nextUrl.searchParams);

    if (pagination) {
      const result = await listClientsPaginated(pagination);
      return apiPaginatedSuccess(result);
    }

    return apiSuccess(await getAllClients());
  } catch (error) {
    return handleApiError("clients:GET", error);
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const parsed = await parseJsonRequest(request, clientFormSchema);
    if (!parsed.success) return parsed.response;

    const client = await createClient(formValuesToClientInput(parsed.data));
    return apiSuccess(client, 201);
  } catch (error) {
    return handleApiError("clients:POST", error);
  }
}
