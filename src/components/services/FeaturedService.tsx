import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import { featuredService } from "@/lib/services-data";

export function FeaturedService() {
  return (
    <section className="section-padding bg-surface-muted/50">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[5/4]">
            <Image
              src={featuredService.image}
              alt={featuredService.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            <span className="font-serif text-4xl text-accent-soft md:text-5xl">
              {featuredService.number}
            </span>
            <p className="mt-4 text-sm font-medium uppercase tracking-widest text-accent">
              {featuredService.label}
            </p>
            <h2 className="heading-section mt-4 text-foreground">{featuredService.title}</h2>
            <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
              {featuredService.description}
            </p>

            <ul className="mt-6 space-y-3">
              {featuredService.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-foreground md:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <LinkButton href={featuredService.href} variant="dark" size="lg">
                {featuredService.ctaLabel}
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
