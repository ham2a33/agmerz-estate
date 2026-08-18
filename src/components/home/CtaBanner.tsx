import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";

const benefits = [
  "Персональный подбор",
  "Актуальные объекты",
  "Консультация специалиста",
];

export function CtaBanner() {
  return (
    <section className="section-padding">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface shadow-[0_16px_60px_rgba(17,17,17,0.06)]">
          <div
            className="pointer-events-none absolute -right-16 top-8 hidden h-48 w-48 rounded-full border border-accent/15 md:block"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-10 bottom-10 hidden h-32 w-32 rounded-full bg-accent/[0.04] md:block"
            aria-hidden="true"
          />

          <div className="grid gap-10 p-8 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-12 md:p-12 lg:p-16">
            <div className="max-w-xl animate-fade-in-up">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-accent">
                Подбор недвижимости
              </p>
              <h2 className="heading-section mt-5 text-foreground">
                Найдём недвижимость,
                <span className="block">которая подходит именно вам</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
                Расскажите о ваших требованиях — наши специалисты подберут подходящие варианты и
                свяжутся с вами.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-surface-muted/35 p-6 md:p-8">
              <div className="border-b border-border/70 pb-6">
                <LinkButton
                  href="/request"
                  variant="dark"
                  size="lg"
                  className="w-full justify-center transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(17,17,17,0.14)] sm:w-auto sm:min-w-[260px]"
                >
                  Подобрать недвижимость
                </LinkButton>
              </div>

              <ul className="mt-6 space-y-3.5">
                {benefits.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground md:text-base">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-surface text-[11px] text-accent">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
