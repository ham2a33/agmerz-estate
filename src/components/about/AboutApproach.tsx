import { Container } from "@/components/layout/Container";
import { aboutApproach } from "@/lib/about-data";

export function AboutApproach() {
  return (
    <section className="section-padding bg-surface-muted/50">
      <Container>
        <h2 className="heading-section text-foreground">Наш подход</h2>

        <div className="mt-10 space-y-0 lg:mt-14">
          {aboutApproach.map((principle, index) => (
            <article
              key={principle.number}
              className={`grid gap-4 border-t border-border py-8 md:grid-cols-[120px_1fr] md:gap-8 md:py-10 lg:grid-cols-[160px_1fr] ${
                index === aboutApproach.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="font-serif text-4xl text-accent-soft md:text-5xl">
                {principle.number}
              </span>
              <div>
                <h3 className="font-serif text-2xl text-foreground md:text-3xl">{principle.title}</h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
                  {principle.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
