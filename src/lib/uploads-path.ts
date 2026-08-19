import "server-only";

import path from "path";

export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".avif": "image/avif",
};

type ResolveUploadSuccess = { absolutePath: string };
type ResolveUploadFailure = { error: "invalid" | "not-found" };

export function getUploadContentType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  return CONTENT_TYPE_BY_EXTENSION[extension] ?? "application/octet-stream";
}

export function resolveUploadFilePath(segments: string[]): ResolveUploadSuccess | ResolveUploadFailure {
  if (!segments.length) {
    return { error: "not-found" };
  }

  const decodedSegments: string[] = [];
  for (const segment of segments) {
    if (!segment) {
      return { error: "invalid" };
    }

    let decoded: string;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      return { error: "invalid" };
    }

    if (!decoded || decoded === "." || decoded === "..") {
      return { error: "invalid" };
    }

    if (decoded.includes("/") || decoded.includes("\\") || decoded.includes("\0")) {
      return { error: "invalid" };
    }

    decodedSegments.push(decoded);
  }

  const relativePath = path.join(...decodedSegments);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return { error: "invalid" };
  }

  const uploadsRoot = path.resolve(UPLOADS_DIR);
  const absolutePath = path.resolve(uploadsRoot, relativePath);
  const rootPrefix = uploadsRoot.endsWith(path.sep) ? uploadsRoot : `${uploadsRoot}${path.sep}`;

  if (absolutePath !== uploadsRoot && !absolutePath.startsWith(rootPrefix)) {
    return { error: "invalid" };
  }

  return { absolutePath };
}
