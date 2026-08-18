"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

interface ImageUploadButtonProps {
  label?: string;
  onUploaded: (url: string) => void;
  disabled?: boolean;
}

export function ImageUploadButton({
  label = "Загрузить изображение",
  onUploaded,
  disabled = false,
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Upload failed");
      }

      onUploaded(data.data.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        disabled={disabled || loading}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? "Загрузка..." : label}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
