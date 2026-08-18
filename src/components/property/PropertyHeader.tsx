import type { Property } from "@/types";
import { getDealBadge } from "@/lib/property-helpers";

interface PropertyHeaderProps {
  property: Property;
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
  return (
    <header>
      <span className="inline-block rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
        {getDealBadge(property)}
      </span>
      <h1 className="heading-section mt-4 text-foreground">{property.title}</h1>
      <p className="mt-3 flex items-center gap-1.5 text-base text-muted">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 21s-6.5-5.2-6.5-10a6.5 6.5 0 1113 0c0 4.8-6.5 10-6.5 10z" />
          <circle cx="12" cy="11" r="2.5" />
        </svg>
        {property.district} район, Грозный
      </p>
    </header>
  );
}
