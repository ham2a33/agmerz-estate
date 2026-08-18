import { Container } from "@/components/layout/Container";
import { reviewsClientExperience } from "@/lib/reviews-data";
import { StarRating } from "./StarRating";

function getReviewCountLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "отзыв";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "отзыва";
  return "отзывов";
}

interface ReviewsTrustProps {
  averageRating: number | null;
  reviewCount: number;
}

export function ReviewsTrust({ averageRating, reviewCount }: ReviewsTrustProps) {
  const showRating = averageRating !== null && reviewCount > 0;

  return (
    <section className="section-padding border-b border-border/60">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="heading-section text-foreground">Ваше доверие — наша ответственность</h2>

            {showRating ? (
              <div className="mt-8">
                <StarRating rating={Math.round(averageRating)} size="lg" />
                <p className="mt-4 text-sm font-medium uppercase tracking-widest text-muted">
                  Средняя оценка
                </p>
                <p className="mt-2 font-serif text-5xl text-foreground md:text-6xl">
                  {averageRating.toFixed(1)}
                </p>
                <p className="mt-3 text-sm text-muted">
                  На основе {reviewCount} {getReviewCountLabel(reviewCount)}
                </p>
              </div>
            ) : (
              <ul className="mt-8 space-y-4">
                {["Внимание к деталям", "Персональный подход", "Прозрачная коммуникация"].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="text-base text-foreground">{item}</span>
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>

          <div>
            <h3 className="font-serif text-2xl text-foreground md:text-3xl">
              Что особенно важно нашим клиентам
            </h3>

            <div className="mt-8 space-y-0">
              {reviewsClientExperience.map((item, index) => (
                <article
                  key={item.number}
                  className={`border-t border-border py-6 ${
                    index === reviewsClientExperience.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span className="font-serif text-2xl text-accent-soft">{item.number}</span>
                  <h4 className="mt-2 text-lg font-medium text-foreground">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
