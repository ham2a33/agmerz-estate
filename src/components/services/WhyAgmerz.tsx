import { Container } from "@/components/layout/Container";
import { servicesWhyAgmerz } from "@/lib/services-data";

export function WhyAgmerz() {
  return (
    <section className="section-padding border-t border-border bg-surface-muted/50">
      <Container>
        <h2 className="heading-section text-foreground">Почему AGMERZ ESTATE</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:gap-8">
          {servicesWhyAgmerz.map((item) => (
            <article
              key={item.number}
              className="rounded-3xl border border-border bg-surface p-6 md:p-8"
            >
              <span className="font-serif text-2xl text-accent-soft">{item.number}</span>
              <h3 className="mt-3 text-lg font-medium text-foreground md:text-xl">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
