import { Container } from "@/components/layout/Container";
import { aboutTrust } from "@/lib/about-data";

export function AboutTrust() {
  return (
    <section className="section-padding bg-surface-muted/50">
      <Container>
        <h2 className="heading-section text-foreground">Нам важно ваше доверие</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:gap-8">
          {aboutTrust.map((item, index) => (
            <article
              key={item.title}
              className="border-t border-border pt-6 md:rounded-3xl md:border md:bg-surface md:p-8 md:pt-8"
            >
              <span className="font-serif text-2xl text-accent-soft">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-medium text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
