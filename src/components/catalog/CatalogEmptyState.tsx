"use client";

import { Button } from "@/components/ui/Button";

interface CatalogEmptyStateProps {
  onReset: () => void;
}

export function CatalogEmptyState({ onReset }: CatalogEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface px-6 py-16 text-center md:py-20">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-muted text-muted">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <h2 className="mt-6 font-serif text-2xl text-foreground md:text-3xl">Ничего не найдено</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted md:text-base">
        Попробуйте изменить параметры поиска или сбросить фильтры.
      </p>
      <Button variant="dark" className="mt-8" onClick={onReset}>
        Сбросить фильтры
      </Button>
    </div>
  );
}
