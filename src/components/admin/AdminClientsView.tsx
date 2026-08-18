"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DEFAULT_ADMIN_CLIENT_FILTERS,
  countActiveAdminClientFilters,
  filterAdminClients,
  sortAdminClients,
} from "@/lib/admin-clients";
import type { AdminClientListItem } from "@/lib/clients.types";
import { Button } from "@/components/ui/Button";
import {
  AdminClientFiltersBar,
  AdminClientFiltersDrawer,
} from "./AdminClientFilters";
import { AdminClientTable } from "./AdminClientTable";

interface AdminClientsViewProps {
  initialClients: AdminClientListItem[];
}

export function AdminClientsView({ initialClients }: AdminClientsViewProps) {
  const [clients, setClients] = useState(initialClients);
  const [filters, setFilters] = useState(DEFAULT_ADMIN_CLIENT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredClients = useMemo(() => {
    const filtered = filterAdminClients(clients, filters);
    return sortAdminClients(filtered, filters.sort);
  }, [clients, filters]);

  const activeFilterCount = countActiveAdminClientFilters(filters);
  const hasAnyClients = clients.length > 0;
  const hasFilteredResults = filteredClients.length > 0;

  function resetFilters() {
    setFilters(DEFAULT_ADMIN_CLIENT_FILTERS);
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-foreground md:text-3xl">Клиенты</h2>
          <p className="mt-2 text-sm text-muted">CRM-база клиентов AGMERZ ESTATE</p>
        </div>
        <Link href="/admin/clients/new">
          <Button variant="dark">Добавить клиента</Button>
        </Link>
      </div>

      {hasAnyClients && (
        <AdminClientFiltersBar
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          onOpenMobile={() => setMobileFiltersOpen(true)}
          activeCount={activeFilterCount}
        />
      )}

      <AdminClientFiltersDrawer
        filters={filters}
        onChange={setFilters}
        mobileOpen={mobileFiltersOpen}
        onMobileClose={() => setMobileFiltersOpen(false)}
        onReset={resetFilters}
      />

      {!hasAnyClients && (
        <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
          <h3 className="text-lg font-medium text-foreground">Клиентов пока нет</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Добавьте первого клиента или дождитесь заявок с сайта.
          </p>
          <Link href="/admin/clients/new" className="mt-6 inline-block">
            <Button variant="dark">Добавить клиента</Button>
          </Link>
        </div>
      )}

      {hasAnyClients && !hasFilteredResults && (
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
        <AdminClientTable
          clients={filteredClients}
          onDeleted={(id) => setClients((current) => current.filter((client) => client.id !== id))}
        />
      )}
    </div>
  );
}
