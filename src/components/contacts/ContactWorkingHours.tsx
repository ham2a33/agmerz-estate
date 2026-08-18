import type { StoreConfig } from "@/lib/store-config.types";

interface ContactWorkingHoursProps {
  config: StoreConfig;
}

export function ContactWorkingHours({ config }: ContactWorkingHoursProps) {
  return (
    <section className="border-t border-border pt-12 md:pt-16">
      <h2 className="font-serif text-2xl text-foreground md:text-3xl">Время работы</h2>
      <div className="mt-6 max-w-md rounded-3xl border border-border bg-surface p-6 md:p-8">
        <dl className="space-y-4">
          {config.workingHours.map((item) => (
            <div key={item.days} className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted">{item.days}</dt>
              <dd className="text-sm font-medium text-foreground">{item.hours}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
