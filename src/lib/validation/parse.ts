import { ZodError, type ZodType } from "zod";
import { apiError } from "@/lib/api-response";
import { NextResponse } from "next/server";

export function formatValidationError(error: ZodError): string {
  const details = error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "body";
      return `${path}: ${issue.message}`;
    })
    .join("; ");

  return details || "Invalid request payload";
}

export function validationErrorResponse(error: ZodError): NextResponse {
  return apiError(formatValidationError(error), 400);
}

export function parseBody<T>(
  schema: ZodType<T>,
  body: unknown,
): { success: true; data: T } | { success: false; response: NextResponse } {
  const result = schema.safeParse(body);

  if (!result.success) {
    return { success: false, response: validationErrorResponse(result.error) };
  }

  return { success: true, data: result.data };
}

export async function parseJsonRequest<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json();
    return parseBody(schema, body);
  } catch {
    return { success: false, response: apiError("Invalid JSON body", 400) };
  }
}
