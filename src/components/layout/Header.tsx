import Link from "next/link";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { LinkButton } from "@/components/ui/Button";
import type { StoreConfig } from "@/lib/store-config.types";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/services", label: "Услуги" },
  { href: "/about", label: "О компании" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
];

interface HeaderProps {
  config: StoreConfig;
}

export function Header({ config }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-6">
          <Link
            href="/"
            className="font-serif text-xl font-semibold tracking-tight text-foreground md:text-[1.35rem]"
          >
            {config.brand}
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/favorites"
              className="hidden text-sm text-muted transition-colors duration-300 hover:text-foreground sm:inline"
            >
              Избранное
            </Link>

            <LinkButton
              href={config.phone.href}
              variant="dark"
              size="sm"
              className="hidden whitespace-nowrap md:inline-flex"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {config.phone.display}
            </LinkButton>

            <MobileMenu config={config} />
          </div>
        </div>
      </Container>
    </header>
  );
}
