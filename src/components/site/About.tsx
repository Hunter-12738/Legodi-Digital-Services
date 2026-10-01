import { Code2, Gem, Rocket, Target } from "lucide-react";
import Image from "next/image";
import { SITE } from "@/content/site";

const BADGES = [
  { Icon: Code2, label: "Self-taught Developer" },
  { Icon: Target, label: "Conversion Focused" },
  { Icon: Rocket, label: "Scalable Systems" },
  { Icon: Gem, label: "Premium Delivery" },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-night py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5" data-reveal>
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div aria-hidden="true" className="absolute -inset-5 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_40%,rgb(227_163_59/0.25),transparent_65%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-gold/60 shadow-[0_0_60px_-15px_rgb(227_163_59/0.55)]">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/founder/tshegofatso-legodi.webp"
                  alt={`${SITE.founder}, founder of ${SITE.name}`}
                  fill
                  sizes="(min-width: 1024px) 38vw, 90vw"
                  className="object-cover object-[50%_20%]"
                />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/90 to-transparent" />
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 w-max -translate-x-1/2 rounded-xl border border-gold/50 bg-ink/90 px-6 py-3 text-center backdrop-blur">
              <span className="block text-[0.62rem] font-semibold tracking-[0.28em] text-sand/80">FOUNDER</span>
              <span className="block font-display text-xl text-gold-light">{SITE.founder}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 lg:col-span-7 lg:mt-0" data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          <p className="eyebrow flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
            Meet the Founder
          </p>
          <h2 id="about-title" className="display mt-5 text-4xl font-medium text-cream sm:text-5xl">
            Building the digital systems behind <em>ambitious brands</em>.
          </h2>
          <div className="mt-7 space-y-5 text-lg leading-relaxed text-muted">
            <p>
              I&apos;m <strong className="font-semibold text-cream">{SITE.founder}</strong>, founder of {SITE.name}. I build websites,
              automation and digital systems designed to help businesses operate and grow more effectively.
            </p>
            <p>
              Every project starts with how your business actually works — how customers find you, enquire, book, order and pay — and
              ends with a system that handles it properly. Clean, professional and built to save you time, so you can focus on running
              your business.
            </p>
          </div>
          <ul className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BADGES.map(({ Icon, label }) => (
              <li key={label} className="card flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-sand">
                <Icon className="size-5 shrink-0 text-gold" strokeWidth={1.6} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
