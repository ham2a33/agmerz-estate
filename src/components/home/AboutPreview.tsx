import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import type { HomepageAboutSectionConfig } from "@/types/homepage";

const highlights = [
  "Профессиональный подход к каждому клиенту",
  "Локальная экспертиза рынка Грозного",
  "Сопровождение на всех этапах сделки",
  "Жилая и коммерческая недвижимость",
];

interface AboutPreviewProps {
  aboutSection: HomepageAboutSectionConfig;
}

export function AboutPreview({ aboutSection }: AboutPreviewProps) {
  return (
    <section className="section-padding bg-surface-muted/50">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h2 className="heading-section text-foreground">{aboutSection.title}</h2>
            <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">{aboutSection.text}</p>
            <LinkButton href="/about" variant="outline" size="lg" className="mt-8">
              Подробнее о компании
            </LinkButton>
          </div>

          <ul className="flex flex-col gap-4">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-sm leading-relaxed text-foreground md:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
