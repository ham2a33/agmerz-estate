import type { Property } from "@/types";
import { getKeyCharacteristics } from "@/lib/property-helpers";

interface PropertyKeyCharacteristicsProps {
  property: Property;
}

export function PropertyKeyCharacteristics({ property }: PropertyKeyCharacteristicsProps) {
  const characteristics = getKeyCharacteristics(property);

  if (characteristics.length === 0) return null;

  return (
    <section>
      <h2 className="font-serif text-2xl text-foreground md:text-3xl">Основные характеристики</h2>
      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {characteristics.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-surface px-5 py-4"
          >
            <dt className="text-sm text-muted">{item.label}</dt>
            <dd className="mt-1.5 text-lg font-medium text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
