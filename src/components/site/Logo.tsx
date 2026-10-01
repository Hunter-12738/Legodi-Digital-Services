import { SITE } from "@/content/site";

/** Monogram + wordmark. */
export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="relative grid size-9 place-items-center rounded-[10px] border border-gold/40 bg-gradient-to-br from-surface-2 to-ink font-display text-lg font-semibold text-gold-light shadow-[0_0_24px_-6px_rgb(227_163_59/0.55)]"
      >
        L
        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-gold" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] font-semibold text-cream">Legodi&apos;s</span>
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-gold/80">Digital Systems</span>
        <span className="sr-only">{SITE.name}</span>
      </span>
    </span>
  );
}
