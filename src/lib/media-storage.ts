import "server-only";

import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export interface UploadFileInput {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
}

export interface StoredFile {
  url: string;
  storageKey: string;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
}

export function validateUploadFile(input: UploadFileInput): string | null {
  if (!input.buffer.length) return "Empty file";
  if (input.buffer.length > MAX_FILE_SIZE) return "File too large (max 5MB)";

  const extension = ALLOWED_MIME_TYPES.get(input.mimeType);
  if (!extension) return "Unsupported file type";

  return null;
}

export async function uploadImageFile(input: UploadFileInput): Promise<StoredFile> {
  const error = validateUploadFile(input);
  if (error) throw new Error(error);

  const extension = ALLOWED_MIME_TYPES.get(input.mimeType)!;
  const baseName = sanitizeFilename(path.parse(input.originalName).name || "image");
  const storageKey = `${Date.now()}-${randomUUID()}-${baseName}${extension}`;
  const absolutePath = path.join(UPLOAD_DIR, storageKey);

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(absolutePath, input.buffer);

  return {
    url: `/uploads/${storageKey}`,
    storageKey,
  };
}

export async function deleteStoredFile(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return;

  const storageKey = url.replace("/uploads/", "");
  if (storageKey.includes("..") || storageKey.includes("/")) return;

  const absolutePath = path.join(UPLOAD_DIR, storageKey);
  try {
    await unlink(absolutePath);
  } catch {
    // File may already be removed.
  }
}

export async function replaceStoredFile(
  oldUrl: string | null | undefined,
  input: UploadFileInput,
): Promise<StoredFile> {
  const stored = await uploadImageFile(input);
  if (oldUrl) await deleteStoredFile(oldUrl);
  return stored;
}
