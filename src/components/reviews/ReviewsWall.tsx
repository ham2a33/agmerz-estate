import { Container } from "@/components/layout/Container";
import type { Review } from "@/types";
import { StarRating } from "./StarRating";

interface ReviewsWallProps {
  reviews: Review[];
}

const wallLayouts = ["lg:col-span-2", "lg:col-span-1", "lg:col-span-2 lg:col-start-2"];

export function ReviewsWall({ reviews }: ReviewsWallProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="section-padding bg-surface-muted/50">
      <Container>
        <h2 className="heading-section text-foreground">Слова клиентов</h2>

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {reviews.map((review, index) => (
            <figure
              key={review.id}
              className={`rounded-3xl border border-border bg-surface p-6 md:p-8 ${
                wallLayouts[index % wallLayouts.length]
              }`}
            >
              <StarRating rating={review.rating} />
              <blockquote className="mt-5 font-serif text-xl leading-snug text-foreground md:text-2xl">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm font-medium text-muted">{review.name}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
