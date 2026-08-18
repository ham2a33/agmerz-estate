interface PropertyFeaturesProps {
  features: string[];
}

export function PropertyFeatures({ features }: PropertyFeaturesProps) {
  if (features.length === 0) return null;

  return (
    <section>
      <h2 className="font-serif text-2xl text-foreground md:text-3xl">Характеристики</h2>
      <ul className="mt-5 flex flex-wrap gap-2.5">
        {features.map((feature) => (
          <li
            key={feature}
            className="rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground"
          >
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}
