import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-6 text-center">
      <div>
        <p className="eyebrow text-gold">404</p>
        <h1 className="display mt-4 text-5xl font-medium text-cream">
          This page <em>doesn&apos;t exist</em>.
        </h1>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-gold px-6 py-3 font-semibold text-ink hover:bg-gold-light">
          Back to the homepage
        </Link>
      </div>
    </main>
  );
}
