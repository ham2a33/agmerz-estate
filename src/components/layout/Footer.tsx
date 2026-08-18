import Link from "next/link";
import { Container } from "./Container";
import type { StoreConfig } from "@/lib/store-config.types";

const navigationLinks = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/services", label: "Услуги" },
  { href: "/about", label: "О компании" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
];

const catalogLinks = [
  { href: "/catalog/apartments", label: "Квартиры" },
  { href: "/catalog/houses", label: "Дома" },
  { href: "/catalog/commercial", label: "Коммерция" },
  { href: "/catalog/land", label: "Участки" },
  { href: "/catalog/rent", label: "Аренда" },
];

interface FooterProps {
  config: StoreConfig;
}

export function Footer({ config }: FooterProps) {
  const contactLinks = [
    { href: config.phone.href, label: config.phone.display },
    { href: config.whatsapp.href, label: "WhatsApp" },
    { href: config.instagram.href, label: config.instagram.display },
    { href: config.email.href, label: config.email.display },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
          <div>
            <p className="font-serif text-xl font-semibold text-foreground">{config.brand}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Премиальное агентство недвижимости. Подбор, продажа и аренда жилой и коммерческой
              недвижимости в Грозном.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Навигация</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Каталог</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {catalogLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Контакты</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {contactLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {config.brand}</p>
          <Link href="/contacts" className="transition-colors hover:text-foreground">
            Политика конфиденциальности
          </Link>
        </div>
      </Container>
    </footer>
  );
}
