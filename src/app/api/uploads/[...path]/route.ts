import { readFile, stat } from "fs/promises";
import { NextRequest } from "next/server";
import {
  getUploadContentType,
  resolveUploadFilePath,
} from "@/lib/uploads-path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

async function serveUpload(segments: string[]): Promise<Response> {
  const resolved = resolveUploadFilePath(segments);

  if ("error" in resolved) {
    if (resolved.error === "invalid") {
      return new Response("Forbidden", { status: 403 });
    }
    return new Response("Not Found", { status: 404 });
  }

  try {
    const fileStat = await stat(resolved.absolutePath);
    if (!fileStat.isFile()) {
      return new Response("Not Found", { status: 404 });
    }

    const headers = {
      "Content-Type": getUploadContentType(resolved.absolutePath),
      "Content-Length": String(fileStat.size),
      "Cache-Control": "public, max-age=86400",
    };

    return new Response(await readFile(resolved.absolutePath), {
      status: 200,
      headers,
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

async function serveUploadHead(segments: string[]): Promise<Response> {
  const resolved = resolveUploadFilePath(segments);

  if ("error" in resolved) {
    if (resolved.error === "invalid") {
      return new Response(null, { status: 403 });
    }
    return new Response(null, { status: 404 });
  }

  try {
    const fileStat = await stat(resolved.absolutePath);
    if (!fileStat.isFile()) {
      return new Response(null, { status: 404 });
    }

    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": getUploadContentType(resolved.absolutePath),
        "Content-Length": String(fileStat.size),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { path: segments } = await params;
  return serveUpload(segments ?? []);
}

export async function HEAD(_request: NextRequest, { params }: RouteParams) {
  const { path: segments } = await params;
  return serveUploadHead(segments ?? []);
}
