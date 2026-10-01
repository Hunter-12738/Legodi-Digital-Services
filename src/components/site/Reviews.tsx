"use client";

import { MessageSquarePlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { PUBLIC_REVIEW_COLUMNS, type PublicReview } from "@/lib/types";
import { Stars } from "@/components/ui/Stars";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";

const PAGE = 9;
const LIMIT = 100;

/**
 * Public reviews with live updates. A Supabase Realtime INSERT event is used as a signal and the list
 * is re-read from the database, so what visitors see is always what is actually stored.
 */
export function Reviews({ initial }: { initial: PublicReview[] }) {
  const [reviews, setReviews] = useState(initial);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [live, setLive] = useState(false);

  const merge = useCallback((incoming: PublicReview[], markFresh: boolean) => {
    setReviews((prev) => {
      const known = new Set(prev.map((r) => r.id));
      const added = incoming.filter((r) => !known.has(r.id));
      if (added.length && markFresh) setFresh((f) => new Set([...f, ...added.map((r) => r.id)]));
      const all = new Map([...prev, ...incoming].map((r) => [r.id, r]));
      return [...all.values()].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, LIMIT);
    });
  }, []);

  useEffect(() => {
    const sb = getBrowserClient();
    if (!sb) return;
    let cancelled = false;
    const refetch = async () => {
      const { data, error } = await sb.from("reviews").select(PUBLIC_REVIEW_COLUMNS).order("created_at", { ascending: false }).limit(LIMIT);
      if (!cancelled && !error && data) merge(data as PublicReview[], true);
    };
    const channel = sb
      .channel("public-reviews")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reviews" }, () => void refetch())
      .subscribe((status) => setLive(status === "SUBSCRIBED"));
    return () => {
      cancelled = true;
      void sb.removeChannel(channel);
    };
  }, [merge]);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const visible = showAll ? reviews : reviews.slice(0, PAGE);

  return (
    <>
      <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between" data-reveal>
        {reviews.length > 0 ? (
          <div className="card flex items-center gap-5 rounded-2xl px-6 py-4">
            <span className="font-display text-5xl font-medium text-gold-light">{avg.toFixed(1)}</span>
            <span>
              <Stars rating={Math.round(avg)} size={18} />
              <span className="mt-1 block text-sm text-muted">
                Average from {reviews.length} client {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </span>
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-4">
          {live && (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-muted" title="New reviews appear automatically">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              Live
            </span>
          )}
          <ReviewForm onSubmitted={(r) => merge([r], true)} />
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
          <MessageSquarePlus className="mx-auto size-9 text-gold" strokeWidth={1.4} aria-hidden="true" />
          <p className="mt-4 font-display text-2xl text-cream">Be the first to leave a review</p>
          <p className="mx-auto mt-2 max-w-md text-muted">Worked with us? We&apos;d love to hear about your experience.</p>
        </div>
      ) : (
        <div className="mt-12 columns-1 gap-5 md:columns-2 lg:columns-3">
          {visible.map((r) => (
            <ReviewCard key={r.id} review={r} fresh={fresh.has(r.id)} />
          ))}
        </div>
      )}

      {reviews.length > PAGE && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-cream transition hover:border-gold/60"
          >
            {showAll ? "Show fewer reviews" : `Show all ${reviews.length} reviews`}
          </button>
        </div>
      )}
    </>
  );
}
