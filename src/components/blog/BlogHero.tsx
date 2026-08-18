import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { blogHero } from "@/lib/blog-data";

export function BlogHero() {
  return (
    <section className="border-b border-border/60 pb-10 pt-10 md:pb-12 md:pt-14">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              {blogHero.label}
            </p>
            <h1 className="heading-section mt-4 text-foreground">{blogHero.title}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              {blogHero.subtitle}
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[5/4]">
            <Image
              src={blogHero.image}
              alt="Блог AGMERZ ESTATE"
              fill
              sizes="(max-width: 1024px) 100vw, 360px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
