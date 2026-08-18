import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { favoritesHero } from "@/lib/favorites-data";

export function FavoritesHero() {
  return (
    <section className="border-b border-border/60 pb-8 pt-8 md:pb-10 md:pt-10">
      <Container>
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_240px] lg:gap-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              {favoritesHero.label}
            </p>
            <h1 className="font-serif text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
              {favoritesHero.title}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              {favoritesHero.subtitle}
            </p>
          </div>

          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block">
            <Image
              src={favoritesHero.image}
              alt="Избранное AGMERZ ESTATE"
              fill
              sizes="240px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
