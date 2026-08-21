import { ZodError, type ZodType } from "zod";
import { apiError } from "@/lib/api-response";
import { NextResponse } from "next/server";
import { PROPERTY_FORM_FIELD_LABELS } from "@/lib/validation/property";

function formatFieldPath(path: PropertyKey[]): string {
  if (path.length === 0) return "body";

  const parts: string[] = [];

  for (let index = 0; index < path.length; index++) {
    const segment = path[index];

    if (typeof segment === "number") {
      if (index > 0 && typeof path[index - 1] === "string") {
        parts[parts.length - 1] = `${parts[parts.length - 1]} ${segment + 1}`;
      } else {
        parts.push(String(segment + 1));
      }
      continue;
    }

    if (typeof segment !== "string") continue;

    parts.push(PROPERTY_FORM_FIELD_LABELS[segment] ?? segment);
  }

  return parts.join(" → ");
}

export function formatValidationError(error: ZodError): string {
  const details = error.issues.map((issue) => {
    const path = formatFieldPath(issue.path);
    return `${path}: ${issue.message}`;
  });

  return details.join("; ") || "Некорректные данные формы";
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
    return { success: false, response: apiError("Некорректный JSON в теле запроса", 400) };
  }
}

export function parseValidationErrorFields(message: string): Record<string, string> {
  const fields: Record<string, string> = {};

  for (const part of message.split(";")) {
    const trimmed = part.trim();
    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex <= 0) continue;

    const rawField = trimmed.slice(0, separatorIndex).trim();
    const fieldMessage = trimmed.slice(separatorIndex + 1).trim();
    if (!fieldMessage) continue;

    const fieldKey = Object.entries(PROPERTY_FORM_FIELD_LABELS).find(
      ([, label]) => label === rawField || rawField.startsWith(`${label} `),
    )?.[0];

    if (fieldKey === "images" && /\d+$/.test(rawField)) {
      const imageIndex = Number(rawField.match(/\d+$/)?.[0] ?? "1") - 1;
      fields[`images.${imageIndex}`] = fieldMessage;
      continue;
    }

    if (fieldKey) {
      fields[fieldKey] = fieldMessage;
    }
  }

  return fields;
}
