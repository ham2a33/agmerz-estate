import Image from "next/image";
import type { Review } from "@/types";
import { StarRating } from "./StarRating";

interface ReviewCardProps {
  review: Review;
  variant?: "default" | "compact";
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ReviewCard({ review, variant = "default" }: ReviewCardProps) {
  const isCompact = variant === "compact";

  return (
    <article
      className={`flex flex-col rounded-3xl border border-border bg-surface ${
        isCompact ? "p-5 md:p-6" : "card-hover p-6 md:p-8"
      }`}
    >
      <div className="flex items-center gap-3">
        {review.avatar ? (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image src={review.avatar} alt={review.name} fill className="object-cover" sizes="40px" />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-medium text-foreground">
            {getInitials(review.name)}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-foreground">{review.name}</p>
          <StarRating rating={review.rating} size="sm" />
        </div>
      </div>

      <p
        className={`mt-5 flex-1 leading-relaxed text-muted ${
          isCompact ? "text-sm" : "text-sm md:text-base"
        }`}
      >
        &ldquo;{review.text}&rdquo;
      </p>
    </article>
  );
}
