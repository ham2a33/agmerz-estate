import { Container } from "@/components/layout/Container";
import { BrandLogo } from "@/components/brand/BrandLogo";

interface ServicesHeroProps {
  brand: string;
  logoUrl: string;
}

export function ServicesHero({ brand, logoUrl }: ServicesHeroProps) {
  return (
    <section className="border-b border-border/60 bg-background pb-14 pt-12 md:pb-20 md:pt-16">
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <BrandLogo size="hero" framed priority src={logoUrl} />

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.24em] text-accent">
            Наши услуги
          </p>

          <h1 className="heading-section mt-5 text-foreground">
            Полный комплекс услуг
            <span className="block">в сфере недвижимости</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Помогаем найти, купить, продать или арендовать недвижимость — от первого обращения до
            завершения сделки.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <span className="h-px w-12 bg-border" aria-hidden="true" />
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{brand}</p>
            <span className="h-px w-12 bg-border" aria-hidden="true" />
          </div>
        </div>
      </Container>
    </section>
  );
}
