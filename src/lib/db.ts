import "server-only";

import { Prisma, PrismaClient } from "@prisma/client";

const CONNECTION_ERROR_CODES = new Set([
  "P1001",
  "P1002",
  "P1008",
  "P1011",
  "P1017",
]);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  basePrisma: PrismaClient | undefined;
};

function createBasePrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export function isDatabaseConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return CONNECTION_ERROR_CODES.has(error.code);
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("can't reach database") ||
      message.includes("connection refused") ||
      message.includes("server has closed the connection") ||
      message.includes("econnrefused") ||
      message.includes("connect timeout") ||
      message.includes("connection terminated")
    );
  }
  return false;
}

async function reconnectDatabase(base: PrismaClient): Promise<void> {
  try {
    await base.$disconnect();
  } catch {
    // ignore disconnect errors while resetting the pool
  }
  await base.$connect();
}

export async function executeWithReconnect<T>(
  operation: () => Promise<T>,
  retries = 1,
): Promise<T> {
  const base = getBasePrismaClient();

  try {
    return await operation();
  } catch (error) {
    if (retries <= 0 || !isDatabaseConnectionError(error)) {
      throw error;
    }

    await reconnectDatabase(base);
    return executeWithReconnect(operation, retries - 1);
  }
}

function createPrismaClient(): PrismaClient {
  const base = getBasePrismaClient();

  return base.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          return executeWithReconnect(() => query(args));
        },
      },
    },
  }) as unknown as PrismaClient;
}

function getBasePrismaClient(): PrismaClient {
  if (!globalForPrisma.basePrisma) {
    globalForPrisma.basePrisma = createBasePrismaClient();
  }
  return globalForPrisma.basePrisma;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await executeWithReconnect(() => prisma.$queryRaw`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}
