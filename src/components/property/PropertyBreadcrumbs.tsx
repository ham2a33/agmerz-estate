import Link from "next/link";
import type { Property } from "@/types";
import { getPropertyTypeLabel } from "@/lib/property-labels";
import { getCategoryHref } from "@/lib/property-helpers";

interface PropertyBreadcrumbsProps {
  property: Property;
}

export function PropertyBreadcrumbs({ property }: PropertyBreadcrumbsProps) {
  const categoryLabel = getPropertyTypeLabel(property.type);
  const categoryHref = getCategoryHref(property.type);

  return (
    <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <li>
          <Link href="/" className="transition-colors hover:text-foreground">
            Главная
          </Link>
        </li>
        <li aria-hidden="true" className="text-border">
          /
        </li>
        <li>
          <Link href="/catalog" className="transition-colors hover:text-foreground">
            Каталог
          </Link>
        </li>
        <li aria-hidden="true" className="text-border">
          /
        </li>
        <li className="hidden sm:list-item">
          <Link href={categoryHref} className="transition-colors hover:text-foreground">
            {categoryLabel}
          </Link>
        </li>
        <li aria-hidden="true" className="hidden text-border sm:list-item">
          /
        </li>
        <li className="max-w-[200px] truncate font-medium text-foreground sm:max-w-xs">
          {property.title}
        </li>
      </ol>
    </nav>
  );
}
