import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/db";

export async function GET() {
  const databaseConnected = await checkDatabaseConnection();

  if (!databaseConnected) {
    return NextResponse.json(
      {
        status: "degraded",
        database: "disconnected",
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      status: "ok",
      database: "connected",
    },
    { status: 200 },
  );
}
