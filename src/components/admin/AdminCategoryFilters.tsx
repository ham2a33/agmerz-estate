"use client";

import {
  DEFAULT_ADMIN_CATEGORY_FILTERS,
  type AdminCategoryFilters,
} from "@/lib/admin-categories";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function FilterFields({
  filters,
  onChange,
}: {
  filters: AdminCategoryFilters;
  onChange: (filters: AdminCategoryFilters) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">Статус</span>
      <select
        value={filters.status}
        onChange={(event) =>
          onChange({ ...filters, status: event.target.value as AdminCategoryFilters["status"] })
        }
        className="rounded-lg border border-border bg-surface px-3 py-2.5"
      >
        <option value="">Все</option>
        <option value="active">Активна</option>
        <option value="hidden">Скрыта</option>
      </select>
    </label>
  );
}

export function AdminCategoryFiltersBar({
  filters,
  onChange,
  onReset,
  onOpenMobile,
  activeCount,
}: {
  filters: AdminCategoryFilters;
  onChange: (filters: AdminCategoryFilters) => void;
  onReset: () => void;
  onOpenMobile: () => void;
  activeCount: number;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1">
          <Input
            label="Поиск"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Название, slug, описание..."
          />
        </div>
        <label className="flex flex-col gap-1.5 text-sm lg:w-48">
          <span className="font-medium text-foreground">Сортировка</span>
          <select
            value={filters.sort}
            onChange={(event) =>
              onChange({ ...filters, sort: event.target.value as AdminCategoryFilters["sort"] })
            }
            className="rounded-lg border border-border bg-surface px-3 py-2.5"
          >
            <option value="order">По порядку</option>
            <option value="name">По названию</option>
            <option value="newest">Сначала новые</option>
          </select>
        </label>
        <button
          type="button"
          className="rounded-2xl border border-border px-4 py-2.5 text-sm lg:hidden"
          onClick={onOpenMobile}
        >
          Фильтры{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      <div className="hidden lg:block">
        <FilterFields filters={filters} onChange={onChange} />
      </div>

      {activeCount > 0 && (
        <div className="flex justify-end">
          <button type="button" className="text-sm text-muted hover:text-foreground" onClick={onReset}>
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}

export function AdminCategoryFiltersDrawer({
  filters,
  onChange,
  mobileOpen,
  onMobileClose,
  onReset,
}: {
  filters: AdminCategoryFilters;
  onChange: (filters: AdminCategoryFilters) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onReset: () => void;
}) {
  if (!mobileOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/20"
        aria-label="Закрыть фильтры"
        onClick={onMobileClose}
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-medium">Фильтры</h3>
          <button type="button" className="text-sm text-muted" onClick={onMobileClose}>
            Закрыть
          </button>
        </div>
        <FilterFields filters={filters} onChange={onChange} />
        <div className="mt-6 flex gap-3">
          <Button variant="dark" className="flex-1" onClick={onMobileClose}>
            Применить
          </Button>
          <Button variant="outline" className="flex-1" onClick={onReset}>
            Сбросить
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_ADMIN_CATEGORY_FILTERS };
