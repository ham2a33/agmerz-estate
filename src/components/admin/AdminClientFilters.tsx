"use client";

import {
  DEFAULT_ADMIN_CLIENT_FILTERS,
  type AdminClientFilters,
} from "@/lib/admin-clients";
import { getClientStatusLabel, getClientTypeLabel } from "@/lib/admin-labels";
import type { ClientStatus, ClientType } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const STATUS_OPTIONS: ClientStatus[] = ["new", "active", "in_progress", "completed", "inactive"];
const TYPE_OPTIONS: ClientType[] = ["buyer", "seller", "renter", "landlord", "investor"];

function FilterFields({
  filters,
  onChange,
}: {
  filters: AdminClientFilters;
  onChange: (filters: AdminClientFilters) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Статус</span>
        <select
          value={filters.status}
          onChange={(event) =>
            onChange({ ...filters, status: event.target.value as AdminClientFilters["status"] })
          }
          className="rounded-lg border border-border bg-surface px-3 py-2.5"
        >
          <option value="">Все</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {getClientStatusLabel(status)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Тип клиента</span>
        <select
          value={filters.type}
          onChange={(event) =>
            onChange({ ...filters, type: event.target.value as AdminClientFilters["type"] })
          }
          className="rounded-lg border border-border bg-surface px-3 py-2.5"
        >
          <option value="">Все</option>
          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {getClientTypeLabel(type)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function AdminClientFiltersBar({
  filters,
  onChange,
  onReset,
  onOpenMobile,
  activeCount,
}: {
  filters: AdminClientFilters;
  onChange: (filters: AdminClientFilters) => void;
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
            placeholder="Имя, телефон, email, менеджер..."
          />
        </div>
        <label className="flex flex-col gap-1.5 text-sm lg:w-48">
          <span className="font-medium text-foreground">Сортировка</span>
          <select
            value={filters.sort}
            onChange={(event) =>
              onChange({ ...filters, sort: event.target.value as AdminClientFilters["sort"] })
            }
            className="rounded-lg border border-border bg-surface px-3 py-2.5"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="name">По имени</option>
            <option value="activity">По активности</option>
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

export function AdminClientFiltersDrawer({
  filters,
  onChange,
  mobileOpen,
  onMobileClose,
  onReset,
}: {
  filters: AdminClientFilters;
  onChange: (filters: AdminClientFilters) => void;
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

export { DEFAULT_ADMIN_CLIENT_FILTERS };
