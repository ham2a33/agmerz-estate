"use client";

import {
  DEFAULT_ADMIN_REQUEST_FILTERS,
  type AdminRequestFilters,
} from "@/lib/admin-requests";
import { getRequestStatusLabel, getRequestTypeLabel } from "@/lib/admin-labels";
import type { RequestStatus, RequestType } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const STATUS_OPTIONS: RequestStatus[] = ["new", "in_progress", "completed", "cancelled"];
const TYPE_OPTIONS: RequestType[] = ["buy", "rent", "sell", "consultation", "contact"];

function FilterFields({
  filters,
  onChange,
}: {
  filters: AdminRequestFilters;
  onChange: (filters: AdminRequestFilters) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Статус</span>
        <select
          value={filters.status}
          onChange={(event) =>
            onChange({ ...filters, status: event.target.value as AdminRequestFilters["status"] })
          }
          className="rounded-lg border border-border bg-surface px-3 py-2.5"
        >
          <option value="">Все</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {getRequestStatusLabel(status)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Тип</span>
        <select
          value={filters.type}
          onChange={(event) =>
            onChange({ ...filters, type: event.target.value as AdminRequestFilters["type"] })
          }
          className="rounded-lg border border-border bg-surface px-3 py-2.5"
        >
          <option value="">Все</option>
          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {getRequestTypeLabel(type)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function AdminRequestFiltersBar({
  filters,
  onChange,
  onReset,
  onOpenMobile,
  activeCount,
}: {
  filters: AdminRequestFilters;
  onChange: (filters: AdminRequestFilters) => void;
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
            placeholder="Имя, телефон, email, сообщение, ID"
          />
        </div>

        <label className="flex w-full flex-col gap-1.5 text-sm lg:w-48">
          <span className="font-medium text-foreground">Сортировка</span>
          <select
            value={filters.sort}
            onChange={(event) =>
              onChange({ ...filters, sort: event.target.value as AdminRequestFilters["sort"] })
            }
            className="rounded-lg border border-border bg-surface px-3 py-2.5"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
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
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Сбросить фильтры
        </Button>
      )}
    </div>
  );
}

export function AdminRequestFiltersDrawer({
  filters,
  onChange,
  mobileOpen,
  onMobileClose,
  onReset,
}: {
  filters: AdminRequestFilters;
  onChange: (filters: AdminRequestFilters) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onReset: () => void;
}) {
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

export { DEFAULT_ADMIN_REQUEST_FILTERS };
