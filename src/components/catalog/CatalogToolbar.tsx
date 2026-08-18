"use client";

import { CatalogSort } from "./CatalogSort";
import { formatPropertyCount, type CatalogSortOption } from "@/lib/catalog";

interface CatalogToolbarProps {
  total: number;
  sort: CatalogSortOption;
  onSortChange: (sort: CatalogSortOption) => void;
}

export function CatalogToolbar({ total, sort, onSortChange }: CatalogToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">
        Найдено: <span className="font-medium text-foreground">{formatPropertyCount(total)}</span>
      </p>
      <CatalogToolbarSort sort={sort} onSortChange={onSortChange} variant="desktop" />
    </div>
  );
}

export function CatalogToolbarSort({
  sort,
  onSortChange,
  variant = "desktop",
}: {
  sort: CatalogSortOption;
  onSortChange: (sort: CatalogSortOption) => void;
  variant?: "desktop" | "mobile";
}) {
  return (
    <div className={variant === "desktop" ? "hidden sm:block" : "block sm:hidden"}>
      <CatalogSort
        value={sort}
        onChange={onSortChange}
        id={variant === "mobile" ? "catalog-sort-mobile" : "catalog-sort"}
      />
    </div>
  );
}
