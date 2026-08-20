"use client";

import Image from "next/image";
import { useState } from "react";
import type { PageHeroConfig } from "@/types/pages";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploadButton } from "./ImageUploadButton";

interface AdminPageHeroEditorProps {
  pageLabel: string;
  value: PageHeroConfig;
  onChange: (value: PageHeroConfig) => void;
}

export function AdminPageHeroEditor({ pageLabel, value, onChange }: AdminPageHeroEditorProps) {
  const [imageError, setImageError] = useState(false);

  function updateField<K extends keyof PageHeroConfig>(key: K, fieldValue: PageHeroConfig[K]) {
    onChange({ ...value, [key]: fieldValue });
    if (key === "imageUrl") {
      setImageError(false);
    }
  }

  return (
    <div className="space-y-4">
      <Input
        label="Заголовок"
        value={value.title}
        onChange={(event) => updateField("title", event.target.value)}
      />

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Описание</span>
        <textarea
          value={value.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows={4}
          className="rounded-lg border border-border bg-surface px-4 py-3"
        />
      </label>

      <div className="space-y-3 rounded-lg border border-border p-4">
        <p className="text-sm font-medium text-foreground">Hero-изображение</p>

        {value.imageUrl && !imageError ? (
          <div className="relative aspect-[16/10] max-w-md overflow-hidden rounded-xl border border-border bg-surface-muted">
            <Image
              src={value.imageUrl}
              alt={pageLabel}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : value.imageUrl && imageError ? (
          <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-6 py-8 text-center">
            <p className="text-sm text-muted">Не удалось загрузить preview</p>
            <p className="mt-2 break-all text-xs text-muted">{value.imageUrl}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-6 py-10 text-center">
            <p className="text-sm text-muted">Изображение не загружено</p>
          </div>
        )}

        <Input
          label="URL изображения"
          value={value.imageUrl}
          onChange={(event) => updateField("imageUrl", event.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          <ImageUploadButton
            label={value.imageUrl ? "Заменить изображение" : "Загрузить изображение"}
            onUploaded={(url) => updateField("imageUrl", url)}
          />
          {value.imageUrl && (
            <Button type="button" variant="outline" onClick={() => updateField("imageUrl", "")}>
              Удалить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
