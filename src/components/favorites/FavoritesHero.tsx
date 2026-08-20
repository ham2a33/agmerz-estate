import Image from "next/image";
import { Container } from "@/components/layout/Container";
import type { PageHeroConfig } from "@/types/pages";

interface FavoritesHeroProps {
  hero?: PageHeroConfig;
}

export function FavoritesHero({ hero }: FavoritesHeroProps) {
  const title = hero?.title ?? "Объекты, которые вам понравились";
  const description =
    hero?.description ?? "Сохраняйте интересующие объекты, чтобы вернуться к ним позже.";
  const imageUrl =
    hero?.imageUrl ??
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640&q=80";

  return (
    <section className="border-b border-border/60 pb-8 pt-8 md:pb-10 md:pt-10">
      <Container>
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_240px] lg:gap-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Избранное</p>
            <h1 className="font-serif text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{description}</p>
          </div>

          {imageUrl && (
            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block">
              <Image
                src={imageUrl}
                alt="Избранное AGMERZ ESTATE"
                fill
                sizes="240px"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
