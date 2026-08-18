import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  validateAdminCredentials,
} from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { handleApiError, rateLimitResponse } from "@/lib/api-utils";
import { enforceRateLimit } from "@/lib/rate-limit";
import { parseJsonRequest } from "@/lib/validation/parse";
import { authLoginSchema } from "@/lib/validation/auth";

export async function POST(request: NextRequest) {
  const rateLimit = enforceRateLimit(request, "auth:login", 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfter);
  }

  try {
    const parsed = await parseJsonRequest(request, authLoginSchema);
    if (!parsed.success) return parsed.response;

    const { email, password } = parsed.data;

    if (!(await validateAdminCredentials(email, password))) {
      return apiError("Invalid email or password", 401);
    }

    const response = apiSuccess({ message: "Authenticated" });
    response.cookies.set(AUTH_COOKIE_NAME, "admin-session", getAuthCookieOptions());

    return response;
  } catch (error) {
    return handleApiError("auth:POST", error);
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, data: { message: "Logged out" } });
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...getAuthCookieOptions(),
    maxAge: 0,
  });

  return response;
}
