"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_ADMIN_REQUEST_FILTERS,
  countActiveAdminRequestFilters,
  filterAdminRequests,
  sortAdminRequests,
} from "@/lib/admin-requests";
import type { Request } from "@/types";
import {
  AdminRequestFiltersBar,
  AdminRequestFiltersDrawer,
} from "./AdminRequestFilters";
import { AdminRequestTable } from "./AdminRequestTable";

interface AdminRequestsViewProps {
  initialRequests: Request[];
}

export function AdminRequestsView({ initialRequests }: AdminRequestsViewProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [filters, setFilters] = useState(DEFAULT_ADMIN_REQUEST_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredRequests = useMemo(() => {
    const filtered = filterAdminRequests(requests, filters);
    return sortAdminRequests(filtered, filters.sort);
  }, [requests, filters]);

  const activeFilterCount = countActiveAdminRequestFilters(filters);
  const hasAnyRequests = requests.length > 0;
  const hasFilteredResults = filteredRequests.length > 0;

  function resetFilters() {
    setFilters(DEFAULT_ADMIN_REQUEST_FILTERS);
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 md:px-6 md:py-8">
      <div>
        <h2 className="font-serif text-2xl text-foreground md:text-3xl">Заявки</h2>
        <p className="mt-2 text-sm text-muted">Управление входящими заявками AGMERZ ESTATE</p>
      </div>

      {hasAnyRequests && (
        <AdminRequestFiltersBar
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          onOpenMobile={() => setMobileFiltersOpen(true)}
          activeCount={activeFilterCount}
        />
      )}

      <AdminRequestFiltersDrawer
        filters={filters}
        onChange={setFilters}
        mobileOpen={mobileFiltersOpen}
        onMobileClose={() => setMobileFiltersOpen(false)}
        onReset={resetFilters}
      />

      {!hasAnyRequests && (
        <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
          <h3 className="text-lg font-medium text-foreground">Заявок пока нет</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Новые заявки с сайта будут появляться здесь автоматически.
          </p>
        </div>
      )}

      {hasAnyRequests && !hasFilteredResults && (
        <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
          <h3 className="text-lg font-medium text-foreground">Ничего не найдено</h3>
          <p className="mt-3 text-sm text-muted">Попробуйте изменить параметры поиска или фильтры.</p>
          <button
            type="button"
            className="mt-6 rounded-2xl border border-border px-6 py-3 text-sm font-medium"
            onClick={resetFilters}
          >
            Сбросить фильтры
          </button>
        </div>
      )}

      {hasFilteredResults && (
        <AdminRequestTable
          requests={filteredRequests}
          onDeleted={(id) => setRequests((current) => current.filter((request) => request.id !== id))}
        />
      )}
    </div>
  );
}
