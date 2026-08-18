import { Container } from "@/components/layout/Container";

const advantages = [
  {
    number: "01",
    title: "Проверенные объекты",
    description: "Мы тщательно отбираем недвижимость — проверяем документы, локацию и реальную ценность каждого объекта.",
  },
  {
    number: "02",
    title: "Персональный подбор",
    description: "Учитываем цели, бюджет и образ жизни каждого клиента. Не предлагаем всё подряд — только то, что подходит.",
  },
  {
    number: "03",
    title: "Полное сопровождение",
    description: "Помогаем пройти путь от выбора объекта до сделки — юридическая поддержка, переговоры, оформление.",
  },
  {
    number: "04",
    title: "Прозрачность",
    description: "Без скрытых условий и неожиданных расходов. Вы всегда понимаете, за что платите и на каком этапе находитесь.",
  },
];

export function WhyAgmerz() {
  return (
    <section className="section-padding">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Почему AGMERZ</p>
            <h2 className="heading-section mt-4 text-foreground">
              Мы занимаемся недвижимостью, а не просто продажами
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              AGMERZ ESTATE — это команда, которая помогает найти пространство для жизни и будущего.
              Мы работаем с жилой и коммерческой недвижимостью, опираясь на локальную экспертизу и
              профессиональный подход.
            </p>
          </div>

          <div className="flex flex-col gap-8 md:gap-10">
            {advantages.map((item) => (
              <article
                key={item.number}
                className="group border-t border-border pt-8 transition-colors first:border-t-0 first:pt-0 md:first:border-t md:first:pt-8"
              >
                <div className="flex items-start gap-6">
                  <span className="font-serif text-3xl text-accent-soft transition-colors group-hover:text-accent md:text-4xl">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="text-xl font-medium text-foreground md:text-2xl">{item.title}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted md:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
