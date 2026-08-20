import Image from "next/image";
import { Container } from "@/components/layout/Container";
import type { StoreConfig } from "@/lib/store-config.types";

interface ContactHeroProps {
  config: StoreConfig;
  title?: string;
  description?: string;
  heroImageUrl?: string;
}

export function ContactHero({
  config,
  title = "Давайте поговорим",
  description = "Расскажите, что вы ищете — мы поможем подобрать недвижимость, организовать просмотр и ответим на все вопросы.",
  heroImageUrl,
}: ContactHeroProps) {
  return (
    <section className="border-b border-border/60 pb-10 pt-10 md:pb-12 md:pt-14">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              {config.brand}
            </p>
            <h1 className="heading-section mt-4 text-foreground">{title}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              {description}
            </p>
          </div>

          {heroImageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-surface-muted">
              <Image
                src={heroImageUrl}
                alt={`Офис ${config.brand}`}
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
