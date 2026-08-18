"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_ADMIN_PROPERTY_FILTERS,
  countActiveAdminFilters,
  filterAdminProperties,
  sortAdminProperties,
} from "@/lib/admin-properties";
import type { Property } from "@/types";
import { LinkButton } from "@/components/ui/Button";
import {
  AdminPropertyFiltersBar,
  AdminPropertyFiltersDrawer,
} from "./AdminPropertyFilters";
import { AdminPropertyTable } from "./AdminPropertyTable";

interface AdminPropertiesViewProps {
  initialProperties: Property[];
}

export function AdminPropertiesView({ initialProperties }: AdminPropertiesViewProps) {
  const [properties, setProperties] = useState(initialProperties);
  const [filters, setFilters] = useState(DEFAULT_ADMIN_PROPERTY_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProperties = useMemo(() => {
    const filtered = filterAdminProperties(properties, filters);
    return sortAdminProperties(filtered, filters.sort);
  }, [properties, filters]);

  const activeFilterCount = countActiveAdminFilters(filters);
  const hasAnyProperties = properties.length > 0;
  const hasFilteredResults = filteredProperties.length > 0;

  function resetFilters() {
    setFilters(DEFAULT_ADMIN_PROPERTY_FILTERS);
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-foreground md:text-3xl">Объекты недвижимости</h2>
          <p className="mt-2 text-sm text-muted">Управление объектами AGMERZ ESTATE</p>
        </div>
        <LinkButton href="/admin/properties/new" variant="dark">
          + Добавить объект
        </LinkButton>
      </div>

      {hasAnyProperties && (
        <AdminPropertyFiltersBar
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          onOpenMobile={() => setMobileFiltersOpen(true)}
          activeCount={activeFilterCount}
        />
      )}

      <AdminPropertyFiltersDrawer
        filters={filters}
        onChange={setFilters}
        mobileOpen={mobileFiltersOpen}
        onMobileClose={() => setMobileFiltersOpen(false)}
        onReset={resetFilters}
      />

      {!hasAnyProperties && (
        <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
          <h3 className="text-lg font-medium text-foreground">Объектов пока нет</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Добавьте первый объект недвижимости, чтобы он появился в каталоге.
          </p>
          <div className="mt-6">
            <LinkButton href="/admin/properties/new" variant="dark">
              Добавить объект
            </LinkButton>
          </div>
        </div>
      )}

      {hasAnyProperties && !hasFilteredResults && (
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
        <AdminPropertyTable
          properties={filteredProperties}
          onDeleted={(id) => setProperties((current) => current.filter((property) => property.id !== id))}
        />
      )}
    </div>
  );
}
