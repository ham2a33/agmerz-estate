"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Удалить",
  onConfirm,
  onCancel,
  loading = false,
}: AdminConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    document.addEventListener("keydown", handleEscape);
    cancelRef.current?.focus();

    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Закрыть диалог"
        className="absolute inset-0 bg-foreground/20"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg"
      >
        <h2 id="confirm-dialog-title" className="text-lg font-medium text-foreground">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-border bg-surface px-6 py-3 text-sm font-medium"
            onClick={onCancel}
            disabled={loading}
          >
            Отмена
          </button>
          <Button type="button" variant="dark" onClick={onConfirm} disabled={loading}>
            {loading ? "Удаление..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
