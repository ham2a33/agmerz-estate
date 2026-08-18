import type { Property } from "@/types";
import { PropertyGrid } from "./PropertyGrid";

interface SimilarPropertiesProps {
  properties: Property[];
}

export function SimilarProperties({ properties }: SimilarPropertiesProps) {
  if (properties.length === 0) return null;

  return (
    <section className="border-t border-border pt-12 md:pt-16">
      <h2 className="heading-section text-foreground">Вам может понравиться</h2>
      <div className="mt-8 md:mt-10">
        <PropertyGrid properties={properties} columns={4} />
      </div>
    </section>
  );
}
