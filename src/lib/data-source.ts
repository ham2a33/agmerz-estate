import "server-only";

/** Mock/static fallbacks are only for local dev when PostgreSQL is unavailable. */
export function shouldUseMockDataFallback(): boolean {
  return process.env.NODE_ENV !== "production";
}
