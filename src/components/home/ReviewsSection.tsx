import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { StarRating } from "@/components/reviews/StarRating";
import type { Review } from "@/types";

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="section-padding">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="heading-section text-foreground">Клиенты говорят о нас</h2>
          <Link
            href="/reviews"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Все отзывы →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="card-hover flex flex-col rounded-3xl border border-border bg-surface p-6 md:p-8"
            >
              <StarRating rating={review.rating} />
              <p className="mt-5 flex-1 text-sm leading-relaxed text-muted md:text-base">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-6 text-sm font-medium text-foreground">{review.name}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
