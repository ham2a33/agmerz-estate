import { PropertyGrid } from "@/components/property/PropertyGrid";
import type { Property } from "@/types";

interface FavoritesGridProps {
  properties: Property[];
}

export function FavoritesGrid({ properties }: FavoritesGridProps) {
  return <PropertyGrid properties={properties} columns={4} />;
}

export function FavoritesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-border bg-surface"
          aria-hidden
        >
          <div className="aspect-[4/3] animate-pulse bg-surface-muted" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-surface-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-surface-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-surface-muted" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-surface-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
