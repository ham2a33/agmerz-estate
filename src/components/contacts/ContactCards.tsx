import Link from "next/link";
import type { StoreConfig } from "@/lib/store-config.types";

interface ContactCardsProps {
  config: StoreConfig;
}

function getContactCards(config: StoreConfig) {
  return [
    {
      title: "Телефон",
      value: config.phone.display,
      action: "Позвонить",
      href: config.phone.href,
    },
    {
      title: "WhatsApp",
      value: config.whatsapp.display,
      action: "Написать",
      href: config.whatsapp.href,
      external: true,
    },
    {
      title: "Email",
      value: config.email.display,
      action: "Написать",
      href: config.email.href,
    },
    {
      title: "Адрес",
      value: config.address.full,
      action: "Открыть карту",
      href: config.mapRouteUrl,
      external: true,
    },
  ];
}

export function ContactCards({ config }: ContactCardsProps) {
  const cards = getContactCards(config);

  return (
    <section>
      <h2 className="font-serif text-2xl text-foreground md:text-3xl">Свяжитесь с нами</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            target={card.external ? "_blank" : undefined}
            rel={card.external ? "noopener noreferrer" : undefined}
            className="group card-hover rounded-3xl border border-border bg-surface p-6 transition-colors hover:border-foreground/15"
          >
            <p className="text-sm text-muted">{card.title}</p>
            <p className="mt-2 text-base font-medium text-foreground">{card.value}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-transform duration-300 group-hover:translate-x-0.5">
              {card.action}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
