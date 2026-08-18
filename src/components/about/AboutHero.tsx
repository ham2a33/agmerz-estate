import { Container } from "@/components/layout/Container";
import { BrandLogo } from "@/components/brand/BrandLogo";

interface AboutHeroProps {
  brand: string;
  logoUrl: string;
  city: string;
}

export function AboutHero({ brand, logoUrl, city }: AboutHeroProps) {
  return (
    <section className="border-b border-border/60 bg-background pb-14 pt-12 md:pb-20 md:pt-16">
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <BrandLogo size="hero" framed priority src={logoUrl} />

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.24em] text-accent">
            О компании
          </p>

          <h1 className="heading-section mt-5 text-foreground">{brand}</h1>

          <p className="mt-4 max-w-2xl font-serif text-2xl leading-snug text-foreground/90 md:text-3xl">
            Недвижимость, которую
            <span className="block">выбирают осознанно</span>
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Мы помогаем людям находить места, которые становятся частью их жизни, и сопровождаем
            сделки с вниманием к каждой детали.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <span className="h-px w-12 bg-border" aria-hidden="true" />
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{city}</p>
            <span className="h-px w-12 bg-border" aria-hidden="true" />
          </div>
        </div>
      </Container>
    </section>
  );
}
