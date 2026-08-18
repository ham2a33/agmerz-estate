const SENSITIVE_PATTERNS = [
  /password/i,
  /passwordhash/i,
  /database_url/i,
  /admin_password/i,
  /agmerz_admin_token/i,
  /cookie/i,
  /authorization/i,
  /bearer/i,
];

function sanitizeMessage(message: string): string {
  let sanitized = message;

  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(sanitized)) {
      return "Sensitive error redacted";
    }
  }

  if (sanitized.includes("postgresql://")) {
    sanitized = sanitized.replace(/postgresql:\/\/[^\s]+/g, "postgresql://[redacted]");
  }

  return sanitized;
}

export function logError(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[AGMERZ:${context}]`, sanitizeMessage(message));
}

export function logInfo(context: string, message: string): void {
  console.info(`[AGMERZ:${context}]`, sanitizeMessage(message));
}
