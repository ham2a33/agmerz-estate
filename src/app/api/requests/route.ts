import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { apiPaginatedSuccess, handleApiError, rateLimitResponse } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { parsePaginationParams } from "@/lib/pagination";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createRequest, getAllRequests, listRequestsPaginated } from "@/lib/requests";
import { parseJsonRequest } from "@/lib/validation/parse";
import { requestCreateSchema } from "@/lib/validation/request";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const pagination = parsePaginationParams(request.nextUrl.searchParams);

    if (pagination) {
      const result = await listRequestsPaginated(pagination);
      return apiPaginatedSuccess(result);
    }

    return apiSuccess(await getAllRequests());
  } catch (error) {
    return handleApiError("requests:GET", error);
  }
}

export async function POST(request: NextRequest) {
  const rateLimit = enforceRateLimit(request, "requests:create", 10, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfter);
  }

  try {
    const parsed = await parseJsonRequest(request, requestCreateSchema);
    if (!parsed.success) return parsed.response;

    const created = await createRequest({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      type: parsed.data.type,
      budget: parsed.data.budget ?? null,
      district: parsed.data.district ?? null,
      rooms: parsed.data.rooms ?? null,
      message: parsed.data.message,
      internalNotes: "",
      clientId: parsed.data.clientId ?? null,
      propertyId: parsed.data.propertyId ?? null,
    });

    return apiSuccess(created, 201);
  } catch (error) {
    return handleApiError("requests:POST", error);
  }
}
