import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { apiUnauthorized } from "./api-response";
import { validateUserPassword } from "@/lib/repositories/users";

const AUTH_COOKIE = "agmerz_admin_token";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL ?? "admin@agmerz.ru",
    password: process.env.ADMIN_PASSWORD ?? "admin123",
  };
}

export async function validateAdminCredentials(email: string, password: string): Promise<boolean> {
  try {
    const valid = await validateUserPassword(email, password);
    if (valid) return true;
  } catch {
    // Fall back to env credentials if database is unavailable during bootstrap.
  }

  const credentials = getAdminCredentials();
  return email === credentials.email && password === credentials.password;
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  };
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  return Boolean(token);
}

export async function isAuthenticatedServer(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(AUTH_COOKIE)?.value);
}

export async function requireAdminSession(): Promise<void> {
  if (!(await isAuthenticatedServer())) {
    redirect("/admin/login");
  }
}

export function requireAdmin(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return apiUnauthorized("Admin authentication required");
  }
  return null;
}

export const AUTH_COOKIE_NAME = AUTH_COOKIE;
