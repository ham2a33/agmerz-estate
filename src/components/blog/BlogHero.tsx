import Image from "next/image";
import { Container } from "@/components/layout/Container";
import type { PageHeroConfig } from "@/types/pages";

interface BlogHeroProps {
  hero?: PageHeroConfig;
}

export function BlogHero({ hero }: BlogHeroProps) {
  const title = hero?.title ?? "Идеи, знания и недвижимость";
  const description =
    hero?.description ??
    "Разбираемся в рынке недвижимости, делимся полезными советами и рассказываем о том, что помогает принимать решения увереннее.";
  const imageUrl =
    hero?.imageUrl ??
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80";

  return (
    <section className="border-b border-border/60 pb-10 pt-10 md:pb-12 md:pt-14">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Блог AGMERZ</p>
            <h1 className="heading-section mt-4 text-foreground">{title}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              {description}
            </p>
          </div>

          {imageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[5/4]">
              <Image
                src={imageUrl}
                alt="Блог AGMERZ ESTATE"
                fill
                sizes="(max-width: 1024px) 100vw, 360px"
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
