interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({ rating, size = "md" }: StarRatingProps) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка: ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className={`${sizeClasses[size]} ${
            index < rating ? "fill-accent text-accent" : "fill-border text-border"
          }`}
          aria-hidden
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.35l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}
