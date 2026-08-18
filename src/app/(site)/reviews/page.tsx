import type { Metadata } from "next";
import { ReviewsHero } from "@/components/reviews/ReviewsHero";
import { FeaturedReview } from "@/components/reviews/FeaturedReview";
import { ReviewsTrust } from "@/components/reviews/ReviewsTrust";
import { ReviewsGrid } from "@/components/reviews/ReviewsGrid";
import { ReviewsWall } from "@/components/reviews/ReviewsWall";
import { ReviewsFinalCta } from "@/components/reviews/ReviewsFinalCta";
import {
  getAverageRating,
  getFeaturedReview,
  getPublishedReviews,
  getReviewsWithoutFeatured,
} from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Отзывы клиентов — AGMERZ ESTATE",
  description:
    "Отзывы клиентов AGMERZ ESTATE о работе с недвижимостью, подборе объектов, аренде и сопровождении сделок.",
};

export default async function ReviewsPage() {
  const publishedReviews = await getPublishedReviews();
  const featuredReview = await getFeaturedReview();
  const gridReviews = await getReviewsWithoutFeatured(featuredReview);
  const averageRating = getAverageRating(publishedReviews);

  return (
    <>
      <ReviewsHero />
      {featuredReview && <FeaturedReview review={featuredReview} />}
      <ReviewsTrust averageRating={averageRating} reviewCount={publishedReviews.length} />
      <ReviewsGrid reviews={gridReviews.length > 0 ? gridReviews : publishedReviews} />
      <ReviewsWall reviews={publishedReviews} />
      <ReviewsFinalCta />
    </>
  );
}
