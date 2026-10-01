"use client";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-6 text-center">
      <div>
        <h1 className="display text-4xl font-medium text-cream">Something went wrong.</h1>
        <p className="mt-4 text-muted">Please try again in a moment.</p>
        <button type="button" onClick={reset} className="mt-8 rounded-full bg-gold px-6 py-3 font-semibold text-ink hover:bg-gold-light">
          Try again
        </button>
      </div>
    </main>
  );
}
