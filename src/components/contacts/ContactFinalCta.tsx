import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";

export function ContactFinalCta() {
  return (
    <section className="section-padding border-t border-border">
      <Container>
        <div className="rounded-3xl border border-border bg-surface px-6 py-12 text-center md:px-12 md:py-16">
          <h2 className="heading-section mx-auto max-w-2xl text-foreground">
            Не знаете, с чего начать?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Расскажите нам, какую недвижимость вы ищете, и мы поможем подобрать подходящий вариант.
          </p>
          <div className="mt-8">
            <LinkButton href="/request" variant="dark" size="lg">
              Подобрать недвижимость
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
