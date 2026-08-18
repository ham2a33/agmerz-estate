import { Container } from "@/components/layout/Container";
import { aboutStory } from "@/lib/about-data";

export function AboutStory() {
  return (
    <section className="section-padding border-b border-border/60">
      <Container>
        <h2 className="heading-section text-foreground">Наша история</h2>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[240px_1fr] lg:gap-16">
          <div className="lg:pt-2">
            <span className="font-serif text-5xl text-accent-soft md:text-6xl">{aboutStory.number}</span>
            <p className="mt-6 text-sm font-medium uppercase tracking-widest text-foreground">
              {aboutStory.label}
            </p>
          </div>

          <div className="max-w-2xl space-y-5">
            {aboutStory.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-muted md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
