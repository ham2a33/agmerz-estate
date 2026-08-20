"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LogoutButton } from "./LogoutButton";

const navSections = [
  {
    items: [{ href: "/admin/dashboard", label: "Dashboard", exact: true }],
  },
  {
    title: "ОБЪЕКТЫ",
    items: [
      { href: "/admin/properties", label: "Объекты" },
      { href: "/admin/categories", label: "Категории" },
    ],
  },
  {
    title: "CRM",
    items: [
      { href: "/admin/requests", label: "Заявки" },
      { href: "/admin/clients", label: "Клиенты" },
    ],
  },
  {
    title: "КОНТЕНТ",
    items: [
      { href: "/admin/homepage", label: "Главная" },
      { href: "/admin/content", label: "Контент сайта" },
      { href: "/admin/blog", label: "Блог" },
      { href: "/admin/reviews", label: "Отзывы" },
      { href: "/admin/media", label: "Медиа" },
    ],
  },
  {
    title: "СИСТЕМА",
    items: [{ href: "/admin/settings", label: "Настройки" }],
  },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  function isActive(href: string, exact = false): boolean {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-5 py-6">
        <Link href="/admin/dashboard" className="block" onClick={onClose}>
          <p className="font-serif text-lg leading-none text-foreground">AGMERZ</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">Estate</p>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4" aria-label="Admin navigation">
        <div className="space-y-5">
          {navSections.map((section) => (
            <div key={section.title ?? "root"}>
              {section.title && (
                <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                  {section.title}
                </p>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isActive(item.href, "exact" in item ? item.exact : false)
                          ? "bg-surface-muted font-medium text-foreground"
                          : "text-muted hover:bg-surface-muted hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-border px-3 py-4">
        <LogoutButton variant="sidebar" />
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-[252px] shrink-0 border-r border-border bg-surface lg:block">
        {sidebarContent}
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(280px,85vw)] border-r border-border bg-surface shadow-lg transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
