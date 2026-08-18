import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import { reviewsFinalCta } from "@/lib/reviews-data";

export function ReviewsFinalCta() {
  return (
    <section className="section-padding border-t border-border">
      <Container>
        <div className="rounded-3xl border border-border bg-surface px-6 py-12 text-center md:px-12 md:py-16">
          <h2 className="heading-section mx-auto max-w-2xl text-foreground">
            {reviewsFinalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {reviewsFinalCta.description}
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <LinkButton href="/request" variant="dark" size="lg" className="w-full sm:w-auto">
              Подобрать недвижимость
            </LinkButton>
            <LinkButton href="/contacts" variant="outline" size="lg" className="w-full sm:w-auto">
              Связаться
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
