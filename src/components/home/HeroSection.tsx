import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import type { HomepageHeroConfig } from "@/types/homepage";

const benefits = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Проверенные объекты",
    description: "Тщательно отбираем недвижимость",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Персональный подбор",
    description: "Учитываем цели и бюджет",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    ),
    title: "Полное сопровождение",
    description: "От выбора до сделки",
  },
];

interface HeroSectionProps {
  hero: HomepageHeroConfig;
}

export function HeroSection({ hero }: HeroSectionProps) {
  if (!hero.enabled) return null;

  return (
    <section className="section-padding pb-0 md:pb-2">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
              </svg>
              Недвижимость в Грозном
            </div>

            <h1 className="heading-display text-foreground">{hero.title}</h1>

            {hero.subtitle && (
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg">
                {hero.subtitle}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <LinkButton href={hero.ctaLink} variant="dark" size="lg">
                {hero.ctaText}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </LinkButton>
              <LinkButton href="/request" variant="outline" size="lg">
                Получить консультацию
              </LinkButton>
            </div>
          </div>

          {hero.imageUrl && (
            <div className="relative animate-fade-in-up lg:pl-4" style={{ animationDelay: "0.15s" }}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[5/6] lg:aspect-[4/5]">
                <Image
                  src={hero.imageUrl}
                  alt={hero.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 grid gap-6 border-t border-border pt-10 sm:grid-cols-3 md:mt-16 md:gap-8">
          {benefits.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-accent">
                {item.icon}
              </div>
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
