import { apiError } from "@/lib/api-response";
import { isDatabaseConnectionError } from "@/lib/db";
import { logError } from "@/lib/logger";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { formatValidationError } from "@/lib/validation/parse";

export function handleApiError(context: string, error: unknown) {
  logError(context, error);

  if (error instanceof ZodError) {
    return apiError(formatValidationError(error), 400);
  }

  if (isDatabaseConnectionError(error)) {
    return apiError("Database unavailable", 503);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return apiError("Duplicate value violates unique constraint", 409);
    }
    if (error.code === "P2025") {
      return apiError("Resource not found", 404);
    }
    if (error.code === "P2003") {
      return apiError("Related resource not found", 404);
    }
  }

  if (error instanceof Error && error.message === "Property not found") {
    return apiError("Property not found", 404);
  }

  return apiError("Internal server error", 500);
}

export function apiPaginatedSuccess<T>(result: {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}) {
  return NextResponse.json({ success: true, data: result });
}

export function rateLimitResponse(retryAfter: number) {
  const response = apiError("Too many requests", 429);
  response.headers.set("Retry-After", String(retryAfter));
  return response;
}
