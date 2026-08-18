import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function apiNotFound(resource = "Resource") {
  return apiError(`${resource} not found`, 404);
}

export function apiUnauthorized(message = "Unauthorized") {
  return apiError(message, 401);
}
