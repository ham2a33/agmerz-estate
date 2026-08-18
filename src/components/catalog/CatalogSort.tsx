"use client";

import type { CatalogSortOption } from "@/lib/catalog";

interface CatalogSortProps {
  value: CatalogSortOption;
  onChange: (value: CatalogSortOption) => void;
  id?: string;
}

const sortOptions: { value: CatalogSortOption; label: string }[] = [
  { value: "newest", label: "Сначала новые" },
  { value: "price-asc", label: "Цена: по возрастанию" },
  { value: "price-desc", label: "Цена: по убыванию" },
  { value: "area-asc", label: "Площадь: по возрастанию" },
  { value: "area-desc", label: "Площадь: по убыванию" },
];

export function CatalogSort({ value, onChange, id = "catalog-sort" }: CatalogSortProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="shrink-0 text-sm text-muted">
        Сортировка
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as CatalogSortOption)}
        className="min-w-0 rounded-2xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
