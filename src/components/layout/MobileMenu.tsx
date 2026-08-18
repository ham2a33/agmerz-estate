"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import type { StoreConfig } from "@/lib/store-config.types";

const mobileLinks = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/favorites", label: "Избранное" },
  { href: "/services", label: "Услуги" },
  { href: "/about", label: "О компании" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
];

interface MobileMenuProps {
  config: StoreConfig;
}

export function MobileMenu({ config }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-surface-muted"
      >
        <span
          className={`absolute block h-0.5 w-5 bg-current transition-all duration-300 ${isOpen ? "rotate-45" : "-translate-y-1.5"}`}
        />
        <span
          className={`absolute block h-0.5 w-5 bg-current transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`absolute block h-0.5 w-5 bg-current transition-all duration-300 ${isOpen ? "-rotate-45" : "translate-y-1.5"}`}
        />
      </button>

      <div
        className={`fixed inset-0 top-[72px] z-40 bg-foreground/20 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <nav
        className={`fixed left-0 right-0 top-[72px] z-50 max-h-[calc(100vh-72px)] overflow-y-auto border-b border-border bg-surface transition-all duration-300 ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
      >
        <ul className="flex flex-col gap-1 p-4">
          {mobileLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 text-base text-foreground transition-colors hover:bg-surface-muted"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-border p-4">
          <LinkButton
            href={config.phone.href}
            variant="dark"
            className="w-full justify-center"
            onClick={() => setIsOpen(false)}
          >
            {config.phone.display}
          </LinkButton>
        </div>
      </nav>
    </div>
  );
}
