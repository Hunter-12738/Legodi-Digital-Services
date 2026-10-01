"use client";

import { CheckCircle2, Loader2, PenLine, Star, X } from "lucide-react";
import { useRef, useState } from "react";
import { submitReview } from "@/app/actions";
import type { PublicReview } from "@/lib/types";
import { FormMessage, Honeypot, TextArea, TextInput, useFormAction } from "@/components/ui/form";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export function ReviewForm({ onSubmitted }: { onSubmitted: (review: PublicReview) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [length, setLength] = useState(0);
  const { pending, result, setResult, onSubmit, errors } = useFormAction(submitReview, {
    resetOnSuccess: true,
    onSuccess: (r) => {
      setDone(true);
      setRating(0);
      setLength(0);
      if (r.ok && r.review) onSubmitted(r.review);
    },
  });

  const open = () => {
    setDone(false);
    setResult(null);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_0_30px_-6px_rgb(227_163_59/0.7)]"
      >
        <PenLine className="size-4" aria-hidden="true" />
        Leave a Review
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="review-dialog-title"
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(40rem,calc(100%-1.5rem))] overflow-y-auto rounded-3xl border border-line-strong bg-surface p-0 text-cream shadow-[0_0_80px_-20px_rgb(227_163_59/0.4)] open:animate-rise"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface/95 px-6 py-4 backdrop-blur sm:px-8">
          <h2 id="review-dialog-title" className="font-display text-2xl font-medium">
            {done ? "Thank you" : "Leave a Review"}
          </h2>
          <button type="button" onClick={close} className="grid size-10 place-items-center rounded-full text-muted hover:bg-white/5 hover:text-cream" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>

        {done ? (
          <div className="px-6 py-12 text-center sm:px-8" role="status">
            <CheckCircle2 className="mx-auto size-12 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <p className="mx-auto mt-5 max-w-sm text-lg leading-relaxed text-cream">{result?.ok && result.message}</p>
            <button type="button" onClick={close} className="mt-8 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-gold-light">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="relative space-y-5 px-6 py-6 sm:px-8">
            <Honeypot />
            <p className="text-sm text-muted">Your review will appear on the website straight away. Your email address is never shown publicly.</p>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-sand">
                Star rating <span className="text-gold">*</span>
              </legend>
              <div className="flex items-center gap-3" onMouseLeave={() => setHover(0)}>
                <div className="flex" role="radiogroup" aria-label="Star rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className="cursor-pointer p-1" onMouseEnter={() => setHover(n)}>
                      <input
                        type="radio"
                        name="rating"
                        value={n}
                        checked={rating === n}
                        onChange={() => setRating(n)}
                        className="peer sr-only"
                        aria-label={`${n} star${n > 1 ? "s" : ""} — ${LABELS[n]}`}
                      />
                      <Star
                        aria-hidden="true"
                        strokeWidth={1.4}
                        className={`size-8 rounded transition-transform peer-focus-visible:outline-2 peer-focus-visible:outline-gold hover:scale-110 ${
                          n <= (hover || rating) ? "fill-gold text-gold drop-shadow-[0_0_8px_rgb(227_163_59/0.6)]" : "fill-transparent text-white/25"
                        }`}
                      />
                    </label>
                  ))}
                </div>
                <span className="text-sm text-muted" aria-live="polite">{LABELS[hover || rating]}</span>
              </div>
              {errors.rating && <p className="mt-1.5 text-xs font-medium text-danger">{errors.rating}</p>}
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <TextInput label="Name" name="name" required autoComplete="name" minLength={2} maxLength={80} error={errors.name} />
              <TextInput label="Company" name="company" autoComplete="organization" maxLength={120} error={errors.company} />
            </div>
            <TextInput label="Email" name="email" type="email" required autoComplete="email" maxLength={254} error={errors.email} hint="Not displayed on the website." />
            <TextArea
              label="Review"
              name="review"
              required
              minLength={20}
              maxLength={1200}
              placeholder="How was your experience working with us?"
              error={errors.review}
              hint={`${length}/1200 characters (minimum 20)`}
              onChange={(e) => setLength(e.target.value.length)}
            />

            <FormMessage result={result && !result.ok ? result : null} />

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={close} className="rounded-full px-6 py-3 text-sm font-semibold text-muted hover:text-cream">
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-gold-light disabled:opacity-60"
              >
                {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                {pending ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
