import { Star } from "lucide-react";

export function Stars({ rating, size = 16, className = "" }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          width={size}
          height={size}
          aria-hidden="true"
          className={n <= rating ? "fill-gold text-gold" : "fill-transparent text-white/20"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
