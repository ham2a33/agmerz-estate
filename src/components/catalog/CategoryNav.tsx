"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORY_LINKS, type CatalogCategorySlug } from "@/lib/catalog";

interface CategoryNavProps {
  categorySlug: CatalogCategorySlug;
}

export function CategoryNav({ categorySlug }: CategoryNavProps) {
  const pathname = usePathname();

  return (
    <div className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className="-mb-px flex gap-1 overflow-x-auto py-4 scrollbar-none"
          aria-label="Категории каталога"
        >
          {CATEGORY_LINKS.map((link) => {
            const isActive =
              categorySlug === link.slug ||
              (link.href !== "/catalog" && pathname === link.href) ||
              (link.slug === "all" && pathname === "/catalog");

            return (
              <Link
                key={link.slug}
                href={link.href}
                className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-300 md:px-5 ${
                  isActive
                    ? "bg-foreground text-surface"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
