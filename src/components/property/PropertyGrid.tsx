import type { Property } from "@/types";
import { PropertyCard } from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
  columns?: 3 | 4;
}

const columnClasses: Record<NonNullable<PropertyGridProps["columns"]>, string> = {
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export function PropertyGrid({ properties, columns = 3 }: PropertyGridProps) {
  if (properties.length === 0) {
    return <p className="text-muted">Объекты не найдены.</p>;
  }

  return (
    <div className={`grid grid-cols-1 gap-6 md:gap-8 ${columnClasses[columns]}`}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
