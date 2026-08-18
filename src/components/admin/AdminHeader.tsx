"use client";

import { LogoutButton } from "./LogoutButton";
import { useAdminMobileMenu } from "./AdminMobileMenuContext";

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const mobileMenu = useAdminMobileMenu();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Открыть меню"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-muted lg:hidden"
            onClick={() => mobileMenu?.openMenu()}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <div className="min-w-0">
            <p className="truncate text-xs uppercase tracking-wider text-muted">Admin</p>
            <h1 className="truncate text-lg font-medium text-foreground md:text-xl">{title}</h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface-muted px-3 py-2 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-medium text-surface">
              A
            </span>
            <span className="text-sm text-foreground">Admin</span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
