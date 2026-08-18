"use client";

import { useState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
  showLabel?: boolean;
}

export function FavoriteButton({ propertyId, className = "", showLabel = false }: FavoriteButtonProps) {
  const [active, setActive] = useState(() => isFavorite(propertyId));

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleFavorite(propertyId);
    setActive(result.isFavorite);
  }

  if (showLabel) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/20 hover:bg-surface-muted ${className}`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-[18px] w-[18px] ${active ? "fill-accent stroke-accent" : "fill-none stroke-foreground"}`}
          strokeWidth={1.5}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {active ? "В избранном" : "Добавить в избранное"}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
      onClick={handleClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 backdrop-blur-sm transition-colors hover:bg-surface ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-[18px] w-[18px] transition-colors ${active ? "fill-accent stroke-accent" : "fill-none stroke-foreground"}`}
        strokeWidth={1.5}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}
