import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import type { Property } from "@/types";

interface FeaturedPropertiesProps {
  properties: Property[];
}

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  return (
    <section className="section-padding bg-surface-muted/50">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="heading-section text-foreground">Избранные объекты</h2>
            <p className="mt-3 text-muted">Недвижимость, которую стоит увидеть</p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            Смотреть все объекты
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 lg:mt-14">
          <PropertyGrid properties={properties} columns={3} />
        </div>
      </Container>
    </section>
  );
}
