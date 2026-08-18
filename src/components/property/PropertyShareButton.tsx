"use client";

import { useState } from "react";

interface PropertyShareButtonProps {
  title: string;
  url: string;
}

export function PropertyShareButton({ title, url }: PropertyShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or share failed — fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/20 hover:bg-surface-muted"
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
      </svg>
      {copied ? "Ссылка скопирована" : "Поделиться"}
    </button>
  );
}
