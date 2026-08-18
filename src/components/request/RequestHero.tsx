import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { BrandLogo } from "@/components/brand/BrandLogo";

interface RequestHeroProps {
  logoUrl: string;
  heroImageUrl?: string;
}

export function RequestHero({ logoUrl, heroImageUrl }: RequestHeroProps) {
  return (
    <section className="border-b border-border/60 bg-surface-muted/40 pb-12 pt-10 md:pb-16 md:pt-14">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          <div className="max-w-2xl">
            <BrandLogo size="md" className="mb-8" src={logoUrl} />
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              Персональный подбор
            </p>
            <h1 className="heading-section mt-4 text-foreground">Найти недвижимость</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              Расскажите, какую недвижимость вы ищете — мы подберём подходящие варианты под ваши
              требования.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Бесплатная консультация
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Индивидуальный подбор
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Сопровождение сделки
              </li>
            </ul>
          </div>

          {heroImageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_16px_48px_rgba(17,17,17,0.08)] lg:aspect-[5/4]">
              <Image
                src={heroImageUrl}
                alt="Подбор недвижимости AGMERZ ESTATE"
                fill
                sizes="(max-width: 1024px) 100vw, 340px"
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
