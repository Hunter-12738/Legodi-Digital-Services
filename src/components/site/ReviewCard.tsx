import { Quote } from "lucide-react";
import type { PublicReview } from "@/lib/types";
import { Stars } from "@/components/ui/Stars";

const dateFmt = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Johannesburg" });

/** All review text is rendered as plain text (React escapes it) — never as HTML. */
export function ReviewCard({ review, fresh = false }: { review: PublicReview; fresh?: boolean }) {
  const initials = review.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
  return (
    <figure
      className={`card relative mb-5 break-inside-avoid rounded-2xl p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-line-strong sm:p-7 ${
        fresh ? "animate-rise border-gold/70 shadow-[0_0_40px_-12px_rgb(227_163_59/0.7)]" : ""
      }`}
    >
      <Quote aria-hidden="true" className="absolute right-6 top-6 size-8 text-gold/20" strokeWidth={1.2} />
      <Stars rating={review.rating} />
      <blockquote className="mt-4 whitespace-pre-line break-words text-[1.02rem] leading-relaxed text-sand">{review.review}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-white/[0.07] pt-5">
        <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong bg-gold/10 font-display text-sm text-gold-light">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-cream">{review.name}</span>
          {review.company && <span className="block truncate text-sm text-muted">{review.company}</span>}
        </span>
        <time dateTime={review.created_at} className="shrink-0 text-xs text-faint">
          {dateFmt.format(new Date(review.created_at))}
        </time>
      </figcaption>
    </figure>
  );
}
