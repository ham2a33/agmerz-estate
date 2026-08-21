"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import type { Property } from "@/types";
import {
  buildSearchParams,
  filterProperties,
  parseSearchParams,
  sortProperties,
  type CatalogFiltersState,
  type CatalogSortOption,
} from "@/lib/catalog";
import { CatalogHero } from "./CatalogHero";
import { CategoryNav } from "./CategoryNav";
import { CatalogFilters } from "./CatalogFilters";
import { CatalogToolbar, CatalogToolbarSort } from "./CatalogToolbar";
import { CatalogEmptyState } from "./CatalogEmptyState";

interface CatalogViewProps {
  categorySlug?: string;
  properties: Property[];
  heroTitle?: string;
  heroDescription?: string;
  heroImageUrl?: string;
}

export function CatalogView({
  categorySlug = "all",
  properties,
  heroTitle,
  heroDescription,
  heroImageUrl,
}: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseSearchParams(new URLSearchParams(searchParams.toString()), categorySlug),
    [searchParams, categorySlug]
  );

  const filteredProperties = useMemo(() => {
    const filtered = filterProperties(properties, filters, categorySlug);
    return sortProperties(filtered, filters.sort);
  }, [properties, filters, categorySlug]);

  const updateUrl = useCallback(
    (nextFilters: CatalogFiltersState) => {
      const params = buildSearchParams(nextFilters, categorySlug);
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, categorySlug]
  );

  const handleApply = useCallback(
    (nextFilters: CatalogFiltersState) => {
      updateUrl(nextFilters);
    },
    [updateUrl]
  );

  const handleReset = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const handleSortChange = useCallback(
    (sort: CatalogSortOption) => {
      updateUrl({ ...filters, sort });
    },
    [updateUrl, filters]
  );

  return (
    <>
      <CatalogHero
        title={heroTitle}
        description={heroDescription}
        imageUrl={heroImageUrl}
      />
      <CategoryNav categorySlug={categorySlug} />

      <section className="pb-16 pt-8 md:pb-24 md:pt-10">
        <Container>
          <div className="flex flex-col gap-6">
            <CatalogFilters
              filters={filters}
              categorySlug={categorySlug}
              onApply={handleApply}
              onReset={handleReset}
              mobileSort={
                <CatalogToolbarSort
                  sort={filters.sort}
                  onSortChange={handleSortChange}
                  variant="mobile"
                />
              }
            />

            <CatalogToolbar
              total={filteredProperties.length}
              sort={filters.sort}
              onSortChange={handleSortChange}
            />

            <div className="mt-2">
              {filteredProperties.length > 0 ? (
                <PropertyGrid properties={filteredProperties} columns={4} />
              ) : (
                <CatalogEmptyState onReset={handleReset} />
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export function CatalogViewFallback() {
  return (
    <>
      <CatalogHero />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-12 rounded-2xl bg-surface-muted" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-surface-muted" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
