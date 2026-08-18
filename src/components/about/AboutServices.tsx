import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import { aboutWhatWeDo } from "@/lib/about-data";

export function AboutServices() {
  return (
    <section className="section-padding border-t border-border bg-surface-muted/50">
      <Container>
        <h2 className="heading-section text-foreground">Чем мы занимаемся</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:gap-8">
          {aboutWhatWeDo.map((item, index) => (
            <article
              key={item.title}
              className="rounded-3xl border border-border bg-surface p-6 md:p-8"
            >
              <span className="font-serif text-2xl text-accent-soft">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-medium text-foreground md:text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 lg:mt-12">
          <LinkButton href="/services" variant="outline" size="lg">
            Посмотреть услуги
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
