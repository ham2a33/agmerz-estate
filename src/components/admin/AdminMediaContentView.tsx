"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { ResolvedImageSlot } from "@/lib/image-slots/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AdminMediaContentSlotEditorProps {
  slot: ResolvedImageSlot;
  onUpdated: (slot: ResolvedImageSlot) => void;
}

export function AdminMediaContentSlotEditor({
  slot,
  onUpdated,
}: AdminMediaContentSlotEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState(slot.alt);
  const [uploading, setUploading] = useState(false);
  const [savingAlt, setSavingAlt] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");
  const [previewError, setPreviewError] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", slot.label);

      const uploadResponse = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.error ?? "Upload failed");
      }

      const patchResponse = await fetch("/api/media-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: slot.id,
          url: uploadData.data.url,
          alt,
        }),
      });
      const patchData = await patchResponse.json();

      if (!patchResponse.ok || !patchData.success) {
        throw new Error(patchData.error ?? "Failed to save slot");
      }

      setPreviewError(false);
      onUpdated(patchData.data.slot);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function saveAlt() {
    setSavingAlt(true);
    setError("");

    try {
      const response = await fetch("/api/media-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: slot.id, alt }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Failed to save alt text");
      }
      onUpdated(data.data.slot);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save alt text");
    } finally {
      setSavingAlt(false);
    }
  }

  async function clearImage() {
    setClearing(true);
    setError("");

    try {
      const response = await fetch("/api/media-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: slot.id, action: "clear" }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Failed to clear image");
      }
      setPreviewError(false);
      onUpdated(data.data.slot);
    } catch (clearError) {
      setError(clearError instanceof Error ? clearError.message : "Failed to clear image");
    } finally {
      setClearing(false);
    }
  }

  if (!slot.editable) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface-muted/30 p-5">
        <p className="text-sm font-medium text-foreground">{slot.label}</p>
        <p className="mt-2 text-sm text-muted">{slot.usage}</p>
        {slot.adminPath && (
          <Link
            href={slot.adminPath}
            className="mt-4 inline-flex text-sm font-medium text-accent hover:underline"
          >
            Перейти в раздел управления →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{slot.label}</p>
          <p className="mt-1 text-xs text-muted">{slot.usage}</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {slot.url && !previewError ? (
          <div className="relative aspect-[16/10] max-w-md overflow-hidden rounded-xl border border-border bg-surface-muted">
            <Image
              src={slot.url}
              alt={slot.alt || slot.label}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              onError={() => setPreviewError(true)}
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-6 py-10 text-center">
            <p className="text-sm text-muted">
              {slot.url && previewError ? "Не удалось загрузить preview" : "Изображение не задано"}
            </p>
          </div>
        )}

        <Input
          label="Alt-текст"
          value={alt}
          onChange={(event) => setAlt(event.target.value)}
        />

        <div className="flex flex-wrap gap-2">
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
          <Button
            type="button"
            variant="dark"
            disabled={uploading || clearing}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Загрузка..." : slot.url ? "Заменить изображение" : "Загрузить изображение"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={savingAlt || uploading}
            onClick={() => void saveAlt()}
          >
            {savingAlt ? "Сохранение..." : "Сохранить alt"}
          </Button>
          {slot.url && (
            <Button
              type="button"
              variant="outline"
              disabled={uploading || clearing}
              onClick={() => void clearImage()}
            >
              {clearing ? "Удаление..." : "Удалить"}
            </Button>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

interface AdminMediaContentViewProps {
  initialSlots: ResolvedImageSlot[];
}

export function AdminMediaContentView({ initialSlots }: AdminMediaContentViewProps) {
  const [slots, setSlots] = useState(initialSlots);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      Array.from(new Set(initialSlots.map((slot) => slot.group))).map((group) => [group, true]),
    ),
  );

  const groupedSlots = useMemo(() => {
    const groups = new Map<string, ResolvedImageSlot[]>();
    for (const slot of slots) {
      const list = groups.get(slot.group) ?? [];
      list.push(slot);
      groups.set(slot.group, list);
    }
    return Array.from(groups.entries());
  }, [slots]);

  function handleSlotUpdated(updated: ResolvedImageSlot) {
    setSlots((current) => current.map((slot) => (slot.id === updated.id ? updated : slot)));
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 px-4 py-6 md:px-6 md:py-8">
      <div>
        <h2 className="font-serif text-2xl text-foreground md:text-3xl">Изображения сайта</h2>
        <p className="mt-2 text-sm text-muted">
          Управление всеми фотографиями публичного сайта. Каждое изображение заменяется отдельно.
        </p>
      </div>

      <div className="space-y-4">
        {groupedSlots.map(([group, groupSlots]) => (
          <section key={group} className="overflow-hidden rounded-xl border border-border bg-surface">
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              onClick={() =>
                setOpenGroups((current) => ({ ...current, [group]: !current[group] }))
              }
            >
              <span className="text-sm font-medium uppercase tracking-[0.16em] text-foreground">
                {group}
              </span>
              <span className="text-xs text-muted">
                {openGroups[group] ? "Свернуть" : "Развернуть"} · {groupSlots.length}
              </span>
            </button>

            {openGroups[group] && (
              <div className="space-y-4 border-t border-border px-5 py-5">
                {groupSlots.map((slot) => (
                  <AdminMediaContentSlotEditor
                    key={slot.id}
                    slot={slot}
                    onUpdated={handleSlotUpdated}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
