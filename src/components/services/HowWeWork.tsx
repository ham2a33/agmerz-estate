import { Container } from "@/components/layout/Container";
import { howWeWorkSteps } from "@/lib/services-data";

export function HowWeWork() {
  return (
    <section className="section-padding">
      <Container>
        <h2 className="heading-section text-foreground">Как мы работаем</h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {howWeWorkSteps.map((step) => (
            <article
              key={step.number}
              className="border-t border-border pt-6 lg:border-t-0 lg:pt-0 lg:pl-0"
            >
              <span className="font-serif text-3xl text-accent-soft md:text-4xl">{step.number}</span>
              <h3 className="mt-4 text-lg font-medium text-foreground md:text-xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
