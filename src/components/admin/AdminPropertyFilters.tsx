"use client";

import { CATALOG_DISTRICTS } from "@/lib/catalog";
import {
  DEFAULT_ADMIN_PROPERTY_FILTERS,
  type AdminPropertyFilters,
} from "@/lib/admin-properties";
import { PROPERTY_TYPE_OPTIONS } from "@/lib/property-form";
import type { PropertyStatus } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const STATUS_OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: "active", label: "Активен" },
  { value: "reserved", label: "Забронирован" },
  { value: "sold", label: "Продан" },
  { value: "rented", label: "Сдан" },
  { value: "draft", label: "Черновик" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Новые" },
  { value: "oldest", label: "Старые" },
  { value: "price-asc", label: "Цена ↑" },
  { value: "price-desc", label: "Цена ↓" },
  { value: "area-asc", label: "Площадь ↑" },
  { value: "area-desc", label: "Площадь ↓" },
];

interface AdminPropertyFiltersProps {
  filters: AdminPropertyFilters;
  onChange: (filters: AdminPropertyFilters) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function FilterFields({
  filters,
  onChange,
}: {
  filters: AdminPropertyFilters;
  onChange: (filters: AdminPropertyFilters) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Тип</span>
        <select
          value={filters.type}
          onChange={(event) => onChange({ ...filters, type: event.target.value as AdminPropertyFilters["type"] })}
          className="rounded-lg border border-border bg-surface px-3 py-2.5"
        >
          <option value="">Все</option>
          {PROPERTY_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Статус</span>
        <select
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value as AdminPropertyFilters["status"] })}
          className="rounded-lg border border-border bg-surface px-3 py-2.5"
        >
          <option value="">Все</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Сделка</span>
        <select
          value={filters.deal}
          onChange={(event) => onChange({ ...filters, deal: event.target.value as AdminPropertyFilters["deal"] })}
          className="rounded-lg border border-border bg-surface px-3 py-2.5"
        >
          <option value="">Все</option>
          <option value="sale">Продажа</option>
          <option value="rent">Аренда</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Район</span>
        <select
          value={filters.district}
          onChange={(event) => onChange({ ...filters, district: event.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2.5"
        >
          <option value="">Все</option>
          {CATALOG_DISTRICTS.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </label>

      <Input
        label="Цена от"
        type="number"
        min={0}
        value={filters.minPrice}
        onChange={(event) => onChange({ ...filters, minPrice: event.target.value })}
      />
      <Input
        label="Цена до"
        type="number"
        min={0}
        value={filters.maxPrice}
        onChange={(event) => onChange({ ...filters, maxPrice: event.target.value })}
      />
    </div>
  );
}

export function AdminPropertyFiltersBar({
  filters,
  onChange,
  onReset,
  onOpenMobile,
  activeCount,
}: {
  filters: AdminPropertyFilters;
  onChange: (filters: AdminPropertyFilters) => void;
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
            placeholder="Название, адрес, район, ID"
          />
        </div>

        <label className="flex w-full flex-col gap-1.5 text-sm lg:w-48">
          <span className="font-medium text-foreground">Сортировка</span>
          <select
            value={filters.sort}
            onChange={(event) =>
              onChange({ ...filters, sort: event.target.value as AdminPropertyFilters["sort"] })
            }
            className="rounded-lg border border-border bg-surface px-3 py-2.5"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <Button type="button" variant="outline" className="lg:hidden" onClick={onOpenMobile}>
          Фильтры{activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>
      </div>

      <div className="hidden lg:block">
        <FilterFields filters={filters} onChange={onChange} />
      </div>

      {(activeCount > 0 || filters.search) && (
        <div>
          <Button type="button" variant="ghost" size="sm" onClick={onReset}>
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
}

export function AdminPropertyFiltersDrawer({
  filters,
  onChange,
  mobileOpen,
  onMobileClose,
  onReset,
}: AdminPropertyFiltersProps & { onReset: () => void }) {
  if (!mobileOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] lg:hidden">
      <button
        type="button"
        aria-label="Закрыть фильтры"
        className="absolute inset-0 bg-foreground/20"
        onClick={onMobileClose}
      />
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-medium text-foreground">Фильтры</h3>
          <button type="button" className="text-sm text-muted" onClick={onMobileClose}>
            Закрыть
          </button>
        </div>
        <FilterFields filters={filters} onChange={onChange} />
        <div className="mt-4 flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onReset}>
            Сбросить
          </Button>
          <Button type="button" variant="dark" className="flex-1" onClick={onMobileClose}>
            Применить
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_ADMIN_PROPERTY_FILTERS };
