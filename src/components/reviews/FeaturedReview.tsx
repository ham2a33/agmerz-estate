import { Container } from "@/components/layout/Container";
import type { Review } from "@/types";
import { StarRating } from "./StarRating";

interface FeaturedReviewProps {
  review: Review;
}

export function FeaturedReview({ review }: FeaturedReviewProps) {
  return (
    <section className="section-padding border-b border-border/60 bg-surface-muted/50">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <StarRating rating={review.rating} size="lg" />
          <blockquote className="heading-section mt-8 text-foreground">
            &ldquo;{review.text}&rdquo;
          </blockquote>
          <footer className="mt-8">
            <cite className="not-italic">
              <p className="text-base font-medium text-foreground">{review.name}</p>
            </cite>
          </footer>
        </div>
      </Container>
    </section>
  );
}
