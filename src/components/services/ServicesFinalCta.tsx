import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";

export function ServicesFinalCta() {
  return (
    <section className="section-padding border-t border-border">
      <Container>
        <div className="rounded-3xl border border-border bg-surface px-6 py-12 text-center md:px-12 md:py-16">
          <h2 className="heading-section mx-auto max-w-2xl text-foreground">Давайте начнём</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Расскажите, какая задача стоит перед вами, и мы предложим подходящий вариант работы.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href="/request" variant="dark" size="lg">
              Подобрать недвижимость
            </LinkButton>
            <LinkButton href="/contacts" variant="outline" size="lg">
              Связаться
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
