"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/format";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { ImageUploadButton } from "./ImageUploadButton";

interface MediaItem {
  id: string;
  url: string;
  type: string;
  alt: string | null;
  title: string | null;
  createdAt: string;
  usage: string[];
}

export function AdminMediaView() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function loadMedia() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/media");
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError("Не удалось загрузить медиа.");
        return;
      }

      setMedia(data.data);
    } catch {
      setError("Не удалось загрузить медиа.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`/api/media/${deleteTarget.id}`, { method: "DELETE" });
      const data = await response.json();

      if (response.status === 409) {
        setDeleteError(data.error ?? "Файл используется и не может быть удалён.");
        return;
      }

      if (!response.ok || !data.success) return;

      setMedia((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  function handleUploaded() {
    loadMedia();
  }

  return (
    <>
      <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-foreground md:text-3xl">Медиа</h2>
            <p className="mt-2 text-sm text-muted">Библиотека изображений сайта</p>
          </div>
          <ImageUploadButton label="Загрузить файл" onUploaded={() => handleUploaded()} />
        </div>

        {loading && (
          <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center text-sm text-muted">
            Загрузка...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              className="mt-4 rounded-2xl border border-border px-6 py-3 text-sm font-medium"
              onClick={loadMedia}
            >
              Повторить
            </button>
          </div>
        )}

        {!loading && !error && media.length === 0 && (
          <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
            <h3 className="text-lg font-medium text-foreground">Файлов пока нет</h3>
            <p className="mt-3 text-sm text-muted">Загрузите первое изображение.</p>
            <div className="mt-6 flex justify-center">
              <ImageUploadButton label="Загрузить файл" onUploaded={() => handleUploaded()} />
            </div>
          </div>
        )}

        {!loading && !error && media.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {media.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border border-border bg-surface"
              >
                <div className="relative aspect-square bg-surface-muted">
                  <Image
                    src={item.url}
                    alt={item.alt ?? item.title ?? "Media"}
                    fill
                    sizes="(max-width: 640px) 50vw, 240px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.title ?? "Без названия"}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted">{item.url}</p>
                    <p className="mt-1 text-xs text-muted">{formatDate(item.createdAt)}</p>
                  </div>

                  {item.usage.length > 0 ? (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted">
                        Использование
                      </p>
                      <ul className="mt-1 space-y-1">
                        {item.usage.map((usage) => (
                          <li key={usage} className="text-xs text-foreground">
                            {usage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-xs text-muted">Не используется</p>
                  )}

                  <button
                    type="button"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm text-red-600 disabled:opacity-50"
                    onClick={() => {
                      setDeleteError("");
                      setDeleteTarget(item);
                    }}
                    disabled={item.usage.length > 0}
                    title={
                      item.usage.length > 0
                        ? "Файл используется и не может быть удалён"
                        : undefined
                    }
                  >
                    Удалить
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Удалить файл?"
        description={
          deleteTarget
            ? deleteError ||
              `Вы действительно хотите удалить «${deleteTarget.title ?? deleteTarget.url}»?`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError("");
        }}
        loading={deleting}
      />
    </>
  );
}
