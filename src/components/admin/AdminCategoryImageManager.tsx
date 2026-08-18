"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { getCategoryImageUrl } from "@/lib/category-image-fallback";
import type { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

interface AdminCategoryImageManagerProps {
  category: Category;
}

export function AdminCategoryImageManager({ category }: AdminCategoryImageManagerProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = category.image ? category.image : null;
  const fallbackUrl = getCategoryImageUrl(category);

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/categories/${category.id}/image`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Upload failed");
      }

      router.refresh();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/categories/${category.id}/image`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Delete failed");
      }

      setDeleteOpen(false);
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
        <h2 className="text-base font-medium text-foreground">Фотография категории</h2>

        <div className="mt-4 space-y-4">
          {previewUrl ? (
            <div className="relative aspect-[16/10] max-w-md overflow-hidden rounded-xl border border-border bg-surface-muted">
              <Image
                src={previewUrl}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-6 py-10 text-center">
              <p className="text-sm text-muted">Изображение категории не загружено</p>
              <p className="mt-2 text-xs text-muted">
                На public site будет использован fallback:{" "}
                <span className="text-foreground">{fallbackUrl}</span>
              </p>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadFile(file);
            }}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="dark"
              disabled={uploading || deleting}
              onClick={() => inputRef.current?.click()}
            >
              {uploading
                ? "Загрузка..."
                : previewUrl
                  ? "Заменить"
                  : "Загрузить фотографию"}
            </Button>

            {previewUrl && (
              <Button
                type="button"
                variant="outline"
                disabled={uploading || deleting}
                onClick={() => {
                  setError("");
                  setDeleteOpen(true);
                }}
              >
                Удалить
              </Button>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </section>

      <AdminConfirmDialog
        open={deleteOpen}
        title="Удалить фотографию категории?"
        description={`Фотография категории «${category.name}» будет удалена. На public site будет показан fallback.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </>
  );
}
