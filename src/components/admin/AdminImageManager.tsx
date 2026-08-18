"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { isValidUrl } from "@/lib/property-form";

interface AdminImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  errors?: Record<string, string>;
}

export function AdminImageManager({ images, onChange, errors = {} }: AdminImageManagerProps) {
  const [newUrl, setNewUrl] = useState("");
  const [inputError, setInputError] = useState("");

  function addImage() {
    const trimmed = newUrl.trim();
    if (!trimmed) {
      setInputError("Укажите URL изображения");
      return;
    }
    if (!isValidUrl(trimmed)) {
      setInputError("Укажите корректный URL");
      return;
    }

    onChange([...images, trimmed]);
    setNewUrl("");
    setInputError("");
  }

  function removeImage(index: number) {
    onChange(images.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const next = [...images];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="rounded-xl border border-border bg-surface p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-muted">
              <Image
                src={image}
                alt={`Изображение ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 240px"
                className="object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-foreground px-2 py-1 text-xs text-surface">
                  Cover
                </span>
              )}
            </div>
            <p className="mt-2 truncate text-xs text-muted">{image}</p>
            {errors[`images.${index}`] && (
              <p className="mt-1 text-xs text-red-600">{errors[`images.${index}`]}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                aria-label="Переместить выше"
                className="rounded-lg border border-border px-2 py-1 text-xs"
                onClick={() => moveImage(index, -1)}
                disabled={index === 0}
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="Переместить ниже"
                className="rounded-lg border border-border px-2 py-1 text-xs"
                onClick={() => moveImage(index, 1)}
                disabled={index === images.length - 1}
              >
                ↓
              </button>
              <button
                type="button"
                className="rounded-lg border border-border px-2 py-1 text-xs"
                onClick={() => {
                  const next = [...images];
                  const [selected] = next.splice(index, 1);
                  next.unshift(selected);
                  onChange(next);
                }}
                disabled={index === 0}
              >
                Main
              </button>
              <ImageUploadButton
                label="Заменить"
                onUploaded={(url) => {
                  const next = [...images];
                  next[index] = url;
                  onChange(next);
                }}
              />
              <button
                type="button"
                className="rounded-lg border border-border px-2 py-1 text-xs text-red-600"
                onClick={() => removeImage(index)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          label="URL изображения"
          value={newUrl}
          onChange={(event) => {
            setNewUrl(event.target.value);
            setInputError("");
          }}
          placeholder="https://..."
          className="flex-1"
        />
        <div className="flex flex-wrap gap-2 sm:pt-7">
          <Button type="button" variant="outline" onClick={addImage}>
            + URL
          </Button>
          <ImageUploadButton
            label="Загрузить"
            onUploaded={(url) => onChange([...images, url])}
          />
        </div>
      </div>
      {inputError && <p className="text-sm text-red-600">{inputError}</p>}
    </div>
  );
}
