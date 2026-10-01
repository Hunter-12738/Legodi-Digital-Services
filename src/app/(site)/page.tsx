import { PROJECTS, SERVICES, SITE } from "@/content/site";
import { siteUrl } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/server";
import { PUBLIC_REVIEW_COLUMNS, type PublicReview } from "@/lib/types";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Navbar } from "@/components/site/Navbar";
import { Portfolio } from "@/components/site/Portfolio";
import { Process } from "@/components/site/Process";
import { RevealObserver } from "@/components/site/RevealObserver";
import { Reviews } from "@/components/site/Reviews";
import { Services } from "@/components/site/Services";

// Static, refreshed every minute and immediately after a new review (revalidatePath).
export const revalidate = 60;

async function getReviews(): Promise<PublicReview[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  const { data, error } = await sb.from("reviews").select(PUBLIC_REVIEW_COLUMNS).order("created_at", { ascending: false }).limit(100);
  // Throwing keeps ISR serving the last good page instead of caching an empty review list.
  if (error) throw new Error(`Failed to load reviews: ${error.message}`);
  return (data ?? []) as PublicReview[];
}

export default async function HomePage() {
  const reviews = await getReviews();
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    url: siteUrl,
    description: SITE.seoDescription,
    telephone: SITE.phone,
    founder: { "@type": "Person", name: SITE.founder },
    areaServed: "ZA",
    image: `${siteUrl}/founder/tshegofatso-legodi.webp`,
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.description },
      priceSpecification: { "@type": "PriceSpecification", priceCurrency: "ZAR", [s.from ? "minPrice" : "price"]: Number(s.price.replace(/\D/g, "")) },
    })),
    subjectOf: PROJECTS.map((p) => ({ "@type": "CreativeWork", name: p.title, url: p.url })),
    ...(reviews.length
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: avg.toFixed(1), reviewCount: reviews.length, bestRating: 5, worstRating: 1 } }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped cannot break out of the script element.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Services />
        <Portfolio />
        <Process />
        <section id="reviews" aria-labelledby="reviews-title" className="relative overflow-hidden bg-night py-24 sm:py-32">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <div className="container-x">
            <div className="max-w-2xl" data-reveal>
              <p className="eyebrow flex items-center gap-3 text-gold">
                <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
                Reviews
              </p>
              <h2 id="reviews-title" className="display mt-5 text-4xl font-medium text-cream sm:text-5xl">
                What our clients <em>say</em>.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">Honest feedback from the businesses we&apos;ve worked with.</p>
            </div>
            <Reviews initial={reviews} />
          </div>
        </section>
        <About />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}

