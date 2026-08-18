import { Container } from "@/components/layout/Container";
import type { Review } from "@/types";
import { ReviewCard } from "./ReviewCard";

interface ReviewsGridProps {
  reviews: Review[];
}

export function ReviewsGrid({ reviews }: ReviewsGridProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="section-padding">
      <Container>
        <h2 className="heading-section text-foreground">Отзывы клиентов</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </Container>
    </section>
  );
}
