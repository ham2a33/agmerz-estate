import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import { aboutTimeline } from "@/lib/about-data";

export function AboutTimeline() {
  return (
    <section className="section-padding border-t border-border">
      <Container>
        <h2 className="heading-section text-foreground">Как мы помогаем</h2>

        <div className="mt-10 lg:mt-14">
          <div className="flex flex-col gap-0 md:gap-6 lg:flex-row lg:items-start lg:justify-between">
            {aboutTimeline.map((step, index) => (
              <div key={step.number} className="flex flex-1 flex-col items-start md:flex-row lg:flex-col">
                <article className="w-full border-t border-border py-6 lg:border-t-0 lg:py-0">
                  <span className="font-serif text-3xl text-accent-soft md:text-4xl">{step.number}</span>
                  <h3 className="mt-3 text-lg font-medium text-foreground md:text-xl">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                    {step.description}
                  </p>
                </article>

                {index < aboutTimeline.length - 1 && (
                  <div
                    className="hidden shrink-0 items-center justify-center px-2 pt-8 text-accent-soft lg:flex"
                    aria-hidden
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </div>
                )}

                {index < aboutTimeline.length - 1 && (
                  <div className="flex justify-center py-2 text-accent-soft md:hidden" aria-hidden>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M12 5v14M7 14l5 5 5-5" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8 lg:mt-12">
          <LinkButton href="/services" variant="outline" size="lg">
            Как мы работаем
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
