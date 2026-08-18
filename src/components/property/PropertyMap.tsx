import type { PropertyCoordinates } from "@/types";

interface PropertyMapProps {
  coordinates: PropertyCoordinates | null;
  address: string;
  district: string;
}

const NEARBY_PLACES = ["Школа", "Магазины", "Парк", "Остановка"];

export function PropertyMap({ coordinates, address, district }: PropertyMapProps) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-foreground md:text-3xl">Расположение</h2>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="relative flex aspect-[16/10] flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-surface-muted">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--surface-muted)_0%,var(--border)_100%)] opacity-50" />
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-accent">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 21s-6.5-5.2-6.5-10a6.5 6.5 0 1113 0c0 4.8-6.5 10-6.5 10z" />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">{address}</p>
            <p className="mt-1 text-xs text-muted">
              {coordinates
                ? `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`
                : "Карта будет подключена"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm text-muted">Район</p>
            <p className="mt-1 font-medium text-foreground">{district}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm text-muted">Адрес</p>
            <p className="mt-1 font-medium text-foreground">{address}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm text-muted">Рядом</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {NEARBY_PLACES.map((place) => (
                <li
                  key={place}
                  className="rounded-full bg-surface-muted px-3 py-1 text-xs text-foreground"
                >
                  {place}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
