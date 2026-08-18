"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DEFAULT_ADMIN_CATEGORY_FILTERS,
  countActiveAdminCategoryFilters,
  filterAdminCategories,
  sortAdminCategories,
} from "@/lib/admin-categories";
import type { AdminCategoryListItem } from "@/lib/categories";
import { Button } from "@/components/ui/Button";
import {
  AdminCategoryFiltersBar,
  AdminCategoryFiltersDrawer,
} from "./AdminCategoryFilters";
import { AdminCategoryTable } from "./AdminCategoryTable";

interface AdminCategoriesViewProps {
  initialCategories: AdminCategoryListItem[];
}

export function AdminCategoriesView({ initialCategories }: AdminCategoriesViewProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [filters, setFilters] = useState(DEFAULT_ADMIN_CATEGORY_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    const filtered = filterAdminCategories(categories, filters);
    return sortAdminCategories(filtered, filters.sort);
  }, [categories, filters]);

  const activeFilterCount = countActiveAdminCategoryFilters(filters);
  const hasFilteredResults = filteredCategories.length > 0;

  function resetFilters() {
    setFilters(DEFAULT_ADMIN_CATEGORY_FILTERS);
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-foreground md:text-3xl">Категории</h2>
          <p className="mt-2 text-sm text-muted">Категории недвижимости для каталога</p>
        </div>
        <Link href="/admin/categories/new">
          <Button variant="dark">Добавить категорию</Button>
        </Link>
      </div>

      <AdminCategoryFiltersBar
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        onOpenMobile={() => setMobileFiltersOpen(true)}
        activeCount={activeFilterCount}
      />

      <AdminCategoryFiltersDrawer
        filters={filters}
        onChange={setFilters}
        mobileOpen={mobileFiltersOpen}
        onMobileClose={() => setMobileFiltersOpen(false)}
        onReset={resetFilters}
      />

      {!hasFilteredResults && (
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
        <AdminCategoryTable
          categories={filteredCategories}
          onDeleted={(id) => setCategories((current) => current.filter((category) => category.id !== id))}
        />
      )}
    </div>
  );
}
