import { ArrowRight, ArrowUpRight, CalendarCheck, Inbox, ReceiptText, Star, Ticket } from "lucide-react";
import { SERVICES, SITE } from "@/content/site";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-40">
      {/* Atmosphere: warm glow, fine grid, grain */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-48 -top-48 size-[46rem] rounded-full bg-[radial-gradient(circle,rgb(227_163_59/0.22),transparent_62%)]" />
        <div className="absolute -left-56 top-1/2 size-[34rem] rounded-full bg-[radial-gradient(circle,rgb(122_85_54/0.28),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(227_163_59/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(227_163_59/0.06)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_72%)]" />
        <div className="grain absolute inset-0 opacity-[0.04]" />
      </div>

      <div className="container-x relative grid items-center gap-14 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-28">
        <div>
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-sand">
            <span className="size-1.5 rounded-full bg-gold shadow-[0_0_10px_rgb(227_163_59)]" aria-hidden="true" />
            Websites · Automation · Digital Systems
          </p>
          {/* Not animated: it is the LCP element. */}
          <h1 className="display mt-6 text-[2.55rem] font-medium text-cream sm:text-6xl lg:text-[4.3rem]">
            We Build Digital Systems Behind <em>Ambitious Brands</em>.
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl" style={{ animationDelay: "120ms" }}>
            {SITE.description}
          </p>
          <div className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "200ms" }}>
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_0_40px_-8px_rgb(227_163_59/0.8)]"
            >
              Start Your Project
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#work"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 font-semibold text-cream transition-all hover:border-gold/60 hover:bg-white/[0.04]"
            >
              View Our Work
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <p className="animate-rise mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted" style={{ animationDelay: "280ms" }}>
            <span>
              Websites from <strong className="font-semibold text-gold-light">R8,500</strong>
            </span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden="true" />
            <span>
              Business systems from <strong className="font-semibold text-gold-light">R250</strong>
            </span>
          </p>
        </div>

        <SystemVisual />
      </div>

      <div className="relative border-y border-line bg-night py-5" aria-label="What we build">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <ul className="animate-marquee flex shrink-0 items-center gap-10 pr-10 motion-reduce:animate-none">
            {[...SERVICES, ...SERVICES, ...SERVICES, ...SERVICES].map((s, i) => (
              <li
                key={i}
                aria-hidden={i >= SERVICES.length ? "true" : undefined}
                className="flex shrink-0 items-center gap-10 font-display text-xl italic text-cream/80 sm:text-2xl"
              >
                {s.title}
                <span className="size-1.5 rotate-45 bg-gold" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Illustrative product UI showing the kinds of systems we build. Decorative only — no names, numbers or claims. */
function SystemVisual() {
  const rows = [
    { Icon: ReceiptText, label: "Quotation sent", pill: "Paid", tone: "bg-success/15 text-success" },
    { Icon: CalendarCheck, label: "New booking", pill: "Confirmed", tone: "bg-gold/15 text-gold-light" },
    { Icon: Ticket, label: "Ticket scanned", pill: "Verified", tone: "bg-white/10 text-sand" },
    { Icon: Inbox, label: "Website enquiry", pill: "New", tone: "bg-gold/15 text-gold-light" },
  ];
  return (
    <div aria-hidden="true" className="animate-rise relative mx-auto w-full max-w-lg lg:max-w-none" style={{ animationDelay: "180ms" }}>
      <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_60%_40%,rgb(227_163_59/0.18),transparent_65%)] blur-xl" />
      <div className="relative rounded-[1.75rem] border border-line-strong bg-surface p-2 shadow-[0_50px_100px_-30px_rgb(0_0_0/0.9),0_0_60px_-20px_rgb(227_163_59/0.35)]">
        <div className="rounded-[1.4rem] bg-gradient-to-b from-surface-2 to-night p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-gold/70" />
            </div>
            <span className="rounded-full border border-line px-3 py-1 text-[0.65rem] font-medium tracking-wider text-muted">your-business / dashboard</span>
          </div>
          <div className="mt-6 grid grid-cols-[auto_1fr] gap-5">
            <div className="flex flex-col gap-3 pt-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={`size-7 rounded-lg ${i === 0 ? "bg-gold/80 shadow-[0_0_14px_rgb(227_163_59/0.6)]" : "bg-white/[0.06]"}`} />
              ))}
            </div>
            <div>
              <div className="h-2.5 w-28 rounded-full bg-cream/70" />
              <div className="mt-2 h-2 w-44 rounded-full bg-white/10" />
              <ul className="mt-5 space-y-2.5">
                {rows.map(({ Icon, label, pill, tone }, i) => (
                  <li
                    key={label}
                    className="animate-rise flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
                    style={{ animationDelay: `${450 + i * 140}ms` }}
                  >
                    <span className="grid size-8 place-items-center rounded-lg border border-line bg-gold/[0.06] text-gold">
                      <Icon className="size-4" strokeWidth={1.7} />
                    </span>
                    <span className="flex-1 text-sm text-cream/85">{label}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold ${tone}`}>{pill}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex h-16 items-end gap-1.5">
                {[38, 52, 44, 66, 58, 74, 62, 86, 72, 92].map((h, i) => (
                  <span key={i} className="flex-1 rounded-t-[4px] bg-gradient-to-t from-gold-deep/30 to-gold-light/80" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="animate-float absolute -left-4 top-10 hidden items-center gap-3 rounded-2xl border border-line-strong bg-surface-2/95 px-4 py-3 shadow-2xl backdrop-blur sm:flex lg:-left-10">
        <span className="grid size-9 place-items-center rounded-xl bg-gold/15 text-gold">
          <Inbox className="size-4" />
        </span>
        <span className="text-sm font-semibold text-cream">Enquiry captured</span>
      </div>
      <div
        className="animate-float absolute -bottom-6 -right-2 hidden items-center gap-2 rounded-2xl border border-line-strong bg-surface-2/95 px-4 py-3 shadow-2xl backdrop-blur sm:flex lg:-right-6"
        style={{ animationDelay: "-3.5s" }}
      >
        <span className="flex gap-0.5 text-gold">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="size-3.5 fill-current" />
          ))}
        </span>
        <span className="text-sm font-semibold text-cream">Review received</span>
      </div>
    </div>
  );
}
