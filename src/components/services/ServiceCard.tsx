import Link from "next/link";
import Image from "next/image";
import type { ServiceItem } from "@/lib/services-data";

const layoutClasses: Record<ServiceItem["layout"], string> = {
  large: "sm:col-span-2 lg:col-span-2",
  default: "",
  wide: "sm:col-span-2",
  highlight: "sm:col-span-2 lg:col-span-2",
};

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const isHighlight = service.layout === "highlight";

  return (
    <article
      className={`group card-hover overflow-hidden rounded-3xl border border-border bg-surface ${layoutClasses[service.layout]} ${isHighlight ? "lg:grid lg:grid-cols-2" : ""}`}
    >
      <div
        className={`relative overflow-hidden bg-surface-muted ${isHighlight ? "aspect-[16/10] lg:aspect-auto lg:min-h-full" : "aspect-[16/10]"}`}
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover image-hover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-surface/90 px-3 py-1 text-xs font-medium text-accent backdrop-blur-sm">
          {service.number}
        </span>
      </div>

      <div className={`flex flex-col p-6 md:p-8 ${isHighlight ? "justify-center" : ""}`}>
        <h3 className="font-serif text-2xl text-foreground md:text-3xl">{service.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{service.description}</p>

        <ul className="mt-5 space-y-2">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              {feature}
            </li>
          ))}
        </ul>

        <Link
          href={service.href}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
        >
          {service.ctaLabel}
          <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
