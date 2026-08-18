import type { StoreConfig } from "@/lib/store-config.types";
import { LinkButton } from "@/components/ui/Button";

interface ContactOfficeProps {
  config: StoreConfig;
}

export function ContactOffice({ config }: ContactOfficeProps) {
  return (
    <section className="border-t border-border pt-12 md:pt-16">
      <h2 className="heading-section text-foreground">Мы рядом</h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col justify-center">
          <p className="text-sm text-muted">Офис AGMERZ ESTATE</p>
          <p className="mt-2 font-serif text-2xl text-foreground">{config.address.city}</p>
          <p className="mt-1 text-base text-muted">{config.address.region}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
            Приезжайте в офис для личной консультации. Мы поможем подобрать недвижимость и ответим
            на все вопросы о сделках.
          </p>
          <div className="mt-6">
            <LinkButton href={config.mapRouteUrl} variant="outline" size="lg">
              Построить маршрут
            </LinkButton>
          </div>
        </div>

        <div className="relative flex aspect-[16/10] flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-surface-muted">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--surface-muted)_0%,var(--border)_100%)] opacity-60" />
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-accent">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 21s-6.5-5.2-6.5-10a6.5 6.5 0 1113 0c0 4.8-6.5 10-6.5 10z" />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
            </div>
            <p className="mt-4 font-medium text-foreground">{config.address.full}</p>
            <p className="mt-1 text-xs text-muted">
              {config.coordinates.lat.toFixed(4)}, {config.coordinates.lng.toFixed(4)}
            </p>
            <p className="mt-3 text-xs text-muted">Карта будет подключена</p>
          </div>
        </div>
      </div>
    </section>
  );
}
